<script lang="ts">
	import { SerialPortActions } from '$lib/client-server-lib/serial-communication/serial-comm';
	import { SerialPortState } from '$lib/client-server-lib/serial-communication/state.svelte';
	import { DisableMosfets, EnableMosfets } from '../commands/commands';
	import {
		LogInfo,
		LogError,
		LogWarning,
		LogLevelType,
		LogWindowLogs,
		ClearLogs
	} from './state.svelte';

	$effect(() => {
		LogWindowLogs.Logs;
		// const parentEl = document.getElementById('parent-log-window');
		const parentEl = document.getElementById('log-content-container');
		if (parentEl == null) {
			return;
		}

		parentEl.scrollTo({ top: parentEl.scrollHeight, behavior: 'instant' });
	});

	let commandsDetailsElem: HTMLDetailsElement | null = $state(null);
</script>

<div class="h-full">
	<div class=" bg-base-200 flex w-full flex-col items-center justify-center pt-3">
		<p>Log window</p>

		<div class="mt-3 flex w-full items-end justify-around">
			{#if SerialPortState.SerialPort == null}
				<button
					class="btn btn-error flex flex-col rounded-b-none leading-3 hover:opacity-90 rounded-t-2xl"
					onclick={() => {
						SerialPortActions.ConnectToSerialPort();
					}}
				>
					Disconnected
					<span class="mt-0 text-[10px] normal-case"> Press to connect </span>
				</button>
			{:else}
				<button
					class="btn btn-success flex flex-col rounded-b-none leading-3 hover:opacity-90 rounded-t-2xl"
					onclick={() => {
						SerialPortActions.DisconnectFromSerialPort();
					}}
				>
					Connected
					<span class="text-[10px] normal-case"> Press to disconnect </span>
				</button>
			{/if}

			<details
				bind:this={commandsDetailsElem}
				class="dropdown dropdown-center btn btn-sm rounded-b-none rounded-t-2xl"
				onmouseenter={() => {
					commandsDetailsElem?.setAttribute('open', 'true');
				}}
				onmouseleave={() => {
					commandsDetailsElem?.removeAttribute('open');
				}}
				onblur={() => {
					console.log('blurred');
				}}
			>
				<summary class="">Commands</summary>
				<ul class="menu dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow-sm">
					<li>
						<button
							class="btn btn-sm"
							onclick={() => {
								EnableMosfets(0x58);
							}}
						>
							Enable MOSFETS
						</button>
					</li>
					<li>
						<button
							class="btn btn-sm mt-2"
							onclick={() => {
								DisableMosfets(0x58);
							}}
						>
							Disable MOSFETS
						</button>
					</li>
				</ul>
			</details>

			{@render LogWindowButton('Clear', 'btn', () => {
				ClearLogs();
			})}
		</div>
	</div>

	<div class="h-[90%] overflow-auto py-3" id="log-content-container">
		{#each LogWindowLogs.Logs as Log, i}
			<div class="flex w-full">
				<p class="line-number ml-2 mr-1 w-[30px] text-sm opacity-50">
					{i + 1}
				</p>
				{#if Log.Level == LogLevelType.Error}
					<p class="text-error ml-1 w-full">{Log.Log}</p>
				{:else if Log.Level == LogLevelType.Warning}
					<p class="text-warning ml-1 w-full">{Log.Log}</p>
				{:else}
					<p class="ml-1 w-full">{Log.Log}</p>
				{/if}
			</div>
		{/each}
	</div>
</div>

{#snippet LogWindowButton(btnName: string, className: string, onClick: Function)}
	<button
		class={`${className} btn btn-sm rounded-b-none rounded-t-2xl`}
		onclick={() => {
			onClick();
		}}
	>
		{btnName}
	</button>
{/snippet}

<style>
	.line-number {
		border-right: 1px solid #6b7280;
		user-select: none;
	}
</style>
