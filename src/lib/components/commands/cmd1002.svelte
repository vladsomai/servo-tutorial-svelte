<script lang="ts">
	import { Modal, SetModalComponent } from '../modal/modal.svelte';
	import Model3d from '../modal/model-3d.svelte';
	import FireworksImg from '$lib/images/fireworks.svg';
	import MotorToRs232 from '$lib/images/motor-to-rs485.png';
	import type { DetectedDeviceType, MotorCommandType } from '$lib/client-server-lib/types';
	import Generic from './generic.svelte';
	import { DetectedDevices } from '$lib/stores/global';
	import { SelectedAxis } from '$lib/stores/global';
	import { ConvertAxisToStr } from '$lib/client-server-lib/utils';
	import SelectAxis from '../select-axis.svelte';
	let {
		data
	}: { data: { MotorCommands: Map<number, MotorCommandType>; CommandId: string; Theme: string } } =
		$props();

	const defaultDev = 'Select target device';
	let selectedDevice: DetectedDeviceType | string = $state(defaultDev);

	const DetectDevicesProps = {
		MotorCommands: data.MotorCommands,
		CommandId: '20',
		Theme: data.Theme
	};
	const IdentifyProps = { MotorCommands: data.MotorCommands, CommandId: '41', Theme: data.Theme };
</script>

