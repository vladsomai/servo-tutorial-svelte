import { LogError } from "$lib/components/log-window/state.svelte"
import { GlobalDataTypes } from "../../hooks.client"
import type { InputOutputObjects } from "./types"

export interface ThemeType {
    SiteTheme: string,
    CodeTheme: string
}
export const SupportedThemes: ThemeType[] = [
    { SiteTheme: "night", CodeTheme: "tokyo-night" },
    { SiteTheme: "dark", CodeTheme: "github-dark-dimmed" },
    { SiteTheme: "light", CodeTheme: "github-light" },
    { SiteTheme: "cupcake", CodeTheme: "github-light" },
]

export type SupportedCodeLangsStr = "html" | "c" | "python"

export interface SupportedCodeLangs {
    Description: string,
    Language: SupportedCodeLangsStr
}

export const SupportedLanguages: SupportedCodeLangs[] = [
    { Description: "Web", Language: "html" },
    { Description: "C", Language: "c" },
    { Description: "Python", Language: "python" }
]

export const GetCurrentBrowser = (): 'Opera' | 'Edge' | 'Chrome' | 'Safari' | 'Firefox' | 'IE' | 'unknown' => {
    if (
        (navigator.userAgent.indexOf('Opera') ||
            navigator.userAgent.indexOf('OPR')) != -1
    ) {
        return 'Opera'
    } else if (navigator.userAgent.indexOf('Edg') != -1) {
        return 'Edge'
    } else if (navigator.userAgent.indexOf('Chrome') != -1) {
        return 'Chrome'
    } else if (navigator.userAgent.indexOf('Safari') != -1) {
        return 'Safari'
    } else if (navigator.userAgent.indexOf('Firefox') != -1) {
        return 'Firefox'
    } else if (
        navigator.userAgent.indexOf('MSIE') != -1 ||
        !!document.DOCUMENT_NODE == true
    ) {
        //IF IE > 10
        return 'IE'
    } else {
        return 'unknown'
    }
}

/**
 * Returns a Uint8Array representing the bytes from the hex string
 * @param Input: "FF00A2" hex number as string to be converted to Uint8Array
 * @param Output: [0xFF,0,0xA2]
 */
export const StringToUint8Array = (_value: string) => {
    const message = _value;

    if (message.length % 2 !== 0) {
        return new Uint8Array([]);
    }

    let bytes = [];
    for (let i = 0; i < _value.length; i += 2) {
        const hexByteString = _value[i] + _value[i + 1];
        bytes.push(parseInt(hexByteString, 16));
    }

    //Convert all the bytes from the bytes array to Uint8Array
    let result = new Uint8Array(bytes.length);

    result.set(bytes);

    return result;
};

//Input: Uint8Array e.g. [0xFF,0xA0,0]
//Output: hexString e.g. "FFA000"
/**
 * Returns a Uint8Array representing the bytes from the hex string
 * @param Input: Uint8Array e.g. [0xFF,0xA0,0]
 * @param Output: hex string e.g. "FFA000"
 */
export const Uint8ArrayToString = (data: Uint8Array | null): string => {
    if (data == null) {
        return ""
    }

    let hexString = ''
    for (let i = 0; i < data.length; i++) {
        let prefix = ''
        let postfix = ''
        if (data[i] <= 0xF) prefix = '0'
        else prefix = ''

        hexString += prefix + data[i].toString(16) + postfix
    }
    return hexString.toUpperCase();
}

export function sleep(time_ms: number): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, time_ms)
    })
}

export function ConvertAxisToNum(axisStr: string): number {

    let base = 10;
    if (axisStr.startsWith('0x')) {
        base = 16
    }

    let selectedAxis = 0;

    if (axisStr.length == 1) {
        //convert to char if the input is only one character
        selectedAxis = axisStr.charCodeAt(0);
    }
    else {
        selectedAxis = parseInt(axisStr, base);
    }

    if (isNaN(selectedAxis) ||
        selectedAxis < 0) {
        LogError(`Alias must either be a valid ASCII character or a number ranging from 0 to 251 / 254(for Unique ID addressing) / 255 (for broadcasting)!`)
        return Number.NaN;
    }

    return selectedAxis

}

/**
 * Returns alias as string from a number ranging from 0 to 255
 * @param Input: e.g. 58 (decimal) 
 * @param Output: e.g. "X"
 */
export function ConvertAxisToStr(axisNum: number): string {

    let aliasResult = ""
    if (axisNum >= 32 && axisNum <= 126) {
        // alias is printable ascii 
        aliasResult = String.fromCharCode(axisNum)
    }
    else {
        aliasResult = String(axisNum)
    }

    return aliasResult
}

