import { GetCurrentTimestamp } from "$lib/client-server-lib/utils";

export enum LogLevelType {
    Info,
    Warning,
    Error,
    Command
}

export interface LogType {
    Log: string,
    Level: LogLevelType,
    Timestamp: string
}

export interface LogCommandType extends LogType {
    Packet: Uint8Array,
    CommandId: number,
    IsSendCmd: boolean
}

export interface LogWindowType {
    Logs: LogType[]
}

export const LogWindowLogs: LogWindowType = $state({
    Logs: [],
});

export function ClearLogs() {
    LogWindowLogs.Logs = []
}

export function LogInfo(log: string) {
    const newLog: LogType = {
        Log: log,
        Level: LogLevelType.Info,
        Timestamp: ""
    }
    addLog(newLog)
}

export function LogWarning(log: string) {
    const newLog: LogType = {
        Log: log,
        Level: LogLevelType.Warning,
        Timestamp: ""
    }
    addLog(newLog)
}

export function LogError(log: string) {
    const newLog: LogType = {
        Log: log,
        Level: LogLevelType.Error,
        Timestamp: ""
    }
    addLog(newLog)
}

export function LogCommand(logCommand: LogCommandType) {
    const newLog: LogCommandType = {
        Log: logCommand.Log,
        Packet: logCommand.Packet,
        CommandId: logCommand.CommandId,
        Level: LogLevelType.Command,
        IsSendCmd: logCommand.IsSendCmd,
        Timestamp: ""
    }
    addLog(newLog)
}

function addLog(newLog: LogType) {
    const timestamp = GetCurrentTimestamp()
    newLog.Timestamp = timestamp
    LogWindowLogs.Logs = [...LogWindowLogs.Logs, newLog]
    // LogWindowLogs.Logs.push(newLog)
}