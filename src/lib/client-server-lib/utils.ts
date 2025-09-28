import { LogError } from "$lib/components/log-window/state.svelte"

export const SupportedThemes = [
    "light",
    "night",
    'cupcake',
    'dark',
]
export const DefaultTheme = SupportedThemes[0]

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

export function ConvertAxis(axisStr: string): number {

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

    if (selectedAxis == 253 ||
        selectedAxis == 252
    ) {
        LogError(`Alias ${selectedAxis} is reserved. See protocol spec for more details. Will default to 255.`)
        throw "Alias is reserved"
    }

    return selectedAxis

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

export function Uint8ArrayToAscii(arr: Uint8Array) {
    return Array.from(arr)
        .map(byte => String.fromCharCode(byte))
        .join('');
}

export function DecToBin(dec: number) {
    return (dec >>> 0).toString(2);
}

export function GetVersionNumber(arr: Uint8Array): string {
    let res = ''

    for (let i = arr.length - 1; i >= 0; i--) {
        res += arr[i].toString() + '.'
    }
    return res.substring(0, res.lastIndexOf('.'))
}

export const makeCRCTable = () => {
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

export function LittleEndianToBigEndian(arr: Uint8Array): Uint8Array {
    return arr.slice().reverse()
}

export const crcTable = makeCRCTable();

export const crc32 = (data: Uint8Array) => {
    let crc = 0 ^ (-1);
    for (let i = 0; i < data.length; i++) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ data[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
};

export function GetFuncNameFromCmdString(cmdString: string) {
    return cmdString.replaceAll(" ", "_")
}

export const ParametersByteCount = new Map<string, number>([
    ["i8", 1],
    ["u8", 1],
    ["i16", 2],
    ["u16", 2],
    ["i24", 3],
    ["u24", 3],
    ["i32", 4],
    ["u32", 4],
    ["i48", 6],
    ["u48", 6],
    ["i64", 8],
    ["u64", 8],
    ["string8", 8],
    ["u24_version_number", 3],
    ["u32_version_number", 4],
    ["u64_unique_id", 8],
    ["u8_alias", 1],
    ["crc32", 4],
    ["buf10", 10],
    ["list_2d", 0],
    ["string_null_term", 0],
    ["unknown_data", 0],
    ["general_data", 0],
    ["firmware_page", 0],
    ["success_response", 0],
]);