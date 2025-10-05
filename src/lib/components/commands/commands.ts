import { browser } from "$app/environment";
import { SerialPortActions } from "$lib/client-server-lib/serial-communication/serial-comm";
import type { MotorCommandType } from "$lib/client-server-lib/types";
import { ConvertAxisToNum, crc32, DecToBin, GetFuncNameFromCmdString, GetSerialNumber, GetVersionNumber, LittleEndianToBigEndian, NumberToUint8Arr, ParametersByteCount, sleep, StringToUint8Array, Uint8ArrayToAscii, Uint8ArrayToString, Uint8ArrToNumber, type ByteSizes } from "$lib/client-server-lib/utils";
import { DetectedDevices } from "$lib/stores/global";
import { LogError, LogInfo, type LogCommandType } from "../log-window/state.svelte";
import ShrtDisableMosfets from "../modal/shortcuts/shrtDisableMosfets.svelte";
import ShrtEnableMosfets from "../modal/shortcuts/shrtEnableMosfets.svelte";
import ShrtSystemReset from "../modal/shortcuts/shrtSystemReset.svelte";
import conversionData from "./unit_conversions_M3.json";
const conversion_factors = conversionData.conversion_factors;
const units = conversionData.units

export let MotorCommands: MotorCommandType[] = []
if (browser) {
    const res = await fetch('/motor_commands.json');
    MotorCommands = await res.json() as MotorCommandType[];
}

function ConstructCommand(axisStr: string, uniqueId: string, commandEnum: number, payload: Uint8Array, crc32Enabled: boolean): Uint8Array {
    let alias = ConvertAxisToNum(axisStr)

    if (isNaN(alias)) {
        const msg = "Axis text could not be converted"
        LogError(msg)
        throw new Error(msg)
    }

    if (alias > 255) {
        const msg = "Alias must range between 0 and 255"
        LogError(msg)
        throw new Error(msg)
    }

    let addressPart = new Uint8Array(1)
    addressPart.set([alias])
    if (alias == 254) {
        //Extended addressing
        addressPart = new Uint8Array(1 + 8)
        addressPart.set([254], 0)

        const uniqueIdArr = StringToUint8Array(uniqueId)
        if (uniqueIdArr.length != 8) {
            const msg = `UniqueID must have 8 bytes, the provided UniqueID has ${uniqueIdArr.length} bytes`
            LogError(msg)
            throw new Error(msg)
        }
        addressPart.set(uniqueIdArr, 1)
    }

    if (alias == 253) {
        // CRC32 enabled
        throw "Command with CRC enabled is not implemented"
    }

    if (alias == 252) {
        //CRC32 disabled
        throw "Command with CRC disabled is not implemented"
    }

    const commandByte = commandEnum

    //command size: cmdSize(1byte), address(1byte), commandByte(1byte), payload(n bytes)
    //the LSB must be set to 1, while bits 1-7 represent the actual command size
    let cmdSize = 1 + addressPart.length + 1 + payload.length
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

    return cmd;
}

/** Use for commands where no payload is needed */
async function ExecuteCommand(axisStr: string, uniqueId: string, commandEnum: number, payload = new Uint8Array()) {
    await SerialPortActions.SendDataToSerialPort(ConstructCommand(axisStr, uniqueId, commandEnum, payload, CRC32_ENABLED))
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
    else if (type == "number") {
        if (typeof value != 'number') {
            throw `Value type is incorrect, expected number but received ${typeof value}`
        }
        return NumberToUint8Arr(value, byteSize as ByteSizes)
    }
    else if (type == "mixed_acceleration_velocity_time") {
        return Multimoves(value)
    }
    else if (type == "current") {
        return NumberToUint8Arr(value, byteSize as ByteSizes)
    }
    else if (type == "string") {
        if (typeof value != 'string') {
            throw `Value type is incorrect, expected string but received ${typeof value}`
        }

        const valueTruncated = value.slice(0, byteSize).padEnd(byteSize, ' ')
        return new Uint8Array([...valueTruncated].map(c => c.charCodeAt(0)));
    }
    throw "Conversion not supported"
}

export class M3 {
    static async ExecuteCommand(axisStr: string, uniqueId: string, commandEnum: number) {
        ExecuteCommand(axisStr, uniqueId, commandEnum)
    }

    static async DisableMosfets(axisStr: string, uniqueId: string,) {
        await ExecuteCommand(axisStr, uniqueId, 0);
    }

