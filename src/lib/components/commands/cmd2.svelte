<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import { GetFuncNameFromCmdString } from '$lib/client-server-lib/utils';
	import { SelectedAxis, SelectedUniqueID } from '$lib/stores/global';
	import { GlobalConversionTypes } from '../../../hooks.client';
	import GoToReferences from '../go-to-references.svelte';
	import LabeledInput from '../labeled-input.svelte';
	import LabeledSelect from '../labeled-select.svelte';
	import { M3 } from './commands';
	import Converter from './converter.svelte';
	let { currentCommand, children }: { currentCommand: MotorCommandType; children: any } = $props();

	let position = $state(1);
	let positionUnit = $state(GlobalConversionTypes.units.position[0]);

	let duration = $state(1);
	let timeUnit = $state(GlobalConversionTypes.units.time[1]);
</script>

<div class="mb-5 mt-2 w-full">
	<div class="flex flex-col justify-center">
		<div class="flex flex-col items-center justify-center">
			<LabeledSelect
				Class="mt-5"
				TooltipText={''}
				Label={'Position unit'}
				bind:SelectValue={positionUnit}
				Options={GlobalConversionTypes.units.position}
			/>
			<LabeledInput Class="mt-2" TooltipText={''} Label={'Position'} bind:InputValue={position} />

			<LabeledSelect
				Class="mt-5"
				TooltipText={''}
				Label={'Time unit'}
				bind:SelectValue={timeUnit}
				Options={GlobalConversionTypes.units.time}
			/>
			<LabeledInput Class="mt-2" TooltipText={''} Label={'Duration'} bind:InputValue={duration} />
		</div>

		<button
			class="btn btn-primary btn-sm mx-auto mt-5"
			onclick={() => {
				const cmdFunction = GetFuncNameFromCmdString(currentCommand.CommandString);

				// @ts-ignore
				M3[cmdFunction]($SelectedAxis, $SelectedUniqueID, currentCommand, [
					{ value: position, type: 'position', unit: positionUnit },
					{ value: duration, type: 'time', unit: timeUnit }
				]);
			}}>{currentCommand.CommandString}</button
		>

		<div class="divider"></div>
		<GoToReferences />
		<Converter unit={positionUnit} value={position} converter={'Position'} />
		<Converter unit={timeUnit} value={duration} converter={'Time'} />
	</div>
</div>
