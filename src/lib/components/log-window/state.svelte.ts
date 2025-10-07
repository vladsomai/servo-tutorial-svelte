import { LogLevelType, type LogCommandType, type LogType, type LogWindowType, type StatusErrorCodesType } from "$lib/client-server-lib/types";
import { GetCurrentTimestamp } from "$lib/client-server-lib/utils";

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
        Timestamp: "",
        TroubleshootError: null
    }
    addLog(newLog)
}

export function LogWarning(log: string, troubleshootError: StatusErrorCodesType | null = null) {
    const newLog: LogType = {
        Log: log,
        Level: LogLevelType.Warning,
        Timestamp: "",
        TroubleshootError: troubleshootError
    }
    addLog(newLog)
}

export function LogError(log: string, troubleshootError: StatusErrorCodesType | null = null) {
    const newLog: LogType = {
        Log: log,
        Level: LogLevelType.Error,
        Timestamp: "",
        TroubleshootError: troubleshootError
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
        Timestamp: "",
        TroubleshootError: null
    }
    addLog(newLog)
}

function addLog(newLog: LogType) {
    const timestamp = GetCurrentTimestamp()
    newLog.Timestamp = timestamp
    LogWindowLogs.Logs = [...LogWindowLogs.Logs, newLog]

    // LogWindowLogs.Logs.push(newLog)
}