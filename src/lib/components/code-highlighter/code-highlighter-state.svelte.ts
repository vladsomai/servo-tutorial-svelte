import type { SupportedCodeLangs } from "$lib/client-server-lib/utils"
import { type BundledLanguage, type BundledTheme, type HighlighterGeneric } from "shiki"

export interface CodeHighlightType {
    Lang: SupportedCodeLangs,
    CodeText: string,
    Highlighter: HighlighterGeneric<BundledLanguage, BundledTheme> | null
}

export const CodeHighlightObject: CodeHighlightType = $state({
    Lang: "javascript",
    CodeText: "",
    Highlighter: null
})

export function SetCodeHighlightText(newCodeText: string) {
    CodeHighlightObject.CodeText = newCodeText
}

export function SetCodeHighlightLang(newLang: SupportedCodeLangs) {
    CodeHighlightObject.Lang = newLang
}

export function SetCodeHighlighter(highlighter: HighlighterGeneric<BundledLanguage, BundledTheme>) {
    CodeHighlightObject.Highlighter = highlighter
}