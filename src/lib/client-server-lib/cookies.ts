export enum SupportedCookies {
    CookieApproved,
    SignedIn,
    IsDev,
    Theme,
    ShowLogTimestamp
}

export const SupportedCookiesMap = new Map([
    [SupportedCookies.CookieApproved, 'CookieApproved'],
    [SupportedCookies.SignedIn, 'SignedIn'],
    [SupportedCookies.IsDev, 'IsDev'],
    [SupportedCookies.Theme, 'Theme'],
    [SupportedCookies.ShowLogTimestamp, 'ShowLogTimestamp'],
])

export function DeleteCookie(name: SupportedCookies) {
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 1);

    const cookieText = `${SupportedCookiesMap.get(name)}=false; expires=${currentDate.toUTCString()}; path=/;`;
    document.cookie = cookieText
}

export function UpdateCookie(name: SupportedCookies, value: string) {
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() + 1);

    const cookieText = `${SupportedCookiesMap.get(name)}=${value}; expires=${currentDate.toUTCString()}; path=/;`
    document.cookie = cookieText;
}

export function GetCookie(name: SupportedCookies): string {
    const allCookies = document.cookie.split(';')

    let cookieValue = ""
    const foundCookie = allCookies.find(cookie => {
        const [key, value] = cookie.split('=')

        if (key.trim() == SupportedCookiesMap.get(name)) {
            cookieValue = value
            return true
        }
    })

    if (foundCookie == null) {
        return ""
    }

    return cookieValue
}