    static async EnableMosfets(axisStr: string, uniqueId: string,) {
        await ExecuteCommand(axisStr, uniqueId, 1);
    };

    static async SystemReset(axisStr: string, uniqueId: string,) {
        await ExecuteCommand(axisStr, uniqueId, 27);
    };

    static async GetStatus(axisStr: string, uniqueId: string,) {
        await ExecuteCommand(axisStr, uniqueId, 16);
    };
}

async function ExecuteGenericCommand(axisStr: string, uniqueId: string, command: MotorCommandType, args: any[]) {
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
        await ExecuteCommand(axisStr, uniqueId, command.CommandEnum, new Uint8Array());
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

        if (inp.UnitConversion == null) {
            /** When the unit conversion is not specified, treat it as a number or string */

            if (typeof arg.value == 'number') {
                currentParamType = 'number'
            } else if (typeof arg.value == 'string') {
                currentParamType = 'string'
            }
            else {
                throw "Default type is not supported, expected number or string"
            }
        }
        else if (inp.UnitConversion != null && inp.UnitConversion.Type != null) {
            currentParamType = inp.UnitConversion.Type
        }
        else {
            throw `INVALID COMMAND: expected at least UnitConversion with Type to be defined`
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
    await ExecuteCommand(axisStr, uniqueId, command.CommandEnum, payload);
}

for (let cmd of MotorCommands) {
    const cmdFunction = GetFuncNameFromCmdString(cmd.CommandString)

    // @ts-ignore
    M3[cmdFunction] = ExecuteGenericCommand
}

export const CommandsWithShortcuts = new Map<number, any>([
    [0, ShrtDisableMosfets],
    [1, ShrtEnableMosfets],
    [27, ShrtSystemReset],
]);

//size byte ( 7-bit size, LSB-0)
//address byte
//command byte
//payload
//crc32 4 bytes

let CRC32_ENABLED = true

export interface ByteInterpretation {
    HexString: string
    Description: string
    Payload?: any//attach things to pass to the output handler (e.g. Detect devices)
}

export function InterpretCommand(log: LogCommandType): ByteInterpretation[] {
    const packetStr = log.Log
    const packet = StringToUint8Array(log.Log)
    const command = MotorCommands.find((cmd) => cmd.CommandEnum == log.CommandId)

    if (command == null) {
        const msg = `Can not interpret command ${log.CommandId} because it was not found in the list of commands`
        LogError(msg)
        throw new Error(msg)
    }

    if (IsCommandPacket(packet)) {
        // Check for inputs
        return GetInputByteInterpretation(packetStr, packet, CRC32_ENABLED, command)
    }
    else {
        // Check for outputs
        RefreshCrc32Enabled(packet)
        return GetOutputByteInterpretation(packetStr, packet, CRC32_ENABLED, command)
    }
}

function GetInputByteInterpretation(packetString: string, packet: Uint8Array, crc32Enabled: boolean, command: MotorCommandType): ByteInterpretation[] {
    const packetStringSplit = []

    for (let i = 0; i < packetString.length; i += 2) {
        packetStringSplit.push(packetString.slice(i, i + 2))
    }

    if (command == null) {
        throw `Sent command could not be interpreted because the command id could not be found in the list of commands`
    }

    /** First byte is the size */
    const size = packet[0] >> 1

    const result: ByteInterpretation[] = []

    result.push({
        HexString: packetStringSplit[0],
        Description: `Packet size: ${size}`
    })

    result.push({
        HexString: packetStringSplit[1],
        Description: `Alias - decimal: ` + ConvertAxisToNum("0x" + packetStringSplit[1]) + " or ASCII: " + Uint8ArrayToAscii(new Uint8Array([packet[1]]))
    })

    let cmdIdIdx = 2
    if (packet[1] == 254) {
        //extended addressing
        cmdIdIdx = 10

        result.push({
            HexString: packetStringSplit.slice(2, 10).join(""),
            Description: `UniqueID`
        })
    }

    result.push({
        HexString: packetStringSplit[cmdIdIdx],
        Description: `Command ID: ${command.CommandString}`
    })

    if (command.Input != null) {
        let offset = 3
        for (const inp of command.Input) {
            const inpType = inp.Description.slice(0, inp.Description.indexOf(":"))
            let noOfBytes = (ParametersByteCount.get(inpType) as number)

            if (noOfBytes == 0) {
                // Dynamic data incoming, read all until end
                noOfBytes = packet.length - offset
                if (crc32Enabled) {
                    noOfBytes -= 4
                }
            }

            const hexCollecedStr = packetString.slice(offset * 2, (offset * 2) + (noOfBytes * 2))
            const hexColleced = packet.slice(offset, offset + noOfBytes)

            offset += noOfBytes

            let dispFormat: string[] = []
            if (inp.TooltipDisplayFormat != null) {
                dispFormat = GetDisplayFormat(inp.TooltipDisplayFormat, hexColleced)
            }

            result.push({
                HexString: hexCollecedStr,
                Description: `${inp.Description}` + dispFormat.join("\n")
            })
        }
    }

    if (crc32Enabled) {
        const receivedCrcHexStr = packetString.slice(packetString.length - 8, packetString.length)

        result.push({
            HexString: receivedCrcHexStr,
            Description: "CRC32"
        })
    }

    return result
}

function GetOutputByteInterpretation(packetString: string, packet: Uint8Array, crc32Enabled: boolean, command: MotorCommandType): ByteInterpretation[] {
    const packetStringSplit = []

    for (let i = 0; i < packetString.length; i += 2) {
        packetStringSplit.push(packetString.slice(i, i + 2))
    }

    /** First byte is the size */
    const size = packet[0] >> 1

    const result: ByteInterpretation[] = []

    result.push({
        HexString: packetStringSplit[0],
        Description: `Packet size: ${size}`
    })

    result.push({
        HexString: packetStringSplit[1],
        Description: `CRC is ${crc32Enabled ? "enabled" : "disabled"}`
    })

    if (crc32Enabled && packet.length == 6) {
        //success response - CRC32 enabled
    }
    else if (packet.length == 2) {
        //success response - CRC32 disabled
    }
    else {

        let cmdIdIdx = 2
        if (packet[1] == 254) {
            //extended addressing
            cmdIdIdx = 10
        }

        result.push({
            HexString: packetStringSplit[cmdIdIdx],
            Description: `Command ID: ${command.CommandString}`
        })

        if (command.Output != null) {
            let offset = 3//first 2 bytes are size and alias
            for (const out of command.Output) {
                const outType = out.Description.slice(0, out.Description.indexOf(":"))
                let noOfBytes = (ParametersByteCount.get(outType))

                if (noOfBytes == null) {
                    const msg = `Output parameter type ${outType} is not supported`
                    LogError(msg)
                    throw Error(msg)
                }

                if (noOfBytes == 0) {
                    // Dynamic data incoming, read all until end
                    noOfBytes = packet.length - offset
                    if (crc32Enabled) {
                        noOfBytes -= 4
                    }
                }

                const hexCollecedStr = packetString.slice(offset * 2, (offset * 2) + (noOfBytes * 2))
                const hexColleced = packet.slice(offset, offset + noOfBytes)

                offset += noOfBytes

                let dispFormat: string[] = []
                if (out.TooltipDisplayFormat != null) {
                    dispFormat = GetDisplayFormat(out.TooltipDisplayFormat, hexColleced)
                }



                result.push({
                    HexString: hexCollecedStr,
                    Description: `${out.Description}` + "<br/> <br/>" + dispFormat.join("<br/>")
                })
            }
        }
    }

    if (crc32Enabled) {
        const isValid = IsCrc32Valid(packet)

        const receivedCrcHexStr = packetString.slice(packetString.length - 8, packetString.length)

        result.push({
            HexString: receivedCrcHexStr,
            Description: `CRC32 is ${isValid ? "valid" : "invalid"}`
        })
    }

    const func = HandleOutputMap.get(command.CommandEnum)
    if (func != null) {
        func(result[3].HexString, result[4].HexString)
    }

    return result
}

/**
 * Returns a string with the hexString converted to the format 
 * @param format format string
 * @param hexString hex number as string to be converted to the specified format
 */
function GetDisplayFormat(format: string, arr: Uint8Array) {
    const formatArr = format.split(',');

    let res = '';
    const preText = " Result converted to "
    let convertedTo = '';
    let result: string[] = []
    for (format of formatArr) {
        convertedTo = ''
        switch (format) {
            case 'i8':
                convertedTo += "number: "
                res = Uint8ArrToNumber(arr, 1).toString()
                break
            case 'u8':
                convertedTo += "number: "
                res = Uint8ArrToNumber(arr, 1).toString()
                break
            case '%c':
                convertedTo += "char: "
                res = '\'' + String.fromCharCode(arr[0]) + '\''
                break
            case '%s':
                convertedTo += "string: "
                res = '\'' + Uint8ArrayToAscii(arr) + '\''
                break
            case '%hd':
                convertedTo += "short: "
                res = Uint8ArrToNumber(arr, 2).toString()
                break
            case '%hu':
                convertedTo += "unsigned short: "
                res = Uint8ArrToNumber(arr, 2).toString()
                break
            case '%d':
                convertedTo += "decimal: "
                res = Uint8ArrToNumber(arr, 4).toString()
                break
            case '%u':
                convertedTo += "unsigned decimal: "
                res = Uint8ArrToNumber(arr, 4).toString()
                break
            case 'i48':
                convertedTo += "decimal: "
                res = Uint8ArrToNumber(arr, 6).toString()
                break
            case 'u48':
                convertedTo += "unsigned decimal: "
                res = Uint8ArrToNumber(arr, 6).toString()
                break
            case '%ld':
                convertedTo += "long: "
                res = Uint8ArrToNumber(arr, 8).toString()
                break
            case '%lu':
                convertedTo += "unsigned long: "
                res = Uint8ArrToNumber(arr, 8).toString()
                break
            case '%lld':
                convertedTo += "long long: "
                res = Uint8ArrToNumber(arr, 8).toString()
                break
            case '%llu':
                convertedTo += "unsigned long long: "
                res = Uint8ArrToNumber(arr, 8).toString()
                break
            case '%b':
                const num = Uint8ArrToNumber(arr, 4) as number
                const binaryStr = DecToBin(num)
                convertedTo += "binary: "
                res = binaryStr
                break
            case '%bhu':
                const num2 = Uint8ArrToNumber(arr, 2) as number
                const binaryStr2 = DecToBin(num2)
                convertedTo += "binary: "
                res = binaryStr2
                break
            case '%hwvn':
                convertedTo += "hardware version number: "
                res = GetVersionNumber(arr)
                break
            case '%hwsn':
                convertedTo += "hardware serial number: "
                res = GetSerialNumber(arr)
                break
            case '%fwvn':
                convertedTo += "firmware version number: "
                res = GetSerialNumber(arr)
                break
            case '%x':
                convertedTo += "hexadecimal: "
                res = '0x' + Uint8ArrayToString(LittleEndianToBigEndian(arr))
                break
            default:
                break
        }

        result.push(preText + convertedTo + res)
    }

    return result;
}

function IsCommandPacket(packet: Uint8Array): boolean {

    const ADDR_BYTE = packet[1];

    if (ADDR_BYTE == 253 || ADDR_BYTE == 252) {
        //is response packet
        return false
    }

    if (ADDR_BYTE < 0 || ADDR_BYTE > 255) {
        const msg = "Invalid packet, expected the addres byte to range between 0 and 255"
        LogError(msg)
        throw msg
    }

    return true
}

function RefreshCrc32Enabled(response: Uint8Array): void {
    if (response[1] == 252) {
        CRC32_ENABLED = false
    }
    else if (response[1] == 253) {
        CRC32_ENABLED = true
    }
    else {
        throw "RefreshCrc32Enabled is only expected for response commands"
    }

}

function IsCrc32Valid(response: Uint8Array): boolean {
    if (response.length < 6) {
        /** We are expecting atleast 6 bytes because: size(1)+alias(1)+CRC32(4) = 6 bytes minimum length */
        throw "CRC32 can not be calculated because the packet is not at least 6 bytes"
    }

    const crcVal = crc32(response.slice(0, response.length - 4))
    const crcArr = NumberToUint8Arr(crcVal, 4)

    const crcHexStr = Uint8ArrayToString(crcArr)
    const receivedCrcHexStr = response.slice(response.length - 4, response.length)
    return crcHexStr == Uint8ArrayToString(receivedCrcHexStr)
}

const HandleOutputMap = new Map<number, Function>()
HandleOutputMap.set(20, HandleDetectDevicesResponse)
function HandleDetectDevicesResponse(uniqueId: string, alias: string) {
    DetectedDevices.set([{ UniqueID: uniqueId, Alias: parseInt(alias, 16) }])
}