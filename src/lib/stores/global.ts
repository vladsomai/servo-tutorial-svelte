import type { DetectedDeviceType } from "$lib/client-server-lib/types";
import { SupportedThemes, type ThemeType } from "$lib/client-server-lib/utils";
import { writable } from "svelte/store";

export const GlobalTheme = writable<ThemeType>(SupportedThemes[0])
export const ShowLogTimestamp = writable<boolean>(false)
export const SelectedAxis = writable<string>("255")
export const DetectedDevices = writable<DetectedDeviceType[]>([])
export const SelectedUniqueID = writable<string>("")