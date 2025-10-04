<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import { ConvertAxisToNum, GetFuncNameFromCmdString } from '$lib/client-server-lib/utils';
	import { SelectedAxis, SelectedUniqueID } from '$lib/stores/global';
	import LabeledInput from '../labeled-input.svelte';
	import { LogError } from '../log-window/state.svelte';
	import { M3 } from './commands';

	let { currentCommand, children }: { currentCommand: MotorCommandType; children: any } = $props();

	let deviceAlias = $state('X');
</script>

<div class="mb-5 mt-2 w-full">
	<div class="flex flex-col justify-center">
		<div class="flex flex-col items-center justify-center">
			<LabeledInput
				Class="mt-2"
				TooltipText={''}
				Label={'New alias'}
				bind:InputValue={deviceAlias}
				Type={'string'}
			/>
		</div>

		<button
			class="btn btn-primary btn-sm mx-auto mt-5"
			onclick={() => {
				const axValue = ConvertAxisToNum(deviceAlias);

				if (axValue == 253 || axValue == 252) {
					const msg = `Alias ${axValue} is reserved. See protocol spec for more details.`;
					LogError(msg);
				}

				const cmdFunction = GetFuncNameFromCmdString(currentCommand.CommandString);

				// @ts-ignore
				M3[cmdFunction]($SelectedAxis, $SelectedUniqueID, currentCommand, [
					{ value: axValue, type: 'number', unit: '' }
				]);
			}}>{currentCommand.CommandString}</button
		>
	</div>
</div>
