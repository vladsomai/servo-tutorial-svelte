
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