<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import { SelectedAxis, SelectedUniqueID } from '$lib/stores/global';
	import { M3 } from './commands';
	import LabeledInput from '../labeled-input.svelte';
	import LabeledSelect from '../labeled-select.svelte';
	import { GetFuncNameFromCmdString } from '$lib/client-server-lib/utils';
	import { GlobalConversionTypes } from '../../../hooks.client';
	import Converter from './converter.svelte';

	let { currentCommand, children }: { currentCommand: MotorCommandType; children: any } = $props();

	let acceleration = $state(1);
	let accelerationUnit = $state(GlobalConversionTypes.units.acceleration[0]);

	let duration = $state(3);
	let timeUnit = $state(GlobalConversionTypes.units.time[1]);
</script>

<div class="mb-5 mt-2 w-full">
	<div class="flex flex-col justify-center">
		<div class="flex flex-col items-center justify-center">
			<LabeledSelect
				Class="mt-5"
				TooltipText={''}
				Label={'Acc unit'}
				bind:SelectValue={accelerationUnit}
				Options={GlobalConversionTypes.units.acceleration}
			/>
			<LabeledInput
				Class="mt-2"
				TooltipText={''}
				Label={'Acceleration'}
				bind:InputValue={acceleration}
			/>

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
					{ value: acceleration, type: 'acceleration', unit: accelerationUnit },
					{ value: duration, type: 'time', unit: timeUnit }
				]);
			}}>{currentCommand.CommandString}</button
		>

		<div class="divider"></div>

		<Converter unit={accelerationUnit} value={acceleration} converter={'Acceleration'} />
		<Converter unit={timeUnit} value={duration} converter={'Time'} />
	</div>
</div>
