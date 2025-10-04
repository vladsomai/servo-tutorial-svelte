import type { DetectedDeviceType } from "$lib/client-server-lib/types";
import { DefaultTheme } from "$lib/client-server-lib/utils";
import { writable } from "svelte/store";

export const GlobalTheme = writable<string>(DefaultTheme)
export const ShowLogTimestamp = writable<boolean>(false)
export const SelectedAxis = writable<string>("255")
export const DetectedDevices = writable<DetectedDeviceType[]>([])