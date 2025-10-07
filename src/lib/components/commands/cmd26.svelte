<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import { GetFuncNameFromCmdString } from '$lib/client-server-lib/utils';
	import { SelectedAxis, SelectedUniqueID } from '$lib/stores/global';
	import LabeledInput from '../labeled-input.svelte';
	import LabeledSelect from '../labeled-select.svelte';
	import { M3 } from './commands';
	import { GlobalConversionTypes } from '../../../hooks.client';
	
	let { currentCommand, children }: { currentCommand: MotorCommandType; children: any } = $props();
	let velocity = $state(3);
	let duration = $state(5);

	let velocityUnit = $state(GlobalConversionTypes.units.velocity[0]);
	let timeUnit = $state(GlobalConversionTypes.units.time[1]);
</script>

<div class="mb-5 mt-2 w-full">
	<div class="flex flex-col justify-center">
		<div class="flex flex-col items-center justify-center">
			<LabeledSelect
				Class="mt-5"
				TooltipText={''}
				Label={'Velocity unit'}
				bind:SelectValue={velocityUnit}
				Options={GlobalConversionTypes.units.velocity}
			/>
			<LabeledInput Class="mt-2" TooltipText={''} Label={'Velocity'} bind:InputValue={velocity} />

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
					{ value: velocity, type: 'velocity', unit: velocityUnit },
					{ value: duration, type: 'time', unit: timeUnit }
				]);
			}}>{currentCommand.CommandString}</button
		>
	</div>
</div>
