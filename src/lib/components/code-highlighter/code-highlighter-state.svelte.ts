import type { SupportedCodeLangs } from "$lib/client-server-lib/utils"
import { createHighlighter, type BundledLanguage, type BundledTheme, type HighlighterGeneric } from "shiki"

export interface CodeHighlightType {
    Lang: SupportedCodeLangs,
    CodeText: string,
    Highligher: HighlighterGeneric<BundledLanguage, BundledTheme>
}

export const CodeHighlightObject: CodeHighlightType = $state({
    Lang: "javascript",
    CodeText: "",
    Highligher: await createHighlighter({
        themes: ['github-dark-dimmed', 'github-light', 'tokyo-night', 'material-theme-ocean'],
        langs: ['javascript', "c", "python"]
    })
})

export function SetCodeHighlightText(newCodeText: string) {
    CodeHighlightObject.CodeText = newCodeText
}

export function SetCodeHighlightLang(newLang: SupportedCodeLangs) {
    CodeHighlightObject.Lang = newLang
}

