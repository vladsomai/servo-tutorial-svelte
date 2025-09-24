import { SerialPortActions } from "$lib/client-server-lib/serial-communication/serial-comm";
import { ConvertAxis, crc32, NumberToUint8Arr, sleep, StringToUint8Array, Uint8ArrayToString } from "$lib/client-server-lib/utils";
import { LogError, LogInfo } from "../log-window/state.svelte";
import conversionData from "./unit_conversions_M3.json";
const conversion_factors = conversionData.conversion_factors;

const DEFAULT_SLEEP = 50



function ConstructCommand(axisStr: string, commandEnum: number, payload: Uint8Array, crc32Enabled: boolean = true): Uint8Array {
    let address = ConvertAxis(axisStr)

    let addressPart = new Uint8Array(1)
    addressPart.set([address])
    if (address > 255) {
        //Extended addressing
        addressPart = new Uint8Array(1 + 8)
        addressPart.set([254], 0)

        const uniqueId = NumberToUint8Arr(address, 8)
        addressPart.set(uniqueId, 1)

        console.log("Unique ID addressing:", addressPart)
    }

    if (address == 253) {
        // CRC32 enabled
        throw "Command with CRC enabled is not implemented"
    }

    if (address == 252) {
        //CRC32 disabled
        throw "Command with CRC disabled is not implemented"
    }

    if (isNaN(address)) {
        throw "Axis text could not be converted "
    }

    const commandByte = commandEnum

    //command size: cmdSize(1byte), address(1byte), commandByte(1byte), payload(n bytes)
    //the LSB must be set to 1, while bits 1-7 represent the actual command size
    let cmdSize = 1 + 1 + 1 + payload.length
    if (crc32Enabled) {
        cmdSize += 4
    }

    const cmdSizeByte = (cmdSize << 1) | 1
    if (cmdSize == 127) {
        throw "Extended command length is not implemented"
    }

    const cmd = new Uint8Array(
        cmdSize
    );

    cmd.set([cmdSizeByte])
    cmd.set(addressPart, 1)
    cmd.set([commandByte], 1 + addressPart.length)
    cmd.set(payload, 1 + addressPart.length + 1)

    if (crc32Enabled) {
        const crcVal = crc32(cmd.slice(0, cmd.length - 4))
        const crcArr = NumberToUint8Arr(crcVal, 4)
        cmd.set(crcArr, 1 + addressPart.length + 1 + payload.length)
    }

    console.log(Uint8ArrayToString(cmd))
    return cmd;
}

/** Use for commands where no payload is needed */
async function ExecuteCommand(axisStr: string, commandEnum: number, payload = new Uint8Array()) {
    await SerialPortActions.SendDataToSerialPort(ConstructCommand(axisStr, commandEnum, payload))
    if (axisStr == "255" && commandEnum != 20) {
        /**Do not log when sending detect devices */
        LogInfo('No response is expected.');
    }
}

function RpmToEncCnt(rpm: number) {
    return rpm * conversion_factors.shaft_rotations
}

const sixtyPow2 = 60 ** 2
const timestepsPow2 = 31250 ** 2
const twoPow8 = 2 ** 8
const twoPow12 = 2 ** 12
const twoPow32 = 2 ** 32

function VelocityRpmToInternal(velocity: number, microstepsPerRoation = conversion_factors.shaft_rotations) {
    return (velocity / 60) * (microstepsPerRoation / 31250) * (twoPow32);
}

export const InternalVelocityToCommVelocity = (internalVelocity: number): number => {
    return internalVelocity / (twoPow12)
}

function AccelerationRpmSqToInternal(accelerationRpmSq: number, microstepsPerRoation = conversion_factors.shaft_rotations) {
    return (accelerationRpmSq / sixtyPow2) * (microstepsPerRoation / timestepsPow2) * (twoPow32);
}

export const InternalAccelerationToCommAcceleration = (internalAcceleration: number): number => {
    return internalAcceleration / (twoPow8)
}

function SecondsToTimesteps(seconds: number) {
    return seconds * conversion_factors.seconds
}

function RotationsAndDurationToUint8Arr(rot: number, duration: number): Uint8Array<ArrayBuffer> {
    if (duration < 0) {
        throw "Duration cannot be negative"
    }

    const dist = NumberToUint8Arr(RpmToEncCnt(rot), 4)
    const dur = NumberToUint8Arr(SecondsToTimesteps(duration), 4)

    const payload = new Uint8Array(8)
    payload.set(dist, 0)
    payload.set(dur, 4)

    return payload
}

