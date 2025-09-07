<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import CmdNotImplemented from './cmd-not-implemented.svelte';
	import SelectAxis from '../select-axis.svelte';

	let {
		data
	}: { data: { MotorCommands: Map<number, MotorCommandType>; CommandId: string; Theme: string } } =
		$props();

	let currentCommand = $derived(data.MotorCommands.get(Number(data.CommandId)));
</script>

<div class="flex w-full justify-between">
	<a href="/" class="btn rounded-full">Home</a>
	<a href="/products/M1/3D" class="btn rounded-full">M1</a>
	<a href="/products/M3/3D" class="btn rounded-full">M3</a>
	<button class="btn rounded-full">Info</button>
	<a href="/feedback" class="btn rounded-full">Feedback</a>
</div>

{#if currentCommand != undefined && currentCommand.Description != ''}
	<div class="px-5">
		<div class="mt-10 flex w-full flex-col items-center justify-center">
			<p class="text-2xl font-bold tracking-wider">{currentCommand.CommandString}</p>
		</div>
		<div>
			<div class="mt-5">
				<p class="font-black tracking-wider">Description</p>
				<p>{currentCommand.Description}</p>
			</div>
			<div class="mt-5">
				<p class="font-black tracking-wider">Inputs</p>
				<p>{JSON.stringify(currentCommand.Input)}</p>
			</div>
			<div class="mt-5">
				<p class="font-black tracking-wider">Outputs</p>
				<p>{JSON.stringify(currentCommand.Output).replaceAll('"', '')}</p>
			</div>
		</div>

		<div class="divider"></div>
		<div class="mt-5 text-center">
			<p class="mb-2 font-black tracking-wider">Select motor's alias</p>
			<SelectAxis />
		</div>
	</div>
{/if}
{#await import(`./cmd${data.CommandId}.svelte`) then Command}
	<Command.default {currentCommand}></Command.default>
{:catch}
	<CmdNotImplemented {currentCommand} />
{/await}
