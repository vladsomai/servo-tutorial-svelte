import { SerialPortActions } from "$lib/client-server-lib/serial-communication/serial-comm";
import { ConvertAxis, sleep } from "$lib/client-server-lib/utils";
import { LogInfo } from "../log-window/state.svelte";

const DEFAULT_SLEEP = 50

function ConstructCommand(axisStr: string, commandEnum: number, payload: Uint8Array): Uint8Array {
    const axis = ConvertAxis(axisStr)

    if (isNaN(axis)) {
        throw "Axis text could not be converted "
    }

    const cmdSize = 3 + payload.length
    const commandByte = commandEnum
    const payloadLength = payload.length

    const cmd = new Uint8Array(
        cmdSize
    );

    cmd.set([axis, commandByte, payloadLength])

    return cmd;
}

export async function DisableMosfets(axisStr: string) {
    await SerialPortActions.SendDataToSerialPort(ConstructCommand(axisStr, 0, new Uint8Array()))
    if (axisStr == "255") {
        LogInfo('No response is expected.');
    }
};

export async function EnableMosfets(axisStr: string) {
    await SerialPortActions.SendDataToSerialPort(ConstructCommand(axisStr, 1, new Uint8Array()))
    if (axisStr == "255") {
        LogInfo('No response is expected.');
    }
};

export async function SystemReset(axisStr: string) {
    await SerialPortActions.SendDataToSerialPort(ConstructCommand(axisStr, 27, new Uint8Array()))
    LogInfo('No response is expected.');
};