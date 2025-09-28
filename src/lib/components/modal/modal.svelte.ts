import GenericModal from "./generic-modal.svelte";

export interface ModalContentType {
    Title: string,
    Image: string,
    Description: string[]
}

export interface ModalType {
    Component: any
    Dialog: HTMLDialogElement | null
    Content: ModalContentType
}

export const Modal: ModalType = $state({ Component: GenericModal, Dialog: null, Content: { Title: "", Image: "", Description: [] } })

export function SetModalComponent(newModalComp: any) {
    Modal.Component = newModalComp
}

export function SetModalDialog(htmlElement: HTMLDialogElement) {
    Modal.Dialog = htmlElement
}

export function SetModalContent(content: ModalContentType) {
    Modal.Content = content
}