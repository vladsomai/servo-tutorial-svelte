export type MotorCommandType = {
    CommandString: string, //Command name
    CommandEnum: number, //Command id
    CommandGroup: string,
    Description: string,
    Input: InputOutputObjects[] | string, //Text for the input to be shown in each command window
    Output: InputOutputObjects[] | string, //Text for the output of each command
}

export interface InputOutputObjects {
    Description: string
    TooltipDisplayFormat?: string
}

export const CommandsProtocolChapter: MotorCommandType = {
    CommandString: "Commands protocol",
    CommandEnum: 1001,
    CommandGroup: "Get started",
    Description: "",
    Input: "",
    Output: ""
}

export const QuickStartChapter: MotorCommandType = {
    CommandString: "Quick start",
    CommandEnum: 1002,
    CommandGroup: "Get started",
    Description: "",
    Input: "",
    Output: ""
}