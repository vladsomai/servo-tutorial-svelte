import type { ToastLevel } from "$lib/client-server-lib/types";

export interface ToastContentType {
    Message: string[],
    Level: ToastLevel
}

export interface ToastType {
    ToastElements: ToastContentType[]
}

export const ToastObject: ToastType = $state({ ToastElements: [] })

export function AddToast(newToast: ToastContentType) {
    ToastObject.ToastElements.push(newToast)
    setTimeout(() => {
        ToastObject.ToastElements.pop()
    }, 3000)
}

