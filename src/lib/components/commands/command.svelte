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
			<div class=" mt-5">
				<p class="font-black tracking-wider">Inputs</p>
				{#if typeof currentCommand.Input == 'string'}
					{#if currentCommand.Input == ''}
						<p>None</p>
					{:else}
						<p>{currentCommand.Input}</p>
					{/if}
				{:else if currentCommand.Input == null}
					<p>None</p>
				{:else}
					<div class="prose">
						<ol class="">
							{#each currentCommand.Input as input}
								<li>
									<p>{input.Description}</p>
								</li>
							{/each}
						</ol>
					</div>
				{/if}
			</div>
			<div class="mt-5">
				<p class="font-black tracking-wider">Outputs</p>

				{#if typeof currentCommand.Output == 'string'}
					{#if currentCommand.Output == ''}
						<p>None</p>
					{:else}
						<p>{currentCommand.Output}</p>
					{/if}
				{:else if currentCommand.Output == null}
					<p>None</p>
				{:else}
					<div class="prose">
						<ol class="">
							{#each currentCommand.Output as output}
								<li>
									<p>{output.Description}</p>
								</li>
							{/each}
						</ol>
					</div>
				{/if}
			</div>
		</div>

		<div class="divider"></div>
		<div class="mt-5 text-center">
			<SelectAxis />
		</div>
	</div>
{/if}
{#await import(`./cmd${data.CommandId}.svelte`) then Command}
	<Command.default {currentCommand}></Command.default>
{:catch}
	<CmdNotImplemented {currentCommand} />
{/await}