function AccelerationAndDurationToUint8Arr(accelerationRpmSq: number, duration: number): Uint8Array<ArrayBuffer> {
    if (duration < 0) {
        throw "Duration cannot be negative"
    }

    const internalAcc = AccelerationRpmSqToInternal(accelerationRpmSq)
    const commAcc = InternalAccelerationToCommAcceleration(internalAcc)

    const dist = NumberToUint8Arr(commAcc, 4)
    const dur = NumberToUint8Arr(SecondsToTimesteps(duration), 4)

    const payload = new Uint8Array(8)
    payload.set(dist, 0)
    payload.set(dur, 4)

    return payload
}

function VelocityAndDurationToUint8Arr(velocity: number, duration: number): Uint8Array<ArrayBuffer> {
    if (duration < 0) {
        throw "Duration cannot be negative"
    }

    const internalVel = VelocityRpmToInternal(velocity)
    const commVel = InternalVelocityToCommVelocity(internalVel)

    const dist = NumberToUint8Arr(commVel, 4)
    const dur = NumberToUint8Arr(SecondsToTimesteps(duration), 4)

    const payload = new Uint8Array(8)
    payload.set(dist, 0)
    payload.set(dur, 4)

    return payload
}

export class M3 {

    static async DisableMosfets(axisStr: string) {
        await ExecuteCommand(axisStr, 0);
    }

    static async EnableMosfets(axisStr: string) {
        await ExecuteCommand(axisStr, 1);
    };

    static async TrapezoidMove(axisStr: string, distanceRotation: number, durationSec: number) {
        await ExecuteCommand(axisStr, 2, RotationsAndDurationToUint8Arr(distanceRotation, durationSec));
    };

    static async GoToPosition(axisStr: string, distanceRotation: number, durationSec: number) {
        await ExecuteCommand(axisStr, 4, RotationsAndDurationToUint8Arr(distanceRotation, durationSec));
    };

    static async ResetTime(axisStr: string) {
        await ExecuteCommand(axisStr, 8);
    };

    static async EmergencyStop(axisStr: string) {
        await ExecuteCommand(axisStr, 12);
    };

    static async ZeroPosition(axisStr: string) {
        await ExecuteCommand(axisStr, 13);
    };

    static async Homing(axisStr: string, distanceRotation: number, durationSec: number) {
        await ExecuteCommand(axisStr, 14, RotationsAndDurationToUint8Arr(distanceRotation, durationSec));
    };

    static async GoToClosedLoop(axisStr: string) {
        await ExecuteCommand(axisStr, 17);
    };

    static async MoveWithAcceleration(axisStr: string, accelerationRpmSq: number, durationSec: number) {
        await ExecuteCommand(axisStr, 19, AccelerationAndDurationToUint8Arr(accelerationRpmSq, durationSec));
    };

    static async DetectDevices(axisStr: string) {
        await ExecuteCommand(axisStr, 20);
    };

    static async MoveWithVelocity(axisStr: string, velocity: number, durationSec: number) {
        await ExecuteCommand(axisStr, 26, VelocityAndDurationToUint8Arr(velocity, durationSec));
    };

    static async SystemReset(axisStr: string) {
        await ExecuteCommand(axisStr, 27);
    };


}

export interface ByteInterpretation {
    Description: string
}

//size byte ( 7-bit size, LSB-0)
//address byte
//command byte
//payload
//crc32 4 bytes

function GetBasicByteInterpretation(): ByteInterpretation[] {
    const ret: ByteInterpretation[] = []

    ret.push({ Description: "Packet size" })
    ret.push({ Description: "Address/Alias" })
    ret.push({ Description: "Command ID" })
    ret.push({ Description: "Payload" })
    ret.push({ Description: "CRC32" })


    return ret
}

class M3_Interpret {
    static DisableMosfets(): ByteInterpretation[] {
        return GetBasicByteInterpretation()
    }
}

export function InterpretCommand(commandStr: string): ByteInterpretation[] {
    const cmd = StringToUint8Array(commandStr)
    console.log("Interpret: ", commandStr)
    console.log(cmd)

    if (cmd[1] == 253) {
        //CRC32 enabled
        const crcVal = crc32(cmd.slice(0, cmd.length - 4))
        const crcArr = NumberToUint8Arr(crcVal, 4)

        const crcHexStr = Uint8ArrayToString(crcArr)
        const receivedCrcHexStr = cmd.slice(cmd.length - 4, cmd.length)
        if (crcHexStr == Uint8ArrayToString(receivedCrcHexStr)) {
            LogInfo("Response CRC32 validation passed!")
        }
        else {
            LogError("Response CRC32 validation failed!")
        }
    }


    return []
}

