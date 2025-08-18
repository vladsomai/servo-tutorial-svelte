
export interface SerialPortStateType {
    SerialPort: SerialPort | null
    SerialPortReader: ReadableStreamDefaultReader<Uint8Array> | null
    SerialPortWriter: WritableStreamDefaultWriter<Uint8Array<ArrayBufferLike>> | null
}

export const SerialPortState = $state<SerialPortStateType>({
    SerialPort: null,
    SerialPortReader: null,
    SerialPortWriter: null,
})

export function SetSerialPort(serialPort: SerialPort | null) {
    SerialPortState.SerialPort = serialPort
}

export function SetSerialPortReader(serialPortReader: ReadableStreamDefaultReader<Uint8Array> | null) {
    SerialPortState.SerialPortReader = serialPortReader
}

export function SetSerialPortWriter(serialPortWriter: WritableStreamDefaultWriter<Uint8Array> | null) {
    SerialPortState.SerialPortWriter = serialPortWriter
}