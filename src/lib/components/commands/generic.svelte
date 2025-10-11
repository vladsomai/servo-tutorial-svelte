<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import SelectAxis from '../select-axis.svelte';
	import { GetFuncNameFromCmdString } from '$lib/client-server-lib/utils';
	import { SelectedAxis, SelectedUniqueID } from '$lib/stores/global';
	import { M3 } from './commands';
	import CodeHighligher from '../code-highlighter/code-highligher.svelte';
	import { GlobalMotorCommandsMap } from '../../../hooks.client';
	let {
		CommandId,
		ShowCodeSamples = false
	}: {
		CommandId: number;
		ShowCodeSamples?: boolean;
	} = $props();

	const currentCommand = $derived(GlobalMotorCommandsMap.get(CommandId));
</script>

{#if currentCommand != null && currentCommand.Description != '' && currentCommand.Input == null}
	<div class="mt-5 flex flex-col text-center transition-all duration-300">
		<div class="w-full flex justify-center">

			<SelectAxis />
		</div>
		<button
			class="btn btn-primary btn-sm mx-auto my-5"
			onclick={() => {
				const cmdFunction = GetFuncNameFromCmdString(currentCommand.CommandString);
				// @ts-ignore
				M3[cmdFunction]($SelectedAxis, $SelectedUniqueID, currentCommand, []);
			}}>{currentCommand.CommandString}</button
		>
	</div>
	{#if ShowCodeSamples}
		<div class="divider"></div>
		<CodeHighligher {currentCommand} />
	{/if}
{/if}
