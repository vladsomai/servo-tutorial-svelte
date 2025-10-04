<div class="mt-16 flex flex-col items-center justify-center px-5">
	<div class="">
		<article class="prose prose-slate mb-5 max-w-full">
			<h2 class="mb-2">Servo Motor RS485 Communication Protocol</h2>
			<p>
				This document describes the RS485-based communication protocol used in the servo motor
				control system. The protocol enables reliable communication between a host controller and
				multiple servo motor devices on a shared RS485 bus.
			</p>

			<h3>Send packet format</h3>
			<ol>
				<li>Size Byte(s)</li>
				<ul>
					<li><p>7-bit size: Encoded first byte containing the packet size</p></li>
					<li>
						<p>
							The LSB (bit 0) is always set to 1 for validation purposes and to enable automatic
							baud rate detection in the future
						</p>
					</li>
					<li><p>The actual size value is stored in bits 1-7 (size = encoded_byte >> 1)</p></li>
					<li>
						<p>
							This is the direct size of the entire packet including all fields and even including
							the size byte, unless the decoded size is 127, which indicated extended size
						</p>
					</li>
				</ul>
				<li>
					<p>
						Extended 16-bit size: Encoded first byte contains 127 and two more bytes contain the
						actual 16-bit size
					</p>
					<ul>
						<li>
							<p>
								If the decoded size value is 127 (DECODED_FIRST_BYTE_EXTENDED_SIZE), then the next
								two bytes form a 16-bit size value. It is little endian.
							</p>
						</li>
					</ul>
				</li>
				<li>Address Byte(s)</li>
				<ul>
					<li><p class="">Standard Addressing mode: Single byte containing device alias</p></li>
					<ul class="text-sm">
						<li><p>`255` (ALL_ALIAS): Broadcasts to all devices on the bus</p></li>
						<li><p>`254` (EXTENDED_ADDRESSING): Indicates extended addressing mode</p></li>
						<li>
							<p>
								`253` (RESPONSE_CHARACTER_CRC32_ENABLED): Indicates a response from a device where
								the response HAS a 4-byte CRC32 checksum at the end
							</p>
						</li>
						<li>
							<p>
								`252` (RESPONSE_CHARACTER_CRC32_DISABLED): Indicates a response from a device where
								the response DOES NOT HAVE a 4-byte CRC32 checksum at the end
							</p>
						</li>
						<li><p>`0-251`: Normal device aliases</p></li>
					</ul>
					<li>
						<p class="">
							Extended Addressing mode: When the address byte is `254` (EXTENDED_ADDRESSING), the
							next 8 bytes contain the 64-bit Unique ID of the target device
						</p>
					</li>
				</ul>

				<li>Command Byte: 8-bit value specifying the operation to be performed</li>
				<li>Payload Data: Variable length data according to the command requirements</li>
				<li>
					CRC32 (4 bytes, optional): When CRC32 is enabled, the last 4 bytes of the packet contain a
					CRC32 checksum of all preceding bytes (including size and address bytes)
				</li>
			</ol>

			<h3>Response packet format</h3>
			<p>
				Responses from devices follow a similar format: they start with the size byte, and are
				followed by an address byte, which is set to eitiher `253`
				(RESPONSE_CHARACTER_CRC32_ENABLED) to indicate a reply from a device with a CRC32 checksum
				appended, or to `252` (RESPONSE_CHARACTER_CRC32_DISABLED) to indicate a reply from a device
				which does not have the 4-byte CRC32.
			</p>

			<h2>Command Processing Flow</h2>

			<ol>
				<li><p>Initialization</p></li>
				<ul>
					<li><p>The system initializes UART1 for RS485 communication at 230400 baud</p></li>
					<li>
						<p>
							Hardware is configured to use the hardware based communication direction control
							through the DE pin (transmit/receive switching)
						</p>
					</li>
				</ul>
				<li><p>Reception Process</p></li>
				<ul>
					<li><p>When data arrives, the USART1 interrupt handler processes it byte by byte</p></li>
					<li>
						<p>
							Bytes are collected until a complete packet is formed based on the size information
						</p>
					</li>
					<li>
						<p>Timeout detection resets the reception process if there's a gap in transmission</p>
					</li>
					<li><p>Error detection for framing, overrun, and noise errors</p></li>
					<li><p>Statistics are gathered for any of these arrors</p></li>
					<li>
						<p>
							These types of errors do not cause a fatal error and a command is available for the
							user to fetch the statistics from the device
						</p>
					</li>
				</ul>
				<li><p>Packet Validation</p></li>
				<ul>
					<li><p>Validates that the first byte has LSB=1 (part of the encoding scheme)</p></li>
					<li><p>Decodes the first byte to determine packet size</p></li>
					<li>
						<p>If extended size is indicated, reads the next two bytes for the full packet size</p>
					</li>
					<li>
						<p>
							Checks if the packet is addressed to this device (matching alias, broadcast, or
							matching Unique ID)
						</p>
					</li>
					<li><p>If CRC32 is enabled, validates the CRC32 checksum</p></li>
					<li><p>Buffers the packet for processing if valid</p></li>
				</ul>
				<li><p>Command Processing</p></li>

				<ul>
					<li>
						<p>Main program loop processes commands when `rs485_has_a_packet()` returns true</p>
					</li>
					<li>
						<p>
							`rs485_get_next_packet()` extracts command, payload size, payload pointer, and
							broadcast flag
						</p>
					</li>
					<li>
						<p>
							This function handles all addressing modes and returns only packets addressed to this
							device
						</p>
					</li>
					<li>
						<p>
							After processing, `rs485_done_with_this_packet()` must be called to clear the receive
							buffer
						</p>
					</li>
				</ul>
				<li><p>Response Transmission</p></li>
				<ul>
					<li><p>`rs485_transmit()` sends basic data back to the host</p></li>
					<li>
						<p>
							`rs485_finalize_and_transmit_packet()` handles CRC32 calculation and packet
							finalization before transmission
						</p>
					</li>
					<li><p>Responses include the CRC32 checksum if CRC32 is enabled</p></li>
				</ul>
			</ol>
			<h2>CRC32 Implementation</h2>
			<p>The protocol includes CRC32 error detection:</p>
			<ol>
				<li><p>Calculation</p></li>
				<ul>
					<li><p>Uses hardware CRC32 unit for efficient processing</p></li>
					<li><p>Calculated over the entire packet (including size and address bytes)</p></li>
					<li><p>4-byte CRC32 value is placed at the very end of the packet in all cases</p></li>
				</ul>
				<li><p>CRC32 Enable or Disable Control</p></li>
				<ul>
					<li><p>Enabled by default after reset or power cycle</p></li>
					<li><p>Can be disabled/enabled using `CRC32_CONTROL_COMMAND`</p></li>
					<li>
						<p>
							CRC32 error statistics tracked and retrievable via `GET_CRC32_ERROR_COUNT_COMMAND`
						</p>
					</li>
					<li>
						<p>
							A device will check or not check the CRC32 of a received packet based on whether or
							not the CRC32 checking is enabled through this command
						</p>
					</li>
					<li>
						<p>
							A response will have or not have a CRC32 checksome appended based on whether or not
							the CRC32 checking is enabled through this command
						</p>
					</li>
					<li>
						<p>
							User needs to be careful that if he/she disables CRC32 (not the default) then all
							commands following should have no CRC32 bytes and also the responses from the device
							will have no CRC32 calculated or appended
						</p>
					</li>
					<li>
						<p>
							The main advantage of disabling CRC32 checking is that it makes communication a bit
							faster (less bytes to send). The user is advised that they should first try their
							application with CRC32 enabled and periodically look at the communication statistics
							to make sure that communication is happening with 100% reliablilty. Only then should
							they consider to disable CRC32 checking.
						</p>
					</li>
				</ul>
				<li><p>Key Functions</p></li>
				<ul>
					<li><p>`crc32_init()`: Initializes the CRC32 hardware unit</p></li>
					<li><p>`calculate_crc32_buffer()`: Calculates CRC32 for a data buffer</p></li>
					<li><p>`rs485_validate_packet_crc32()`: Validates received packet CRC32</p></li>
					<li>
						<p>`rs485_finalize_and_transmit_packet()`: Adds CRC32 to outgoing packets if enabled</p>
					</li>
				</ul>
			</ol>
			<h2>Error Handling</h2>
			<p>The protocol includes robust error handling mechanisms:</p>
			<ul>
				<li><p>Framing errors: Incorrect stop/start bits</p></li>
				<li><p>Overrun errors: Data received before previous byte processed</p></li>
				<li><p>Noise errors: Electrical interference</p></li>
				<li><p>Command overflow: New command received before previous one processed</p></li>
				<li><p>Command too long: Exceeding buffer capacity</p></li>
				<li><p>CRC32 errors: Data corruption during transmission or invalid packet format</p></li>
			</ul>

			<h2>Visual Indicators</h2>
			<p>The green LED is turned on when bytes are being received and off when reception is idle</p>

			<h2>Special Features</h2>
			<ul>
				<li><p>Timeout detection: Resets the reception state if transmission is interrupted</p></li>
				<li><p>Broadcast support: Commands can be sent to all devices simultaneously</p></li>
				<li>
					<p>
						Communication direction control: Automatic direction switching for transmit/receive
						using DE pin of the hardware
					</p>
				</li>
				<li>
					<p>
						Simulation support: Protocol can be used in both real hardware and simulation
						environments
					</p>
				</li>
			</ul>

			<h2>Key Functions</h2>
			<ul>
				<li><p>`rs485_init()`: Initializes the RS485 communication interface</p></li>
				<li><p>`rs485_has_a_packet()`: Checks if a valid packet is available for processing</p></li>
				<li><p>`rs485_get_next_packet()`: Retrieves the next packet for processing</p></li>
				<li><p>`rs485_validate_packet_crc32()`: Validates the CRC32 checksum of a packet</p></li>
				<li>
					<p>
						`rs485_done_with_this_packet()`: Clears processed packet and enables reception of the
						next packet
					</p>
				</li>
				<li><p>`rs485_transmit()`: Sends raw data over the RS485 bus without modification</p></li>
				<li>
					<p>
						`rs485_finalize_and_transmit_packet()`: Sets packet size, adds CRC32 if enabled, and
						transmits the packet
					</p>
				</li>
				<li><p>`encode_first_byte()`: Encodes a byte by shifting left and setting LSB to 1</p></li>
				<li><p>`decode_first_byte()`: Decodes a byte by shifting right</p></li>
			</ul>

			<h2>Packet Validation</h2>
			<ul>
				<li><p>The system validates that the first byte of a packet has LSB=1</p></li>
				<li>
					<p>
						Any packet with LSB=0 in the first byte is rejected by attempting to receive it despite
						the error and then discarding the packet
					</p>
				</li>
				<li>
					<p>
						Packets are also validated based on the CRC32 checksum that is at the end of every
						packet (although this can be disabled to save bytes)
					</p>
				</li>
				<li>
					<p>
						Reception resets after a timeout (10ms without UART traffic), so one way to make sure
						that a corrupt packet gets flushed it to wait the timeout before sending another packet
					</p>
				</li>
			</ul>
			<h2>Extended Addressing</h2>
			<p>The protocol supports addressing devices by their 64-bit Unique ID:</p>
			<ol>
				<li><p>Addressing Mode</p></li>
				<ul>
					<li>
						<p>
							When address byte is `EXTENDED_ADDRESSING (254)`, the next 8 bytes contain the
							device's 64-bit Unique ID
						</p>
					</li>
				</ul>
				<li><p>Implementation Details</p></li>
				<ul>
					<li><p>Firmware recognizes and processes extended addressing commands</p></li>
					<li>
						<p>
							Python library supports both standard addressing (by alias) and extended addressing
							(by Unique ID)
						</p>
					</li>
					<li>
						<p>
							The `-a` option in the command-line interface accepts both aliases and Unique IDs
							(16-character hex strings)
						</p>
					</li>
					<li>
						<p>
							The system automatically detects whether to use standard or extended addressing based
							on the input format
						</p>
					</li>
				</ul>

				<li><p>Usage Example</p></li>
				<ul>
					<li><p>Standard addressing: `python3 motor_command.py -a 1 ENABLE_MOSFETS`</p></li>
					<li>
						<p>
							Extended addressing: `python3 motor_command.py -a 0123456789ABCDEF ENABLE_MOSFETS`
						</p>
					</li>
				</ul>
			</ol>

			<h2>CRC32-Related Commands</h2>
			<ol>
				<li><p>CRC32_CONTROL_COMMAND</p></li>
				<ul>
					<li><p>Enables or disables CRC32 checking</p></li>
					<li><p>Payload: Single byte (CRC32_ENABLE or CRC32_DISABLE)</p></li>
					<li><p>Default: Enabled after reset or power cycle</p></li>
				</ul>

				<li><p>Get communication statistics command</p></li>
				<ul>
					<li>
						<p>
							Retrieves the current CRC32 error count, packet decode error count, first bit error
							count, framing error count, overrun error count, and noise error count
						</p>
					</li>
					<li><p>Payload: Single byte (CRC32_ERROR_READ_ONLY or CRC32_ERROR_RESET)</p></li>
					<li><p>Response: 32-bit numbers for each type of error</p></li>
					<li><p>Can optionally reset the error counter after getting the counts</p></li>
					<li>
						<p>
							See the motor_commands.json file for more details or run `python3 motor_command.py -c`
						</p>
					</li>
				</ul>
			</ol>
			<h2>Future Enhancements</h2>

			<p>Planned enhancements for the communication protocol:</p>

			<ol>
				<li><p>Support extended addressing in the Arduino module</p></li>
				<ul>
					<li><p>Enable specifying the unique ID when creating a motor object</p></li>
					<li>
						<p>Add function to change the unique ID of the class that is commanding the device</p>
					</li>
				</ul>

				<li><p>Change the way that we set the alias</p></li>
				<ul>
					<li><p>Use extended addressing mode to address devices specifically</p></li>
					<li>
						<p>Simplify the "Set device alias" command to require only the new alias parameter</p>
					</li>
				</ul>

				<li><p>Automatic baud rate detection</p></li>
				<ul>
					<li>
						<p>
							The first bit of the first byte of a packet is purposely always set to 1, which forces
							the start bit to be clearly define with a falling edge and a rising edge after one bit
							time. Theoretically we can calculate the baud rate from this.
						</p>
					</li>
				</ul>
			</ol>
		</article>
	</div>
</div>
