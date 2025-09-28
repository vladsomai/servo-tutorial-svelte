<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import CmdNotImplemented from './cmd-not-implemented.svelte';
	import SelectAxis from '../select-axis.svelte';
	import { CommandsWithShortcuts, M3 } from './commands';
	import { GetFuncNameFromCmdString } from '$lib/client-server-lib/utils';
	import { SelectedAxis } from '$lib/stores/global';
	import FeedbackIcon from '$lib/images/icons/envelope-paper.svg';
	import View3dIcon from '$lib/images/icons/view3d.svg';
	import InfoIcon from '$lib/images/icons/info-circle-fill.svg';
	import { Modal, SetModalComponent, SetModalContent } from '../modal/modal.svelte';
	import Model3d from '../modal/model-3d.svelte';
	let {
		data
	}: { data: { MotorCommands: Map<number, MotorCommandType>; CommandId: string; Theme: string } } =
		$props();

	let currentCommand = $derived(data.MotorCommands.get(Number(data.CommandId)));
</script>

<div class="flex w-full justify-between">
	<button
		class="btn rounded-full px-3 text-black"
		onclick={() => {
			SetModalComponent(Model3d);
			Modal.Dialog?.showModal();
		}}
	>
		<img src={View3dIcon} alt="info" width="25" height="auto" />
		View 3D</button
	>
	{#if currentCommand != null && CommandsWithShortcuts.get(currentCommand?.CommandEnum) != null}
		<button
			class="btn m-0 rounded-full px-2"
			onclick={() => {
				SetModalContent({
					Title: '',
					Image: '',
					Description: []
				});
				SetModalComponent(CommandsWithShortcuts.get(currentCommand?.CommandEnum));
				Modal.Dialog?.showModal();
			}}
		>
			<img src={InfoIcon} alt="info" width="25" height="auto" />
		</button>
	{/if}
	<a href="/feedback" class="btn rounded-full text-black">
		<img src={FeedbackIcon} alt="feedback" />
		Feedback</a
	>
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
		<div class="mt-5 flex flex-col text-center">
			<SelectAxis />
			{#if currentCommand.Input == null}
				<button
					class="btn btn-primary btn-sm mx-auto my-5"
					onclick={() => {
						const cmdFunction = GetFuncNameFromCmdString(currentCommand.CommandString);

						// @ts-ignore
						M3[cmdFunction]($SelectedAxis, currentCommand, []);
					}}>{currentCommand.CommandString}</button
				>
			{/if}
		</div>
	</div>
{/if}
{#await import(`./cmd${data.CommandId}.svelte`) then Command}
	<Command.default {currentCommand}></Command.default>
{:catch}
	<!-- A dedicated component is not defined for this currentCommand -->

	{#if currentCommand == null || (currentCommand != null && currentCommand.Input != null)}
		<!-- Show command not implemented when: 
		 1. The current command does not exist
		 2. The current command exists and needs input but the UI component is not defined  
		This is because any commands that needs inputs, must have a dedicated page to collect user's input -->
		<CmdNotImplemented {currentCommand} />
	{/if}
{/await}
