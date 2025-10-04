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
    TooltipDisplayFormat?: string,
    ParameterName?: string
    UnitConversion?: UnitConversionType
}

export interface UnitConversionType {
    Type: string,
    InternalUnit: string
    ConversionFactorsFile: string
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