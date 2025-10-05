import { SupportedCookies, SupportedCookiesMap } from '$lib/client-server-lib/cookies';
import { CommandsProtocolChapter, QuickStartChapter, type MotorCommandType } from '$lib/client-server-lib/types';
import { SupportedThemes } from '$lib/client-server-lib/utils';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (props) => {
    const response = await props.fetch('/motor_commands.json');
    const initialMotorCommands = await response.json() as MotorCommandType[]

    const motorCommands: MotorCommandType[] = [QuickStartChapter, CommandsProtocolChapter, ...initialMotorCommands]

    const motorCommandsMap = new Map<number, MotorCommandType>()
    const commandsGrouped = new Map<string, number[]>()
    for (let mtrCmd of motorCommands) {
        motorCommandsMap.set(mtrCmd.CommandEnum, mtrCmd)

        let cmdsForCurrentGroup = commandsGrouped.get(mtrCmd.CommandGroup)
        if (cmdsForCurrentGroup == null) {
            cmdsForCurrentGroup = []
        }
        commandsGrouped.set(mtrCmd.CommandGroup, [...cmdsForCurrentGroup, mtrCmd.CommandEnum])
    }

    const themeStr = SupportedCookiesMap.get(SupportedCookies.Theme) as string
    let themeFromCookie = props.cookies.get(themeStr)

    if (themeFromCookie == null || themeFromCookie.length == 0) {
        console.log("First visit, setting theme cookie")
        themeFromCookie = SupportedThemes[0].SiteTheme

        const currentDate = new Date();
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        props.cookies.set(themeStr, themeFromCookie, { path: '/', priority: "high", httpOnly: false, expires: currentDate })
    }

    return {
        MotorCommands: motorCommandsMap,
        MotorCommandsGrouped: commandsGrouped,
        Theme: themeFromCookie,
    };
};