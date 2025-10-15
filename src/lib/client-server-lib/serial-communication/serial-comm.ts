import { LogCommand, LogError, LogInfo, LogWarning } from "$lib/components/log-window/state.svelte";
import { GlobalMotorCommandsMap } from "../../../hooks.client";
import { LogLevelType, type LogCommandType, type StatusErrorCodesType } from "../types";
import { GetCurrentBrowser, sleep, Uint8ArrayToString } from "../utils";
import { SerialPortState, SetSerialPort, SetSerialPortQueue, SetSerialPortReader, SetSerialPortWriter } from "./state.svelte";

let CommandTimeoutHandle: NodeJS.Timeout | null = null
let DisconnectTimeout: NodeJS.Timeout | null = null

export class SerialPortActions {

    static async ConnectToSerialPort(BaudRate: number = 230400) {
        const currentBrowser = GetCurrentBrowser();
        if (currentBrowser != "Chrome" && currentBrowser != "Edge") {
            LogError(
                "Only Chrome and Edge browsers are supported!"
            );
            return;
        }

        try {
            if (SerialPortState.SerialPort != null) {
                LogInfo(
                    "You are trying to open a new serial port, we will close the current one for you."
                );
                await SerialPortActions.DisconnectFromSerialPort();
                if (SerialPortState.SerialPort != null ||
                    SerialPortState.SerialPortReader != null
                ) {
                    console.log(SerialPortState.SerialPort)
                    console.log(SerialPortState.SerialPortReader)
                    LogError("The serial port is still open after trying to disconnect")
                }
            }
            const serPort = await navigator.serial.requestPort();
            await serPort.open({ baudRate: BaudRate });

            SetSerialPort(serPort)

            if (SerialPortState.SerialPort == null ||
                SerialPortState.SerialPort.readable == null ||
                SerialPortState.SerialPort.writable == null) {
                throw "Could not connect to serial port"
            }

            const reader = SerialPortState.SerialPort.readable?.getReader();
            SetSerialPortReader(reader)

            const writer = SerialPortState.SerialPort.writable?.getWriter();
            SetSerialPortWriter(writer)
            SetSerialPortQueue(new Map())

            SerialPortActions.ReadDataFromSerialPort();

            LogInfo(
                "Connected with baudrate " + BaudRate.toString() + "!"
            );
        } catch (err) {
            SetSerialPort(null)

            let errorStr = ""
            try {
                if (err instanceof Error) {
                    const indexOfColon = err.message.indexOf(":") + 2;
                    LogError(
                        err.message.slice(indexOfColon)
                    );
                    return
                }
            } catch (err) {
                errorStr = JSON.stringify(err).replaceAll("\"", "")
            }

            const log = `An unknown error occured: ${errorStr}`
            LogError(log)
        }
    }

    static async SendDataToSerialPort(dataToSend: Uint8Array) {

        try {

            if (SerialPortState.SerialPort == null) {
                throw "Sending data is not possible, you must connect first!"
            }

            if (SerialPortState.SerialPortWriter == null) {
                throw "Serial port writer is null while trying to send data"
            }

            if (SerialPortState.SerialPortQueue == null) {
                throw Error("SerialPortQueue became null")
            }

            while (SerialPortState.SerialPortQueue.size != 0) {
                // wait for the receive thread to clear the queue, 
                // we can't send async commands because the motor does not return the command id
                await sleep(50)
            }

            await SerialPortState.SerialPortWriter.write(dataToSend);

            let dataToSendStr = Uint8ArrayToString(dataToSend).toUpperCase();

            let cmdId = dataToSend[2]
            if (dataToSend[1] == 254) {
                //extended addressing
                cmdId = dataToSend[10]
            }

            const logCommand: LogCommandType = {
                Packet: dataToSend,
                CommandId: cmdId,
                IsSendCmd: true,
                Level: LogLevelType.Command,
                Log: dataToSendStr,
                Timestamp: "",
                TroubleshootError: null
            }

            LogCommand(logCommand);

            if (dataToSend[1] != 255 || cmdId == 20) {
                //Do not wait for a response when sending to 255,
                //However wait for a response when sending detect devices
                SerialPortState.SerialPortQueue.set(cmdId, dataToSend)

                CommandTimeoutHandle = setTimeout(() => {
                    if (SerialPortState.SerialPortQueue == null) {
                        throw Error("SerialPortQueue became null")
                    }

                    SerialPortState.SerialPortQueue.clear()

                    const command = GlobalMotorCommandsMap.get(cmdId)

                    const errStatus: StatusErrorCodesType = {
                        "code": 0,
                        "enum": "COMMAND_TIMEOUT",
                        "short_desc": "Command timeout",
                        "long_desc": "The command you sent did not receive a response",
                        "causes": [
                            "Motor not powered on",
                            "Serial cable not connected to the motor",
                            "Incorrect selected alias / unique id",
                            "Green LED on the device is not flashing slowly"
                        ],
                        "solutions": [
                            "Connect the motor to a 12-24V power source",
                            "Serial cable is connected from the motor to the UART adapter and then to your PC",
                            "Select the alias or unique id identified using \'DETECT_DEVICES\' command",
                            "Green LED is flashing slowly (motor's firmware is waiting for a command)",
                            "Reset your device using \'SYSTEM_RESET\' / Command 27 "
                        ]

                    }

                    LogWarning(`Command \'${command?.CommandString}\' timed out.`, errStatus)
                }, 2000);
            }

        } catch (err) {
            LogError(String(err))
            throw err
        }
        finally {
        }
    }

