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

//Input: Uint8Array e.g. [0xFF,0xA0,0]
//Output: hexString e.g. "FFA000"
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
        selectedAxis < 0 ||
        selectedAxis > 255) {
        LogError(`Alias must either be a valid ASCII character or a number ranging from 0 to 251!`)
        return Number.NaN;
    }

    if (selectedAxis == 254 ||
        selectedAxis == 253 ||
        selectedAxis == 252
    ) {
        LogError(`Alias ${selectedAxis} is reserved. See protocol spec for more details.`)
        return Number.NaN;
    }

    return selectedAxis

}

export function GetCurrentTimestamp() {
    const date = new Date();
    // ISO: 2025-09-07T17:32:12.000Z
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}-${date.getSeconds()}.${date.getMilliseconds()}`;
}
