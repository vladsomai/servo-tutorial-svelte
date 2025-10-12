
import type { SupportedCodeLangsStr } from "../utils";
import { changeAliasClangCode, changeCommandClangCode } from "./c-code-utils";
import { changeAliasPythonCode, changeCommandPythonCode } from "./python-code-utils";
import { changeAliasWebCode, changeCommandWebCode } from "./web-code-utils";

export class GenericCodeExample {
    // The geneirc Code Example only changes the Alias and the Command number of each command

    static async GetNewCode(alias: number, command: number, lang: SupportedCodeLangsStr): Promise<string> {

        const res = await fetch(`/code-samples/${lang}/generic.txt`);
        const codeText = await res.text();

        switch (lang) {
            case "html":
                return this.GetNewWebCode(alias, command, codeText)
            case "c":
                return this.GetNewCCode(alias, command, codeText)
            case "python":
                return this.GetNewPythonCode(alias, command, codeText)
            default:
                return ""
        }
    }

    private static GetNewPythonCode(alias: number, command: number, pythonCode: string): string {
        let alteredPyCode = changeAliasPythonCode(
            alias,
            pythonCode
        );

        alteredPyCode = changeCommandPythonCode(command, alteredPyCode)

        return alteredPyCode;

    }

    private static GetNewWebCode(alias: number, command: number, webCode: string): string {
        let alteredWebCode = changeAliasWebCode(
            alias,
            webCode
        );

        alteredWebCode = changeCommandWebCode(command, alteredWebCode)

        return alteredWebCode;
    }

    private static GetNewCCode(alias: number, command: number, cCode: string): string {
        let alteredClangCode = changeAliasClangCode(
            alias,
            cCode
        );

        alteredClangCode = changeCommandClangCode(command, alteredClangCode)

        return alteredClangCode;
    }

}
