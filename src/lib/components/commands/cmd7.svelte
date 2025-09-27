<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import { GetFuncNameFromCmdString } from '$lib/client-server-lib/utils';
	import { SelectedAxis } from '$lib/stores/global';
	import LabeledInput from '../labeled-input.svelte';
	import { M3 } from './commands';

	let { currentCommand, children }: { currentCommand: MotorCommandType; children: any } = $props();

	let type = $state(1);
	let noOfReadBack = $state(0);
	let channels = $state(0);
	let aquireSampleFrq = $state(0);
	let noOfSamplesToSum = $state(0);
	let divisionFactor = $state(0);
</script>

<div class="mb-5 mt-2 w-full">
	<div class="flex flex-col justify-center">
		<div class="flex flex-col items-center justify-center">
			<LabeledInput Class="mt-2" TooltipText={''} Label={'Type of data'} bind:InputValue={type} />
			<LabeledInput
				Class="mt-2"
				TooltipText={''}
				Label={'Read back pts'}
				bind:InputValue={noOfReadBack}
			/>
			<LabeledInput Class="mt-2" TooltipText={''} Label={'Channels'} bind:InputValue={channels} />
			<LabeledInput
				Class="mt-2"
				TooltipText={''}
				Label={'Aquire freq'}
				bind:InputValue={aquireSampleFrq}
			/>
			<LabeledInput
				Class="mt-2"
				TooltipText={''}
				Label={'No. of samples'}
				bind:InputValue={noOfSamplesToSum}
			/>
			<LabeledInput
				Class="mt-2"
				TooltipText={''}
				Label={'Division factor'}
				bind:InputValue={divisionFactor}
			/>
		</div>

		<button
			class="btn btn-primary btn-sm mx-auto mt-5"
			onclick={() => {
				const cmdFunction = GetFuncNameFromCmdString(currentCommand.CommandString);

				// @ts-ignore
				M3[cmdFunction]($SelectedAxis, currentCommand, [
					{ value: type, type: 'number', unit: '' },
					{ value: noOfReadBack, type: 'number', unit: '' },
					{ value: channels, type: 'number', unit: '' },
					{ value: aquireSampleFrq, type: 'number', unit: '' },
					{ value: noOfSamplesToSum, type: 'number', unit: '' },
					{ value: divisionFactor, type: 'number', unit: '' }
				]);
			}}>{currentCommand.CommandString}</button
		>
	</div>
</div>
