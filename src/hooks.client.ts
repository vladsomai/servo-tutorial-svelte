import type { ClientInit, HandleClientError } from "@sveltejs/kit";
import dataTypes from '$lib/client-server-lib/motor-data/data_types.json';
import convTypes from '$lib/client-server-lib/motor-data/unit_conversions_M3.json';
import initialMotorCommands from '$lib/client-server-lib/motor-data/motor_commands.json';
import errorCodes from '$lib/client-server-lib/motor-data/status_error_codes.json';
import { CommandsProtocolChapter, QuickStartChapter, type MotorCommandType, type MotorDataType, type StatusErrorCodesType } from "$lib/client-server-lib/types";
import { GetFuncNameFromCmdString } from "$lib/client-server-lib/utils";
import { M3 } from "$lib/components/commands/commands";
import { ExecuteGenericCommand } from "$lib/components/commands/commands"
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { SetCurrentUser } from "$lib/stores/global-state.svelte";

export const handleError: HandleClientError = async (obj) => {
    console.log("Client handleError:", obj)
};

export const init: ClientInit = () => {
    console.log("Client init done")
};

function GetStatusErrorCodes() {
    const errCodesMap: Map<number, StatusErrorCodesType> = new Map()
    for (let ec of errorCodes) {
        errCodesMap.set(ec.code, ec)
    }

    return errCodesMap
}

function GetDataTypes() {
    const dataTypesMap: Map<string, MotorDataType> = new Map()
    for (let dt of dataTypes) {
        dataTypesMap.set(dt.Type, dt)
    }

    return dataTypesMap
}

function GetMotorCommands() {
    const motorCommands: MotorCommandType[] = [QuickStartChapter, CommandsProtocolChapter, ...initialMotorCommands as MotorCommandType[]]

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

    return [motorCommandsMap, commandsGrouped]
}

export const GlobalDataTypes = GetDataTypes()
export const GlobalMotorCommands = initialMotorCommands as MotorCommandType[]
const [map, grouped] = GetMotorCommands()
export const GlobalMotorCommandsMap = map as Map<number, MotorCommandType>
export const GlobalMotorCommandsGrouped = grouped as Map<string, number[]>
export const GlobalConversionTypes: any = convTypes
export const GlobalStatusErrorCodes = GetStatusErrorCodes()

// Create all M3 class functions
for (let cmd of initialMotorCommands) {
    const cmdFunction = GetFuncNameFromCmdString(cmd.CommandString);

    // @ts-ignore
    M3[cmdFunction] = ExecuteGenericCommand;
}

console.log("Motor commands defined.")

export const firebaseConfig = {
    apiKey: "AIzaSyBYGT4ZJTEdI6W2CDW-Lyh49GPMDStgpb4",
    authDomain: "servo-tutorial.firebaseapp.com",
    projectId: "servo-tutorial",
    storageBucket: "servo-tutorial.appspot.com",
    messagingSenderId: "728487511246",
    appId: "1:728487511246:web:dec731d83425c83103fc9f",
    measurementId: "G-LE0KT6GPTR",
}

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);

onAuthStateChanged(firebaseAuth, async (_user) => {
    if (_user) {
        SetCurrentUser(_user)
    } else {
        SetCurrentUser(_user)
    }
});