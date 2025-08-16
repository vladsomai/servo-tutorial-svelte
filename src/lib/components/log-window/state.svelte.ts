export enum LogLevelType {
    Info,
    Warning,
    Error
}

export interface LogType {
    Log: string,
    Level: LogLevelType,
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
        Level: LogLevelType.Info
    }
    addLog(newLog)
}

export function LogWarning(log: string) {
    const newLog: LogType = {
        Log: log,
        Level: LogLevelType.Warning
    }
    addLog(newLog)
}

export function LogError(log: string) {
    const newLog: LogType = {
        Log: log,
        Level: LogLevelType.Error
    }
    addLog(newLog)
}

function addLog(newLog: LogType) {
    LogWindowLogs.Logs = [...LogWindowLogs.Logs, newLog]
    // LogWindowLogs.Logs.push(newLog)
}