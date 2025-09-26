import { SerialPortActions } from "$lib/client-server-lib/serial-communication/serial-comm";
import { ConvertAxis, crc32, NumberToUint8Arr, sleep, StringToUint8Array, Uint8ArrayToString } from "$lib/client-server-lib/utils";
import { LogError, LogInfo } from "../log-window/state.svelte";
import conversionData from "./unit_conversions_M3.json";
const conversion_factors = conversionData.conversion_factors;
const units = conversionData.units

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

function PositionAndDurationToUint8Arr(position: number, positionUnit: string,
    duration: number, timeUnit: string): Uint8Array<ArrayBuffer> {

    const posArr = PositionToUint8Arr(position, positionUnit)
    const durArr = TimeToUint8Arr(duration, timeUnit)

    const payload = new Uint8Array(8)
    payload.set(posArr, 0)
    payload.set(durArr, 4)

    return payload
}

function AccelerationAndDurationToUint8Arr(acceleration: number, accelerationUnit: string,
    duration: number, timeUnit: string): Uint8Array<ArrayBuffer> {

    const accArr = AccelerationToUint8Arr(acceleration, accelerationUnit)
    const durArr = TimeToUint8Arr(duration, timeUnit)

    const payload = new Uint8Array(8)
    payload.set(accArr, 0)
    payload.set(durArr, 4)

    return payload
}

function PositionToUint8Arr(position: number, positionUnit: string) {
    const requestedPosUnit = units.position.find((val) => val == positionUnit)
    if (requestedPosUnit == null) {
        throw "Position unit is not supported"
    }

    // @ts-ignore
    const commPos = Math.ceil(conversion_factors[requestedPosUnit] * position)
    const posArr = NumberToUint8Arr(commPos, 4)

    return posArr
}

function AccelerationToUint8Arr(acceleration: number, accelerationUnit: string) {
    const requestedAccUnit = units.acceleration.find((val) => val == accelerationUnit)
    if (requestedAccUnit == null) {
        throw "Acceleration unit is not supported"
    }

    // @ts-ignore
    const commAcc = Math.ceil(conversion_factors[requestedAccUnit] * acceleration)
    const accArr = NumberToUint8Arr(commAcc, 4)

    return accArr
}

function VelocityToUint8Arr(velocity: number, velocityUnit: string) {
    const requestedVelUnit = units.velocity.find((val) => val == velocityUnit)
    if (requestedVelUnit == null) {
        throw "Velocity unit is not supported"
    }

    // @ts-ignore
    const commVel = Math.ceil(conversion_factors[requestedVelUnit] * velocity)
    const veloArr = NumberToUint8Arr(commVel, 4)

    return veloArr
}

function TimeToUint8Arr(time: number, timeUnit: string) {
    if (time < 0) {
        throw "Time cannot be negative"
    }

    const requestedTimeUnit = units.time.find((val) => val == timeUnit)
    if (requestedTimeUnit == null) {
        throw "Time unit is not supported"
    }

    // @ts-ignore
    const commTime = Math.ceil(conversion_factors[requestedTimeUnit] * time)
    const durArr = NumberToUint8Arr(commTime, 4)

    return durArr
}

function VelocityAndDurationToUint8Arr(velocity: number, velocityUnit: string,
    duration: number, timeUnit: string): Uint8Array<ArrayBuffer> {

    const durArr = TimeToUint8Arr(duration, timeUnit)
    const veloArr = VelocityToUint8Arr(velocity, velocityUnit)

    const payload = new Uint8Array(8)
    payload.set(veloArr, 0)
    payload.set(durArr, 4)

    return payload
}

export class M3 {

    static async DisableMosfets(axisStr: string) {
        await ExecuteCommand(axisStr, 0);
    }

    static async EnableMosfets(axisStr: string) {
        await ExecuteCommand(axisStr, 1);
    };

    static async TrapezoidMove(axisStr: string, position: number, positionUnit: string,
        duration: number, timeUnit: string) {
        await ExecuteCommand(axisStr, 2, PositionAndDurationToUint8Arr(position, positionUnit, duration, timeUnit));
    };

    static async SetMaxVelocity(axisStr: string, velocity: number, velocityUnit: string) {
        await ExecuteCommand(axisStr, 3, VelocityToUint8Arr(velocity, velocityUnit));
    };

    static async GoToPosition(axisStr: string, position: number, positionUnit: string,
        duration: number, timeUnit: string) {
        await ExecuteCommand(axisStr, 4, PositionAndDurationToUint8Arr(position, positionUnit, duration, timeUnit));
    };

    static async SetMaxAcceleration(axisStr: string, acceleration: number, accelerationUnit: string) {
        await ExecuteCommand(axisStr, 5, AccelerationToUint8Arr(acceleration, accelerationUnit));
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

    static async Homing(axisStr: string, position: number, positionUnit: string, duration: number, timeUnit: string) {
        await ExecuteCommand(axisStr, 14, PositionAndDurationToUint8Arr(position, positionUnit, duration, timeUnit));
    };

    static async GoToClosedLoop(axisStr: string) {
        await ExecuteCommand(axisStr, 17);
    };

    static async MoveWithAcceleration(axisStr: string, acceleration: number, accelerationUnit: string, duration: number, timeUnit: string) {
        await ExecuteCommand(axisStr, 19, AccelerationAndDurationToUint8Arr(acceleration, accelerationUnit, duration, timeUnit));
    };

    static async DetectDevices(axisStr: string) {
        await ExecuteCommand(axisStr, 20);
    };

    static async MoveWithVelocity(axisStr: string, velocity: number, velocityUnit: string, duration: number, timeUnit: string) {
        await ExecuteCommand(axisStr, 26, VelocityAndDurationToUint8Arr(velocity, velocityUnit, duration, timeUnit));
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

