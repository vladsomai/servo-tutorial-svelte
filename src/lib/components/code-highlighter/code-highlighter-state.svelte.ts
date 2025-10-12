import type { SupportedCodeLangs, SupportedCodeLangsStr } from "$lib/client-server-lib/utils"
import { type BundledLanguage, type BundledTheme, type HighlighterGeneric } from "shiki"

export interface CodeHighlightType {
    Lang: SupportedCodeLangsStr,
    CodeText: string,
    Highlighter: HighlighterGeneric<BundledLanguage, BundledTheme> | null
}

export const CodeHighlightObject: CodeHighlightType = $state({
    Lang: "html",
    CodeText: "",
    Highlighter: null
})

export function SetCodeHighlightText(newCodeText: string) {
    CodeHighlightObject.CodeText = newCodeText
}

export function SetCodeHighlightLang(newLang: SupportedCodeLangsStr) {
    CodeHighlightObject.Lang = newLang
}

export function SetCodeHighlighter(highlighter: HighlighterGeneric<BundledLanguage, BundledTheme>) {
    CodeHighlightObject.Highlighter = highlighter
}