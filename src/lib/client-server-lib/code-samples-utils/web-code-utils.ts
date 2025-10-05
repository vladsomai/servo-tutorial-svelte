export function changeCommandWebCode(motor_command: number, webCode: string) {
    const regEx = new RegExp('const motor_command\\s=\\s.*(\\r?\\n)')
    return webCode.replace(regEx, "const motor_command = " + motor_command.toString() + `$1`);
}

export function changeAliasWebCode(alias: number, webCode: string): string {
    const regEx = new RegExp('const alias\\s=\\s.*(\\r?\\n)')
    return webCode.replace(regEx, "const alias = " + alias.toString() + `$1`);
}

export function changeDisplacementWebCode(position: number, webCode: string): string {
    const regEx = new RegExp('const move_displacement_rotations\\s=\\s.*(\\r?\\n)')
    return webCode.replace(regEx, "const move_displacement_rotations = " + position.toString() + `$1`);
}

export function changeTimeWebCode(time: number, webCode: string): string {
    const regEx = new RegExp('const move_time_seconds\\s=\\s.*(\\r?\\n)')
    return webCode.replace(regEx, "const move_time_seconds = " + time.toString() + `$1`);
}

export function changeVelocityWebCode(velocity_rpm: number, webCode: string): string {
    const regEx = new RegExp('const velocity_rpm\\s=\\s.*(\\r?\\n)')
    return webCode.replace(regEx, "const velocity_rpm = " + velocity_rpm.toString() + `$1`);
}

export function changeAccelerationWebCode(acceleration_rpm2: number, webCode: string): string {
    const regEx = new RegExp('const acceleration_rpm2\\s=\\s.*(\\r?\\n)')
    return webCode.replace(regEx, "const acceleration_rpm2 = " + acceleration_rpm2.toString() + `$1`);
}

// export function changeHallSensorDataTypeWebCode(dataType: DataToCapture, webCode: string): string {
//     const regEx = new RegExp('const data_to_capture\\s=\\s.*(\\r?\\n)')
//     return webCode.replace(regEx, "const data_to_capture = " + dataType.toString() + `$1`);
// }

export function changeElapsedTimeSinceResetWebCode(elapsedTime: BigInt, webCode: string): string {
    const regEx = new RegExp('const elapsed_time_since_reset\\s=\\s.*(\\r?\\n)')
    return webCode.replace(regEx, "const elapsed_time_since_reset = " + elapsedTime.toString() + `$1`);
}

export function changeUniqueIdWebCode(uniqueId: string, webCode: string): string {
    const regEx = new RegExp('const unique_id\\s=\\s.*(\\r?\\n)')
    return webCode.replace(regEx, "const unique_id = \'" + uniqueId.toString() + '\'\n');
}

export function changeNewAlisWebCode(newAlias: number, webCode: string): string {
    const regEx = new RegExp('const new_alias\\s=\\s.*(\\r?\\n)')
    return webCode.replace(regEx, "const new_alias = " + newAlias.toString() + `$1`);
}

export function changeMotorCurrentWebCode(motorCurrent: number, webCode: string): string {
    const regEx = new RegExp('const motor_current\\s=\\s.*(\\r?\\n)')
    return webCode.replace(regEx, "const motor_current = " + motorCurrent.toString() + `$1`);
}

export function changeRegenCurrentWebCode(regenCurrent: number, webCode: string): string {
    const regEx = new RegExp('const regeneration_current\\s=\\s.*(\\r?\\n)')
    return webCode.replace(regEx, "const regeneration_current = " + regenCurrent.toString() + `$1`);
}

export function changeCommandLengthWebCode(commandLength: number, webCode: string): string {
    const regEx = new RegExp('const motor_command_length\\s=\\s.*(\\r?\\n)')
    return webCode.replace(regEx, "const motor_command_length = " + commandLength.toString() + `$1`);
}

export function changeMultiMovesWebCode(multiMoves: string, webCode: string): string {
    const regEx = new RegExp('const multi_moves\\s=\\s.*(\\r?\\n)')
    return webCode.replace(regEx, "const multi_moves = [" + multiMoves.toString() + ' ]\n');
}

export function changeMovesTypesWebCode(movesTypes: string, webCode: string): string {
    const regEx = new RegExp('const moves_types\\s=\\s.*(\\r?\\n)')
    return webCode.replace(regEx, "const moves_types = \'" + movesTypes.toString() + '\'\n');
}

export function changeLowerRotationLimitWebCode(lowerRotationLimit: number, webCode: string): string {
    const regEx = new RegExp('const lower_rotation_limit\\s=\\s.*(\\r?\\n)')
    return webCode.replace(regEx, "const lower_rotation_limit = " + lowerRotationLimit.toString() + `$1`);
}

export function changeUpperRotationUpperLimitWebCode(upperRotationLimit: number, webCode: string): string {
    const regEx = new RegExp('const upper_rotation_limit\\s=\\s.*(\\r?\\n)')
    return webCode.replace(regEx, "const upper_rotation_limit = " + upperRotationLimit.toString() + `$1`);
}

export function changePingTextWebCode(pingText: string, webCode: string): string {
    const regEx = new RegExp('const ping_text\\s=\\s.*(\\r?\\n)')
    return webCode.replace(regEx, "const ping_text = \'" + pingText + '\'\n');
}

export function changeTurnOnOffGatheringWebCode(turnOnOffGathering: string, webCode: string): string {
    const regEx = new RegExp('const turn_on_off_gathering\\s=\\s.*(\\r?\\n)')
    return webCode.replace(regEx, "const turn_on_off_gathering = " + turnOnOffGathering + '\n');
}

export function changeStepsPerRevolutionWebCode(stepsPerRevolution: number, clangCode: string): string {
    const regEx = new RegExp('MOVE_DISPLACEMENT_MOTOR_UNITS_PER_ROTATION\\s=\\s.*(\\r?\\n)')
    return clangCode.replace(regEx, "MOVE_DISPLACEMENT_MOTOR_UNITS_PER_ROTATION = " + stepsPerRevolution + '\n');
}