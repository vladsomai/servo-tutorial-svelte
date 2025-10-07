import { SupportedCookies, SupportedCookiesMap } from '$lib/client-server-lib/cookies';

import { SupportedThemes } from '$lib/client-server-lib/utils';
import type { ServerLoadEvent } from '@sveltejs/kit';
import type { LayoutRouteId, LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (props) => {
    return {
        Theme: GetThemeCookie(props),
    };
};

function GetThemeCookie(props: ServerLoadEvent<{ slug?: string; }, {}, LayoutRouteId>): string {
    const themeStr = SupportedCookiesMap.get(SupportedCookies.Theme) as string
    let themeFromCookie = props.cookies.get(themeStr)

    if (themeFromCookie == null || themeFromCookie.length == 0) {
        console.log("First visit, setting theme cookie")
        themeFromCookie = SupportedThemes[0].SiteTheme

        const currentDate = new Date();
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        props.cookies.set(themeStr, themeFromCookie, { path: '/', priority: "high", httpOnly: false, expires: currentDate })
    }

    return themeFromCookie
}