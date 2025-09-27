import { browser } from "$app/environment";
import { SerialPortActions } from "$lib/client-server-lib/serial-communication/serial-comm";
import type { MotorCommandType } from "$lib/client-server-lib/types";
import { ConvertAxis, crc32, GetFuncNameFromCmdString, NumberToUint8Arr, ParametersByteCount, sleep, StringToUint8Array, Uint8ArrayToString, type ByteSizes } from "$lib/client-server-lib/utils";
import { LogError, LogInfo } from "../log-window/state.svelte";
import conversionData from "./unit_conversions_M3.json";
const conversion_factors = conversionData.conversion_factors;
const units = conversionData.units

const DEFAULT_SLEEP = 50

let mtrCommands: MotorCommandType[] = []
if (browser) {
    const res = await fetch('/motor_commands.json');
    mtrCommands = await res.json() as MotorCommandType[];
}

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

function PositionToUint8Arr(position: number, positionUnit: string, byteSize: number) {
    const requestedPosUnit = units.position.find((val) => val == positionUnit)
    if (requestedPosUnit == null) {
        throw `Position unit is not supported: ${positionUnit}`
    }

    // @ts-ignore
    const commPos = Math.ceil(conversion_factors[requestedPosUnit] * position)
    const posArr = NumberToUint8Arr(commPos, byteSize as ByteSizes)

    return posArr
}

function AccelerationToUint8Arr(acceleration: number, accelerationUnit: string) {
    const requestedAccUnit = units.acceleration.find((val) => val == accelerationUnit)
    if (requestedAccUnit == null) {
        throw `Acceleration unit is not supported: ${accelerationUnit}`
    }

    // @ts-ignore
    const commAcc = Math.ceil(conversion_factors[requestedAccUnit] * acceleration)
    const accArr = NumberToUint8Arr(commAcc, 4)

    return accArr
}

function VelocityToUint8Arr(velocity: number, velocityUnit: string) {
    const requestedVelUnit = units.velocity.find((val) => val == velocityUnit)
    if (requestedVelUnit == null) {
        throw `Velocity unit is not supported: ${velocityUnit}`
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
        throw `Time unit is not supported: ${timeUnit}`
    }

    // @ts-ignore
    const commTime = Math.ceil(conversion_factors[requestedTimeUnit] * time)
    const durArr = NumberToUint8Arr(commTime, 4)

    return durArr
}

function Multimoves(multimoves: any[]): Uint8Array<ArrayBuffer> {

    let moveChucks = []

    for (let move of multimoves) {
        const velOrAcc = move[0]
        const time = move[1]

        let velOrAccArr = new Uint8Array()
        if (velOrAcc.type == "velocity") {
            velOrAccArr = VelocityToUint8Arr(velOrAcc.value, velOrAcc.unit)
        }
        else if (velOrAcc.type == 'acceleration') {
            velOrAccArr = AccelerationToUint8Arr(velOrAcc.value, velOrAcc.unit)
        }
        else {
            throw `Multimove expected velocity or acceleration but received ${velOrAcc.type}`
        }

        const timeArr = TimeToUint8Arr(time.value, time.unit)

        moveChucks.push(velOrAccArr)
        moveChucks.push(timeArr)
    }

    const multimovesSize = moveChucks.reduce((sum, chunk) => sum + chunk.length, 0)
    const multimovesArr = new Uint8Array(multimovesSize)

    let offset = 0
    for (const chunk of moveChucks) {
        multimovesArr.set(chunk, offset)
        offset += chunk.length
    }
    return multimovesArr
}

function GetCommValueFromValueType(value: any, unit: string, type: string, byteSize: number): Uint8Array<ArrayBuffer> {

    if (type == 'position') {
        return PositionToUint8Arr(value, unit, byteSize)
    }
    else if (type == 'time') {
        return TimeToUint8Arr(value, unit)
    }
    else if (type == 'velocity') {
        return VelocityToUint8Arr(value, unit)
    }
    else if (type == 'acceleration') {
        return AccelerationToUint8Arr(value, unit)
    }
    else if (type == "moveCount") {
        return NumberToUint8Arr(value, byteSize as ByteSizes)
    }
    else if (type == "moveTypes") {
        return NumberToUint8Arr(value, byteSize as ByteSizes)
    }
    else if (type == "mixed_acceleration_velocity_time") {
        return Multimoves(value)
    }
    else if (type == "current") {
        return NumberToUint8Arr(value, byteSize as ByteSizes)
    }

    throw "Conversion not supported"
}

export class M3 {
    static async ExecuteCommand(axisStr: string, commandEnum: number) {
        ExecuteCommand(axisStr, commandEnum)
    }

    static async DisableMosfets(axisStr: string) {
        await ExecuteCommand(axisStr, 0);
    }

    static async EnableMosfets(axisStr: string) {
        await ExecuteCommand(axisStr, 1);
    };

    static async SystemReset(axisStr: string) {
        await ExecuteCommand(axisStr, 27);
    };

    static async GetStatus(axisStr: string) {
        await ExecuteCommand(axisStr, 16);
    };
}

async function ExecuteGenericCommand(axisStr: string, command: MotorCommandType, args: any[]) {
    let argsStr = ""

    if (args != null) {
        for (let arg of args) {
            const kvps = Object.entries(arg)
            for (const kvp of kvps) {
                argsStr += `${kvp[0]}: ${kvp[1]},`
            }
        }
    }
    console.log(`Executing ${command.CommandString}: ${command.CommandEnum}| Args:${argsStr} `)

    if (command.Input == null) {
        // This method does not need any inputs
        await ExecuteCommand(axisStr, command.CommandEnum, new Uint8Array());
        return;
    }

    if (!Array.isArray(command.Input)) {
        throw `Command ${command.CommandString} does not define an array of inputs`
    }

    if (command.Input.length != args.length) {
        throw `Incorrect number of inputs: expected ${command.Input.length}, received ${args.length} `
    }

    const inputChunks: Uint8Array[] = []
    // Transform the inputs to the correct unit
    for (let i = 0; i < command.Input.length; i++) {
        const inp = command.Input[i]
        const arg = args[i]

        let currentParamType = ""
        if (inp.UnitConversion != null && inp.UnitConversion.Type != null) {
            currentParamType = inp.UnitConversion.Type
        }
        else if (inp.ParameterName != null) {
            currentParamType = inp.ParameterName
        }
        else {
            throw `INVALID COMMAND: expected at least UnitConversion or ParameterName to be defined`
        }

        if (currentParamType != arg.type) {
            throw `Incorrect argument type: expected ${currentParamType}, received ${arg.type}`
        }

        const inpType = inp.Description.slice(0, inp.Description.indexOf(":"))
        const noOfBytes = ParametersByteCount.get(inpType)
        if (noOfBytes == null) {
            throw `Command definition ${command.CommandString} is invalid, expected type to be defined in \"Description\" field for input ${i} (e.g. i32)`
        }

        const valArr = GetCommValueFromValueType(arg.value, arg.unit, arg.type, noOfBytes)
        inputChunks.push(valArr)


    }
    const payloadLength = inputChunks.reduce((sum, chunk) => sum + chunk.length, 0)
    const payload = new Uint8Array(payloadLength)
    let offset = 0
    for (const chunk of inputChunks) {
        payload.set(chunk, offset)
        offset += chunk.length
    }
    await ExecuteCommand(axisStr, command.CommandEnum, payload);
}

for (let cmd of mtrCommands) {
    const cmdFunction = GetFuncNameFromCmdString(cmd.CommandString)

    // @ts-ignore
    M3[cmdFunction] = ExecuteGenericCommand
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