export function GetCurrentTimestamp() {
    const date = new Date();
    // ISO: 2025-09-07T17:32:12.000Z
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}-${date.getSeconds()}.${date.getMilliseconds()}`;
}

export type ByteSizes = 1 | 2 | 4 | 6 | 8
export const NumberToUint8Arr = (
    num: bigint | number,
    size: ByteSizes,
    littleEndian = true
): Uint8Array<ArrayBuffer> => {
    let rawArrBuffer = new ArrayBuffer(size)
    if (size == 6) {
        /**Extend the array buffer so that bigint fits */
        rawArrBuffer = new ArrayBuffer(8)
    }
    const view = new DataView(rawArrBuffer)

    switch (size) {
        case 1:
            view.setUint8(0, Number(num))
            break
        case 2:
            view.setUint16(0, Number(num), littleEndian)
            break
        case 4:
            view.setUint32(0, Number(num), littleEndian)
            break
        case 6:
            view.setBigUint64(0, BigInt(num), littleEndian)
            break
        case 8:
            view.setBigUint64(0, BigInt(num), littleEndian)
            break
        default:
            throw `Unsupported byte size when converting ${num} to Uint8Arr: byte size received ${size}`
    }

    let rawCurrent = new Uint8Array(size)

    for (let i = 0; i < size; i++) {
        rawCurrent.set([view.getUint8(i)], i)
    }

    return rawCurrent
}

export const Uint8ArrToNumber = (
    arr: Uint8Array,
    size: ByteSizes,
    littleEndian = true
): number | bigint => {
    if (arr.length !== size) {
        throw `Invalid Uint8Array length: expected ${size}, got ${arr.length}`;
    }

    let rawArrBuffer = new ArrayBuffer(size);
    if (size === 6) {
        // Extend to 8 bytes for BigInt decoding
        rawArrBuffer = new ArrayBuffer(8);
    }

    const view = new DataView(rawArrBuffer);

    // Copy bytes into buffer
    for (let i = 0; i < size; i++) {
        view.setUint8(i, arr[i]);
    }

    switch (size) {
        case 1:
            return view.getUint8(0);
        case 2:
            return view.getUint16(0, littleEndian);
        case 4:
            return view.getUint32(0, littleEndian);
        case 6:
            return view.getBigUint64(0, littleEndian);
        case 8:
            return view.getBigUint64(0, littleEndian);
        default:
            throw `Unsupported byte size when converting Uint8Arr to number: byte size received ${size}`;
    }
};

export const Uint8ArrToSignedNumber = (
    arr: Uint8Array,
    size: ByteSizes,
    littleEndian = true
): number | bigint => {
    if (arr.length !== size) {
        throw `Invalid Uint8Array length: expected ${size}, got ${arr.length}`;
    }

    let rawArrBuffer = new ArrayBuffer(size);
    if (size === 6) {
        // Extend to 8 bytes for BigInt decoding
        rawArrBuffer = new ArrayBuffer(8);
    }

    const view = new DataView(rawArrBuffer);

    // Copy bytes into buffer
    for (let i = 0; i < size; i++) {
        view.setUint8(i, arr[i]);
    }

    switch (size) {
        case 1:
            return view.getInt8(0)
        case 2:
            return view.getInt16(0, littleEndian)
        case 4:
            return view.getInt32(0, littleEndian)
        case 6:
            return view.getBigInt64(0, littleEndian)
        case 8:
            return view.getBigInt64(0, littleEndian)
        default:
            throw `Unsupported byte size when converting Uint8Arr to number: byte size received ${size}`;
    }
};

export function Uint8ArrayToAscii(arr: Uint8Array, separator: string = "") {
    return Array.from(arr)
        .map(byte => String.fromCharCode(byte))
        .join(separator);
}

export function DecToBin(dec: number) {
    return (dec >>> 0).toString(2);
}

export function GetVersionNumber(arr: Uint8Array): string {
    return arr.reverse().map((byte: any): any => { return String(byte) }).join(".")
}

export function LittleEndianToBigEndian(arr: Uint8Array): Uint8Array {
    return arr.slice().reverse()
}

function makeCRCTable() {
    let c;
    let crcTable = [];
    for (let n = 0; n < 256; n++) {
        c = n;
        for (let k = 0; k < 8; k++) {
            c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[n] = c;
    }
    return crcTable
}

const crcTable = makeCRCTable();

export function crc32(data: Uint8Array) {
    let crc = 0 ^ -1;
    for (let i = 0; i < data.length; i++) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ data[i]) & 0xFF];
    }
    return crc ^ -1;
};

export function GetFuncNameFromCmdString(cmdString: string) {
    return cmdString.replaceAll(" ", "_")
}

export function GetNoOfBytesForParam(param: InputOutputObjects): number {
    const inpType = param.ParameterType

    if (GlobalDataTypes == null) {
        const msg = `Could not find no. of bytes for param ${param.ParameterName}. DataTypes could not be imported`
        LogError(msg)
        throw msg
    }

    const noOfBytes = GlobalDataTypes.get(inpType)
    if (noOfBytes == null || noOfBytes.ByteSize == null) {
        return NaN // if the byte size is not defined, it can only mean the expected size is infinity
    }

    return noOfBytes.ByteSize
}

export function IsValidString(obj: any): boolean {

    if (obj == null ||
        typeof obj != 'string' ||
        obj == ''

    ) {
        return false;
    }

    return true
}