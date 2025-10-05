<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import SelectAxis from '../select-axis.svelte';
	import { GetFuncNameFromCmdString } from '$lib/client-server-lib/utils';
	import { SelectedAxis, SelectedUniqueID } from '$lib/stores/global';
	import { M3 } from './commands';
	import CodeHighligher from '../code-highlighter/code-highligher.svelte';
	let {
		data,
		showCodeSamples = false
	}: {
		data: { MotorCommands: Map<number, MotorCommandType>; CommandId: string; Theme: string };
		showCodeSamples?: boolean;
	} = $props();

	let currentCommand = $derived(data.MotorCommands.get(Number(data.CommandId)));
</script>

{#if currentCommand != null && currentCommand.Description != '' && currentCommand.Input == null}
	<div class="mt-5 flex flex-col text-center transition-all duration-300">
		<SelectAxis />
		<button
			class="btn btn-primary btn-sm mx-auto my-5"
			onclick={() => {
				const cmdFunction = GetFuncNameFromCmdString(currentCommand.CommandString);
				// @ts-ignore
				M3[cmdFunction]($SelectedAxis, $SelectedUniqueID, currentCommand, []);
			}}>{currentCommand.CommandString}</button
		>
	</div>
	{#if showCodeSamples}
		<div class="divider"></div>
		<CodeHighligher {currentCommand} />
	{/if}
{/if}