    static async ReadDataFromSerialPort() {
        let receiveLength = 0;
        let receivedPacket: Uint8Array<ArrayBufferLike> = new Uint8Array()

        if (SerialPortState.SerialPort == null) {
            LogError("Serial port is not open")
            return
        }

        if (!(SerialPortState.SerialPort.readable)) {
            LogError("Serial port is not readable")
            return
        }

        if (SerialPortState.SerialPortReader == null) {
            LogError("Serial port reader is null")
            return
        }

        if (SerialPortState.SerialPortWriter == null) {
            LogError("Serial port writer is null")
            return
        }

        try {
            while (true) {
                if (SerialPortState.SerialPort == null ||
                    SerialPortState.SerialPortReader == null
                ) {
                    throw "Serial port became null while reading."
                }

                const { value, done } =
                    await SerialPortState.SerialPortReader.read();
                if (done) {

                    if (DisconnectTimeout != null) {
                        clearTimeout(DisconnectTimeout)
                        DisconnectTimeout = null
                    }

                    break;
                } else {
                    receivedPacket = new Uint8Array([...receivedPacket, ...value])
                    receiveLength = receivedPacket[0] >> 1

                    if (receivedPacket.length != receiveLength) {
                        continue
                    }

                    if (SerialPortState.SerialPortQueue == null) {
                        throw Error("SerialPortQueue became null")
                    }

                    //Glue the current response to the "in progress" command
                    const sentCmdId = [...SerialPortState.SerialPortQueue.keys()][0]
                    const packetStr =
                        Uint8ArrayToString(receivedPacket);

                    if (CommandTimeoutHandle != null) {
                        clearTimeout(CommandTimeoutHandle)
                        CommandTimeoutHandle = null
                    }


                    const logCommand: LogCommandType = {
                        Packet: receivedPacket,
                        CommandId: Number(sentCmdId),
                        IsSendCmd: false,
                        Level: LogLevelType.Command,
                        Log: packetStr,
                        Timestamp: "",
                        TroubleshootError: null
                    }

                    LogCommand(logCommand);
                    SerialPortState.SerialPortQueue.clear()
                    receivedPacket = new Uint8Array()

                }
            }
        } catch (err) {
            const errStr = JSON.stringify(err).replaceAll("\"", "")
            LogError(`Reader threw: ${errStr}`);
        } finally {
            LogInfo(
                "Waiting for the serial port to disconnect.."
            );

            SerialPortState.SerialPortReader.releaseLock();
            SerialPortState.SerialPortWriter.releaseLock();
            await SerialPortState.SerialPort.close()
            SetSerialPort(null)
            SetSerialPortReader(null)
            SetSerialPortWriter(null)
            SetSerialPortQueue(null)

            LogInfo("Disconnected!");
        }
    }

    static async DisconnectFromSerialPort() {

        return new Promise<void>(async (resolve) => {
            if (SerialPortState.SerialPort == null) {
                return
            }

            if (SerialPortState.SerialPortReader == null) {
                return
            }

            try {
                /** This will signal the reader method to close */
                SerialPortState.SerialPortReader.cancel();

                /** Disconnect after 1seconds, this will give time for the reader to close */
                setTimeout(() => {
                    resolve()
                }, 1000);
            } catch (err) {
                const errStr = JSON.stringify(err).replaceAll("\"", "")
                LogError(`Disconnect threw: ${errStr}`);
            }
        })
    }
}