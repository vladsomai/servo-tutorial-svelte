<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import { GetFuncNameFromCmdString } from '$lib/client-server-lib/utils';
	import { SelectedAxis, SelectedUniqueID } from '$lib/stores/global';
	import LabeledInput from '../labeled-input.svelte';
	import { M3 } from './commands';
	let { currentCommand, children }: { currentCommand: MotorCommandType; children: any } = $props();

	let maxCurrent = $state(200);
	let regenCurrent = $state(0);
</script>

<div class="mb-5 mt-2 w-full">
	<div class="flex flex-col justify-center">
		<div class="flex flex-col items-center justify-center">
			<LabeledInput
				Class="mt-2"
				TooltipText={''}
				Label={'Max current'}
				bind:InputValue={maxCurrent}
			/>
			<LabeledInput
				Class="mt-2"
				TooltipText={''}
				Label={'Regen current'}
				bind:InputValue={regenCurrent}
			/>
		</div>

		<button
			class="btn btn-primary btn-sm mx-auto mt-5"
			onclick={() => {
				const cmdFunction = GetFuncNameFromCmdString(currentCommand.CommandString);

				// @ts-ignore
				M3[cmdFunction]($SelectedAxis, $SelectedUniqueID, currentCommand, [
					{ value: maxCurrent, type: 'current', unit: '' },
					{ value: regenCurrent, type: 'current', unit: '' }
				]);
			}}>{currentCommand.CommandString}</button
		>
	</div>
</div>
