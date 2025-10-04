<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import { GetFuncNameFromCmdString } from '$lib/client-server-lib/utils';
	import { SelectedAxis, SelectedUniqueID } from '$lib/stores/global';
	import LabeledInput from '../labeled-input.svelte';
	import LabeledSelect from '../labeled-select.svelte';
	import { LogWarning } from '../log-window/state.svelte';
	import { M3 } from './commands';
	import conversionData from './unit_conversions_M3.json';
	const units = conversionData.units;

	let { currentCommand, children }: { currentCommand: MotorCommandType; children: any } = $props();
	let acceleration = $state(3);
	let accelerationUnit = $state(units.acceleration[0]);
</script>

<div class="mb-5 mt-2 w-full">
	<div class="flex flex-col justify-center">
		<div class="flex flex-col items-center justify-center">
			<LabeledSelect
				Class="mt-5"
				TooltipText={''}
				Label={'Acc unit'}
				bind:SelectValue={accelerationUnit}
				Options={units.acceleration}
			/>
			<LabeledInput
				Class="mt-2"
				TooltipText={''}
				Label={'Acceleration'}
				bind:InputValue={acceleration}
			/>
		</div>

		<button
			class="btn btn-primary btn-sm mx-auto mt-5"
			onclick={() => {
				const cmdFunction = GetFuncNameFromCmdString(currentCommand.CommandString);

				// @ts-ignore
				M3[cmdFunction]($SelectedAxis, $SelectedUniqueID, currentCommand, [
					{ value: acceleration, type: 'acceleration', unit: accelerationUnit }
				]);
			}}>{currentCommand.CommandString}</button
		>
	</div>
</div>
