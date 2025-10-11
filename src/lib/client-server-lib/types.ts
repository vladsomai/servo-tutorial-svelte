export type MotorCommandType = {
    CommandString: string, //Command name
    CommandEnum: number, //Command id
    CommandGroup: string,
    Description: string,
    Input: InputOutputObjects[] | null, //Text for the input to be shown in each command window
    Output: InputOutputObjects[] | null, //Text for the output of each command
}

export interface InputOutputObjects {
    Description: string,
    BitDescriptions?: string[],
    TooltipDisplayFormat: string | null,
    ParameterName: string
    ParameterType: string
    UnitConversion?: UnitConversionType
}

export interface UnitConversionType {
    Type: string,
    InternalUnit: string
    ConversionFactorsFile: string
}

export interface StatusErrorCodesType {
    code: number
    enum: string
    short_desc: string
    long_desc: string
    causes: string[]
    solutions: string[]
}

export interface MotorDataType {
    Type: string
    ByteSize: number | null
}

export const CommandsProtocolChapter: MotorCommandType = {
    CommandString: "Commands protocol",
    CommandEnum: 1001,
    CommandGroup: "Get started",
    Description: "",
    Input: null,
    Output: null
}

export const QuickStartChapter: MotorCommandType = {
    CommandString: "Quick start",
    CommandEnum: 1002,
    CommandGroup: "Get started",
    Description: "",
    Input: null,
    Output: null
}

export interface DetectedDeviceType {
    UniqueID: string
    Alias: number
}

export enum ToastLevel {
    Success, Info, Error, Warning
}

export enum LogLevelType {
    Info,
    Warning,
    Error,
    Command
}

export interface LogType {
    Log: string,
    Level: LogLevelType,
    Timestamp: string,
    TroubleshootError: StatusErrorCodesType | null
}

export interface LogCommandType extends LogType {
    Packet?: Uint8Array,
    CommandId?: number,
    IsSendCmd?: boolean
}

export interface LogWindowType {
    Logs: LogType[] | LogCommandType[]
}

export type FeedbackType = { id: string, email: string; message: string, downloadURL: string | null, date: Date };
