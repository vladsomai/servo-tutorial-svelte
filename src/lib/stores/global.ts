import { DefaultTheme } from "$lib/client-server-lib/utils";
import { writable } from "svelte/store";

export const GlobalTheme = writable<string>(DefaultTheme)
export const SelectedAxis = writable<string>("255")
export const ShowLogTimestamp = writable<boolean>(false)