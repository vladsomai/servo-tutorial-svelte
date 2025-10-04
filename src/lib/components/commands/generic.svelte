<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import SelectAxis from '../select-axis.svelte';
	import { GetFuncNameFromCmdString } from '$lib/client-server-lib/utils';
	import { SelectedAxis, SelectedUniqueID } from '$lib/stores/global';
	import { M3 } from './commands';
	let {
		data
	}: { data: { MotorCommands: Map<number, MotorCommandType>; CommandId: string; Theme: string } } =
		$props();

	let currentCommand = $derived(data.MotorCommands.get(Number(data.CommandId)));
</script>

{#if currentCommand != undefined && currentCommand.Description != ''}
	<div class="mt-5 flex flex-col text-center transition-all duration-300">
		<SelectAxis />
		{#if currentCommand.Input == null}
			<button
				class="btn btn-primary btn-sm mx-auto my-5"
				onclick={() => {
					const cmdFunction = GetFuncNameFromCmdString(currentCommand.CommandString);
					// @ts-ignore
					M3[cmdFunction]($SelectedAxis, $SelectedUniqueID, currentCommand, []);
				}}>{currentCommand.CommandString}</button
			>
		{/if}
	</div>
{/if}
