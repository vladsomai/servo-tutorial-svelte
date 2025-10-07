import type { StatusErrorCodesType } from "$lib/client-server-lib/types";
import GenericModal from "./generic-modal.svelte";

export interface ModalContentType {
    Title: string,
    Image: string,
    Description: string[]
}

export interface ModalType {
    Component: any
    Dialog: HTMLDialogElement | null
    Content: ModalContentType,
    StatusErrorCode: StatusErrorCodesType | null
}

export const Modal: ModalType = $state({
    Component: GenericModal,
    Dialog: null,
    Content: { Title: "", Image: "", Description: [] },
    StatusErrorCode: null
})

export function SetModalComponent(newModalComp: any) {
    Modal.Component = newModalComp
}

export function SetModalDialog(htmlElement: HTMLDialogElement) {
    Modal.Dialog = htmlElement
}

export function SetModalContent(content: ModalContentType) {
    Modal.Content = content
}

export function SetModalTroubleshootError(err: StatusErrorCodesType) {
    Modal.StatusErrorCode = err
}