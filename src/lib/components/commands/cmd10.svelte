<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import { GetFuncNameFromCmdString } from '$lib/client-server-lib/utils';
	import { SelectedAxis, SelectedUniqueID } from '$lib/stores/global';
	import { onMount } from 'svelte';
	import LabeledInput from '../labeled-input.svelte';
	import LabeledSelect from '../labeled-select.svelte';
	import { M3 } from './commands';
	import conversionData from './unit_conversions_M3.json';
	const units = conversionData.units;

	let { currentCommand, children }: { currentCommand: MotorCommandType; children: any } = $props();

	const mountTime = new Date().getTime();
	let masterTime = $state(0);
	onMount(() => {
		const intervalTim = setInterval(() => {
			const elapsed = (new Date().getTime() - mountTime) * 1000;
			// masterTime = elapsed;
		}, 100);

		return () => {
			clearInterval(intervalTim);
		};
	});
</script>

<div class="mb-5 mt-2 w-full">
	<div class="flex flex-col justify-center">
		<div class="flex flex-col items-center justify-center">
			<LabeledInput
				Class="mt-2"
				TooltipText={''}
				Label={'Absolute time'}
				bind:InputValue={masterTime}
			/>
		</div>

		<button
			class="btn btn-primary btn-sm mx-auto mt-5"
			onclick={() => {
				const cmdFunction = GetFuncNameFromCmdString(currentCommand.CommandString);

				// @ts-ignore
				M3[cmdFunction]($SelectedAxis, $SelectedUniqueID, currentCommand, [
					{ value: masterTime, type: 'number', unit: '' }
				]);
			}}>{currentCommand.CommandString}</button
		>
	</div>
</div>
