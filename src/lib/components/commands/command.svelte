<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import CmdNotImplemented from './cmd-not-implemented.svelte';
	import { CommandsWithShortcuts, M3 } from './commands';
	import { Modal, SetModalComponent, SetModalContent } from '../modal/modal.svelte';
	import Model3d from '../modal/model-3d.svelte';
	import Generic from './generic.svelte';

	import { fly } from 'svelte/transition';
	import CodeHighligher from '../code-highlighter/code-highligher.svelte';
	let {
		data
	}: { data: { MotorCommands: Map<number, MotorCommandType>; CommandId: string; Theme: string } } =
		$props();
	let currentCommand = $derived(data.MotorCommands.get(Number(data.CommandId)));
</script>

<div class="flex w-full justify-between">
	<button
		class="btn rounded-2xl px-3"
		onclick={() => {
			SetModalComponent(Model3d);
			Modal.Dialog?.showModal();
		}}
	>
		<svg
			class="stroke-base-content"
			width="20px"
			height="20px"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M12 10.2308L3.08495 7.02346M12 10.2308L20.9178 7.03406M12 10.2308V20.8791M5.13498 18.5771L10.935 20.6242C11.3297 20.7635 11.527 20.8331 11.7294 20.8608C11.909 20.8853 12.091 20.8853 12.2706 20.8608C12.473 20.8331 12.6703 20.7635 13.065 20.6242L18.865 18.5771C19.6337 18.3058 20.018 18.1702 20.3018 17.9269C20.5523 17.7121 20.7459 17.4386 20.8651 17.1308C21 16.7823 21 16.3747 21 15.5595V8.44058C21 7.62542 21 7.21785 20.8651 6.86935C20.7459 6.56155 20.5523 6.28804 20.3018 6.0732C20.018 5.82996 19.6337 5.69431 18.865 5.42301L13.065 3.37595C12.6703 3.23665 12.473 3.167 12.2706 3.13936C12.091 3.11484 11.909 3.11484 11.7294 3.13936C11.527 3.167 11.3297 3.23665 10.935 3.37595L5.13498 5.42301C4.36629 5.69431 3.98195 5.82996 3.69824 6.0732C3.44766 6.28804 3.25414 6.56155 3.13495 6.86935C3 7.21785 3 7.62542 3 8.44058V15.5595C3 16.3747 3 16.7823 3.13495 17.1308C3.25414 17.4386 3.44766 17.7121 3.69824 17.9269C3.98195 18.1702 4.36629 18.3058 5.13498 18.5771Z"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>

		View 3D</button
	>
	{#if currentCommand != null && CommandsWithShortcuts.get(currentCommand?.CommandEnum) != null}
		<button
			transition:fly={{ y: -30, duration: 1000 }}
			aria-labelledby="Shortcut supported"
			aria-label="Shortcut supported"
			class="btn m-0 rounded-full px-2"
			onclick={() => {
				SetModalContent({
					Title: '',
					Image: '',
					Description: []
				});
				SetModalComponent(CommandsWithShortcuts.get(currentCommand.CommandEnum));
				Modal.Dialog?.showModal();
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="25"
				height="25"
				fill="currentColor"
				class="bi bi-info-circle-fill"
				viewBox="0 0 16 16"
			>
				<path
					d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
				/>
			</svg>
		</button>
	{/if}
	<a href="/feedback" class="btn rounded-2xl">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			fill="currentColor"
			class="bi bi-envelope-paper stroke-base-content"
			viewBox="0 0 16 16"
		>
			<path
				d="M4 0a2 2 0 0 0-2 2v1.133l-.941.502A2 2 0 0 0 0 5.4V14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5.4a2 2 0 0 0-1.059-1.765L14 3.133V2a2 2 0 0 0-2-2H4Zm10 4.267.47.25A1 1 0 0 1 15 5.4v.817l-1 .6v-2.55Zm-1 3.15-3.75 2.25L8 8.917l-1.25.75L3 7.417V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v5.417Zm-11-.6-1-.6V5.4a1 1 0 0 1 .53-.882L2 4.267v2.55Zm13 .566v5.734l-4.778-2.867L15 7.383Zm-.035 6.88A1 1 0 0 1 14 15H2a1 1 0 0 1-.965-.738L8 10.083l6.965 4.18ZM1 13.116V7.383l4.778 2.867L1 13.117Z"
			/>
		</svg>
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
								{#if output.BitDescriptions != null}
									<ul>
										{#each output.BitDescriptions as bitdesc}
											<li>
												<p>{bitdesc}</p>
											</li>
										{/each}
									</ul>
								{/if}
							{/each}
						</ol>
					</div>
				{/if}
			</div>
		</div>
		<div class="divider"></div>
		<Generic {data}></Generic>
	</div>
{/if}

{#await import(`./cmd${data.CommandId}.svelte`) then Command}
	{#if currentCommand != null}
		<Command.default {currentCommand} {data}></Command.default>
	{/if}
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

<div class="divider"></div>

{#if currentCommand != null && currentCommand.CommandEnum != 1002 && currentCommand.CommandEnum != 1001}
	<CodeHighligher {currentCommand} />
{/if}
