<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import { SelectedAxis } from '$lib/stores/global';
	import { M3 } from './commands';
	import LabeledInput from '../labeled-input.svelte';
	import LabeledSelect from '../labeled-select.svelte';

	import conversionData from './unit_conversions_M3.json';
	import { GetFuncNameFromCmdString } from '$lib/client-server-lib/utils';
	const units = conversionData.units;

	let { currentCommand, children }: { currentCommand: MotorCommandType; children: any } = $props();

	let position = $state(1);
	let positionUnit = $state(units.position[0]);

	let duration = $state(1);
	let timeUnit = $state(units.time[1]);
</script>

<div class="mb-5 mt-2 w-full">
	<div class="flex flex-col justify-center">
		<div class="flex flex-col items-center justify-center">
			<LabeledSelect
				Class="mt-5"
				TooltipText={''}
				Label={'Position unit'}
				bind:SelectValue={positionUnit}
				Options={units.position}
			/>
			<LabeledInput Class="mt-2" TooltipText={''} Label={'Position'} bind:InputValue={position} />

			<LabeledSelect
				Class="mt-5"
				TooltipText={''}
				Label={'Time unit'}
				bind:SelectValue={timeUnit}
				Options={units.time}
			/>
			<LabeledInput Class="mt-2" TooltipText={''} Label={'Duration'} bind:InputValue={duration} />
		</div>

				<button
			class="btn btn-primary btn-sm mx-auto mt-5"
			onclick={() => {
				const cmdFunction = GetFuncNameFromCmdString(currentCommand.CommandString);

				// @ts-ignore
				M3[cmdFunction]($SelectedAxis, currentCommand, [
					{ value: position, type: 'position', unit: positionUnit },
					{ value: duration, type: 'time', unit: timeUnit }
				]);
			}}>{currentCommand.CommandString}</button
		>
	</div>
</div>
