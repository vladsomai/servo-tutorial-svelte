import { SupportedCookies, SupportedCookiesMap } from '$lib/client-server-lib/cookies';
import { CommandsProtocolChapter, QuickStartChapter, type MotorCommandsDictionary } from '$lib/client-server-lib/types';
import { DefaultTheme } from '$lib/client-server-lib/utils';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (props) => {
    const response = await props.fetch('/motor_commands.json');
    const initialMotorCommands = await response.json() as MotorCommandsDictionary[]

    const motorCommands = [QuickStartChapter, CommandsProtocolChapter, ...initialMotorCommands]
    const themeStr = SupportedCookiesMap.get(SupportedCookies.Theme) as string
    let themeFromCookie = props.cookies.get(themeStr)

    if (themeFromCookie == null || themeFromCookie.length == 0) {
        themeFromCookie = DefaultTheme
    }

    return {
        MotorCommands: motorCommands,
        Theme: themeFromCookie
    };
};