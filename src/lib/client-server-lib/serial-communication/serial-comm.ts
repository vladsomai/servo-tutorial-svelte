import { LogError, LogInfo } from "$lib/components/log-window/state.svelte";
import { GetCurrentBrowser, Uint8ArrayToString } from "../utils";
import { SerialPortState, SetSerialPort, SetSerialPortReader, SetSerialPortWriter } from "./state.svelte";

/** This map will contain the command id as key and the response for that command id */
export const SerialPortQueue: Map<number, Uint8Array> = new Map()

let disconnectTimeout: NodeJS.Timeout | null = null

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
                errorStr = JSON.stringify(err)
            }

            const log = `An unknown error occured: ${errorStr}`
            LogError(log)
        }
    }

    static async SendDataToSerialPort(dataToSend: Uint8Array) {
        try {
            if (SerialPortState.SerialPort == null) {
                throw "Serial port is null while trying to send data"
            }

            if (SerialPortState.SerialPortWriter == null) {
                throw "Serial port writer is null while trying to send data"
            }

            await SerialPortState.SerialPortWriter.write(dataToSend);
            let hexString = Uint8ArrayToString(dataToSend).toUpperCase();

            LogInfo("Sent: 0x" + hexString)

        } catch (err) {
            LogError(JSON.stringify(err))
        }
    }

    static async ReadDataFromSerialPort() {
        let receiveLength = 0;

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

                    if (disconnectTimeout != null) {
                        clearTimeout(disconnectTimeout)
                        disconnectTimeout = null
                    }

                    break;
                } else {
                    const receivedBytes =
                        Uint8ArrayToString(value);
                    LogInfo(
                        "Received: 0x" +
                        receivedBytes
                    );
                }
            }
        } catch (err) {
            const errStr = JSON.stringify(err)
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
                const errStr = JSON.stringify(err)
                LogError(`Disconnect threw: ${errStr}`);
            }
        })
    }
}