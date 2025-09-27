<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import { GetFuncNameFromCmdString } from '$lib/client-server-lib/utils';
	import { SelectedAxis } from '$lib/stores/global';
	import LabeledInput from '../labeled-input.svelte';
	import LabeledSelect from '../labeled-select.svelte';
	import { M3 } from './commands';
	import conversionData from './unit_conversions_M3.json';
	const units = conversionData.units;

	let { currentCommand, children }: { currentCommand: MotorCommandType; children: any } = $props();

	let lowerLimit = $state(-50);
	let lowerLimitUnit = $state(units.position[0]);
	let upperLimit = $state(50);
	let upperLimitUnit = $state(units.position[0]);
</script>

<div class="mb-5 mt-2 w-full">
	<div class="flex flex-col justify-center">
		<div class="flex flex-col items-center justify-center">
			<LabeledSelect
				Class="mt-5"
				TooltipText={''}
				Label={'Position unit'}
				bind:SelectValue={lowerLimitUnit}
				Options={units.position}
			/>
			<LabeledInput
				Class="mt-2"
				TooltipText={''}
				Label={'Lower limit'}
				bind:InputValue={lowerLimit}
			/>

			<LabeledSelect
				Class="mt-5"
				TooltipText={''}
				Label={'Position unit'}
				bind:SelectValue={upperLimitUnit}
				Options={units.position}
			/>
			<LabeledInput
				Class="mt-2"
				TooltipText={''}
				Label={'Upper limit'}
				bind:InputValue={upperLimit}
			/>
		</div>

		<button
			class="btn btn-primary btn-sm mx-auto mt-5"
			onclick={() => {
				const cmdFunction = GetFuncNameFromCmdString(currentCommand.CommandString);

				// @ts-ignore
				M3[cmdFunction]($SelectedAxis, currentCommand, [
					{ value: lowerLimit, type: 'position', unit: lowerLimitUnit },
					{ value: upperLimit, type: 'position', unit: upperLimitUnit }
				]);
			}}>{currentCommand.CommandString}</button
		>
	</div>
</div>
