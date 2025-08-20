import { SerialPortActions } from "$lib/client-server-lib/serial-communication/serial-comm";

export function DisableMosfets(axis: number) {
    const cmdSize = 3//bytes
    const commandByte = 0
    const lengthByte = 0

    const cmd = new Uint8Array(
        cmdSize
    );

    cmd.set([axis, commandByte, lengthByte])

    SerialPortActions.SendDataToSerialPort(cmd)
};

export function EnableMosfets(axis: number) {
    const cmdSize = 3//bytes
    const commandByte = 1
    const lengthByte = 0

    const cmd = new Uint8Array(
        cmdSize
    );

    cmd.set([axis, commandByte, lengthByte])

    SerialPortActions.SendDataToSerialPort(cmd)
};