<div class="mt-16 flex flex-col items-center justify-center px-5">
	<div class="">
		<article class="prose prose-slate mb-5 max-w-full">
			<h2 class="mb-2">Prerequisites</h2>
			<p>In order to follow this tutorial you will need the following:</p>
			<ol>
				<li>Gearotons servo motor</li>
				<li>12V to 24V Power supply</li>
				<li>USB to RS-485 adapter</li>
				<li>Wires to connect the motor to the power supply and RS-485 adapter</li>
			</ol>
			<h2 class="mb-2">Powering the motor on</h2>
			<p>
				The motor has two markings with the positive(+) and negative(-) pins (you can check the
				exact location of those pins on our &nbsp;
				{@render Model3dBtn()}
				&nbsp; from the home page), those pins will have two wires that need to be connected to a 12V
				to 24V power supply.
				<br />
				When the motor is powered on, a green or red LED flashes.
			</p>
			<ol>
				<li>
					Green LED flashing slowly: the MCU is currently operating in its main loop, waiting for a
					command from the user.
				</li>
				<li>Green LED flashing fast: MCU is in the bootloader, it will not accept any commands.</li>
				<li>Red LED flashing: the MCU has an error, it will not accept any commands.</li>
			</ol>
			<p>
				When the motor is in a state identical to points 2 and 3 from above, you should send a reset
				command. For now, you can reset the motor by pressing the reset button. Check out its exact
				location on our &nbsp;
				{@render Model3dBtn()}
				.
			</p>
			<h4>Verify the motor spins (applicable M1 motor types only)</h4>
			<p>
				After you power on the motor and the green LED flashes slowly, you can press the rotate
				button to make sure everything works as expected at this point.
			</p>
			<ol>
				<li>
					Pressing the rotate button quickly should rotate the motor for 2 seconds in one direction.
				</li>
				<li>
					Pressing and releasing after 0.5 seconds should rotate the motor for 2 seconds in the
					other direction.
				</li>
				<li>
					Pressing and releasing after 3 seconds will cause the motor to go into closed loop control
					mode.
				</li>
				<li>
					Pressing and releasing after 15 seconds will cause the motor to perform a self
					calibration. Make sure that there is nothing connected to the shaft.
					<br />
					<p class="text-warning inline font-extrabold">
						CAUTION:{' '}
					</p>
					The motor will spin several times back and forth during the calibration.
				</li>
			</ol>
			<h2 class="mb-2">Connecting to the motor</h2>
			<p>
				The motor has 4 RS-485 pins, marked with B A B A on the PCBA(check the exact location using
				the &nbsp;
				{@render Model3dBtn()}
				&nbsp;), we will only use one pair of B A for now. Using some wires, physically connect the B
				A pins from the motor to the B A pins of the RS-485 adapter as shown in the figure below.
			</p>
			<div class="flex w-full justify-center">
				<img
					class="h-auto"
					loading="eager"
					src={MotorToRs232}
					sizes="100vw"
					width={600}
					alt="motor to rs-485 wiring"
				/>
			</div>
			<h4>Driver installation</h4>
			<p>
				The RS-485 adapter requires its driver software, installation steps differ based on the
				manufacturer, some require explicit installation(the driver must be downloaded manually from
				the manufacturer&apos;s website), and some of them are installed automatically when plugged
				in. We advise you to do your own research on how to accomplish this step based on the
				product you own.
			</p>
			<h4>Verify the connection</h4>
			<p>
				At this point, the motor is physically connected to the RS-485 adapter and the RS-485
				adapter is plugged into your PC.
			</p>
			<p>The motor is powered on and the green LED flashes slowly.</p>
			<ol>
				<li>Click on the red button from the Log Window to display the available COM ports.</li>
				<li>
					Select the COM port that targets your motor and click &apos;Connect&apos;. In case you
					don&apos;t see any COM port available, your driver is not installed correctly.
				</li>
				<li>
					You should see a confirmation message in the Log Window whether the connection was
					successful or not.{' '}
				</li>
				<li>Make sure CAPS-LOCK is active.</li>
				<li class="mt-2">
					<p class="inline">Press</p>
					<kbd class="kbd text-neutral-content"> ctrl </kbd>
					+
					<kbd class="kbd text-neutral-content"> R </kbd>
					<p class="inline">to reset the motor.</p>
				</li>
				<li>
					The motor&apos;s LED should flash fast for 0.5s and then start flashing slowly. This means
					you successfully reset the motor and the communication between your PC and the motor is
					established.
				</li>
				<li>
					The Log Window should contain a hexadecimal representation of the bytes sent over the
					serial lines to the servo motor. The reset command we just sent using the reset command
					shortcut is 0x 0F FF 1B B1AA5CED.
				</li>
			</ol>
			<h2>Log Window</h2>
			<p>
				The log window is tailored to make you have a better user experience, you can click on the
				sent and received bytes in the Log Window to quickly understand what each byte means. Some
				received bytes are dynamically converted to ASCII, decimal, or strings to quickly translate
				the hexadecimal to something more human-understandable.
				<br />
			</p>
			<p class="text-warning inline font-extrabold">
				Note:{' '}
			</p>
			<p class="inline">
				The Log Window always displays data in little-endian format. That&apos;s the format we use
				to send and receive data.
			</p>
			<p>The Log Window header contains 5 buttons:</p>
			<ol>
				<li>
					Connect/Disconnect: informs the user whether he/she is currently connected to the servo
					motor.
					<br /> When this button is green, you can send commands.
					<br /> When the button is red, you must connect to send any commands.
				</li>
				<li>
					Quick menu / Disable MOSFETS: disables the MOSFETs transistors. Those transistors are used
					to control whether the motor itself can receive current. <br />
					<p class="text-warning inline font-extrabold">
						Note:{' '}
					</p>
					The motor has the MOSFETs disabled by default when you power it on or after issuing a system
					reset command.
				</li>
				<li>
					Quick menu / Enable MOSFETS: enables the MOSFETs transistors. Before issuing any movement
					command, the MOSFETs must be enabled for the motor to spin.
					<br />
					<p class="text-warning inline font-extrabold">
						Note:{' '}
					</p>
					When you press the physical rotate button from the PCBA, the MOSFETs will be enabled by the
					firmware and it will remain enabled until power off or system reset.
				</li>
				<li>Quick menu / System reset: press this button to reset the current axis / alias.</li>
				<li>
					Quick menu / Get status: Sends the command that receives the current status of the motor. <br
					/>
					e.g., In case the red LED from the motor flashes, you can press this button to read what is
					the current state by clicking on the received output bytes, thus helping you diagnose issues
					faster or understand what happened.
					<br />
					Read more about the GET STATUS command{' '}
					<a href="/docs/16">here</a>.
				</li>
				<li>Clear: press this button to clear the Log Window.</li>
			</ol>
			<p class="text-warning inline font-extrabold">
				Note:{' '}
			</p>
			<p class="inline">
				When you press DISABLE/ENABLE MOSFETS or GET STATUS buttons, the actual command is sent to
				the currently selected alias, learn more about alias in the next section.
				<br /> When you navigate on our site, we preserve the state of the alias you selected.
			</p>
			<hr />
			<h2>Find out your device alias</h2>
			<p>
				Before you can use the docs to test supported commands, you must know or set your
				motor&apos;s alias.
				<br />
				The alias is simply a number ranging from 0 to 255 that you can set to identify your motor. Out
				of the factory, the motor&apos;s alias will not be set to anything.
			</p>
			<p>
				Let&apos;s execute the DETECT DEVICES command with the alias input box set to
				&apos;255&apos;. That means we will send the detect devices command to all devices connected
				to the serial port. All connected motors will respond with their unique id, current alias,
				and a CRC32 payload.
				<br />
				For your convenience, devices will be listed right here if they are successfully detected.
			</p>

			<Generic data={DetectDevicesProps} />

			<div class="flex w-full justify-center">
				<select
					class="select select-sm"
					bind:value={selectedDevice}
					onchange={() => {
						if (typeof selectedDevice == 'string') {
							return;
						}
						const ax = selectedDevice as DetectedDeviceType;
						$SelectedAxis = ConvertAxisToStr(ax.Alias);
					}}
				>
					<option selected disabled>{defaultDev}</option>
					{#each $DetectedDevices as dev}
						<option value={dev}
							>UniqueID: {dev.UniqueID} | Alias: {ConvertAxisToStr(dev.Alias)}</option
						>
					{/each}
				</select>
			</div>
			<hr />
			<h2>Identify your device</h2>
			<p>
				Using the &quot;Detect devices&quot; command you were able to find out your motor&apos;s
				Unique ID and the current alias.
			</p>
			<p>
				By sending the Identify command, you can identify each motor by its unique ID. The motor
				will flash its green LED rapidly for 3 seconds. The command must be sent using the Unique ID
				of the motor you want to identify, allowing you to set a particular alias for that motor
				afterward. This command is helpful in case you have multiple motors in a daisy chain and you
				want to name them differently.
			</p>
			<Generic data={IdentifyProps} />
			<hr />
			<h2>Set device alias</h2>
			<div class="my-5">
				<p>
					The &quot;Alias&quot; of your motor was provided by &quot;Detect devices&quot;. You can
					change the alias using the input box above and then clicking &quot;Set device alias&quot;.
					The motor will remember this alias through power cycles. You can set a new alias to a
					valid ASCII character (examples: A, B, P, l, d) or you can set the alias to any decimal
					value between 0 and 251.
				</p>
				<p class="text-warning mb-0 pb-0 font-extrabold">Note:</p>
				<ul class="my-0">
					<li class="my-0">
						<p class="my-0">
							Aliases 252 and 253 are reserved for response messages and can not be used.
						</p>
					</li>
					<li class="my-0">
						<p class="my-0">
							Alias 254 is reserved for extended addressing messages and can not be used.
						</p>
					</li>
					<li class="my-0">
						<p class="my-0">
							Alias 255 (ALL_ALIAS) is reserved for sending a command to all connected aliases and
							cannot be used. When you want to use multiple motors in a chain, sending a command
							with the 255 alias will send that command to all devices chained together.
						</p>
					</li>
					<li class="my-0">
						<p class="my-0">
							If you want to set the new alias to a decimal value ranging from &quot;0&quot; to
							&quot;9&quot; you must specify it as &quot;00&quot; or &quot;09&quot; Otherwise it
							will be considered an ASCII character.
						</p>
					</li>
				</ul>
			</div>

			{#await import(`./cmd21.svelte`) then Command}
				<Command.default
					children={{}}
					currentCommand={data.MotorCommands.get(21) as MotorCommandType}
				></Command.default>
			{:catch}
				<p>Error mounting set device alias</p>
			{/await}

			<hr />
			<h2>Ping your alias</h2>
			<p>
				You can send some arbitrary data (10 characters long) to the motor using the PING COMMAND,
				it shall reply exactly the same data you sent.
				<br />
				Make sure to use the right alias of your device that you set above.
			</p>

			<div class="flex w-full justify-center">
				<SelectAxis />
			</div>
			{#await import(`./cmd31.svelte`) then Command}
				<Command.default
					children={{}}
					currentCommand={data.MotorCommands.get(31) as MotorCommandType}
				></Command.default>
			{:catch}
				<p>Error mounting ping command</p>
			{/await}
			<hr />
			<h2>Custom motor movement</h2>
			<p>
				All good you may say, but our main scope is to make some metal spin. Let&apos;s see how we
				can accomplish that together.
			</p>
			<p>
				Using the TRAPEZOID MOVE command, we can make the motor spin in one direction by setting the
				position to a positive value or spin it the other way by setting the position to a negative
				value.
			</p>
			<ol>
				<li>Select the correct alias detected in our previous step.</li>
				<li>
					Click on the &apos;ENABLE MOSFETS&apos; button from the Log Window, or you could use the
					shortcut :
					<kbd class="kbd">ctrl</kbd>+
					<kbd class="kbd">e</kbd>
					<p class="inline">to enable MOSFETs on the current selected alias.</p>
				</li>
			</ol>
			<p>After you press the execute button, the motor will spin 1 revolutions within 1 second.</p>

			<div class="flex w-full justify-center">
				<SelectAxis />
			</div>
			{#await import(`./cmd2.svelte`) then Command}
				<Command.default
					children={{}}
					currentCommand={data.MotorCommands.get(2) as MotorCommandType}
				></Command.default>
			{:catch}
				<p>Error mounting trapezoid command</p>
			{/await}
			<hr />
			<div class="flex w-full flex-col items-center justify-center text-center">
				<h2>
					{' '}
					Congrats on making it this far! We now believe you are ready to explore the rest of the commands
					on your own.
				</h2>
				<img
					class="h-auto w-[200px]"
					src={FireworksImg}
					width={300}
					height={300}
					alt="congratulations"
				/>
			</div>
		</article>
	</div>
</div>

{#snippet Model3dBtn()}
	<button
		class="cursor-pointer underline"
		title="3D Model"
		onclick={() => {
			SetModalComponent(Model3d);
			Modal.Dialog?.showModal();
		}}
	>
		3D model
	</button>
{/snippet}
