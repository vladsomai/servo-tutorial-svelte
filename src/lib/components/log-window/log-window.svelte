<script lang="ts">
	import { SerialPortActions } from '$lib/client-server-lib/serial-communication/serial-comm';
	import { SerialPortState } from '$lib/client-server-lib/serial-communication/state.svelte';
	import { SelectedAxis, SelectedUniqueID, ShowLogTimestamp } from '$lib/stores/global';
	import { fly } from 'svelte/transition';
	import { M3 } from '../commands/commands';
	import ShowLogTimestampComp from '../show-log-timestamp-comp.svelte';
	import LogLine from './log-line.svelte';
	import { LogLevelType, LogWindowLogs, ClearLogs } from './state.svelte';
	let { data } = $props();

	$effect(() => {
		LogWindowLogs.Logs;
		const parentEl = document.getElementById('log-content-container');
		if (parentEl == null) {
			return;
		}

		parentEl.scrollTo({ top: parentEl.scrollHeight, behavior: 'instant' });
	});

	let isDropdownOpen = $state(false);
</script>

<div class="h-full">
	<div class="bg-base-200 flex w-full flex-col items-center justify-center pt-3">
		<p>Log window</p>

		<div class="mt-3 flex w-full items-end justify-around">
			{#if SerialPortState.SerialPort == null}
				<button
					class="btn btn-error flex flex-col rounded-b-none rounded-t-2xl leading-3 hover:opacity-90"
					onclick={() => {
						SerialPortActions.ConnectToSerialPort();
					}}
				>
					Disconnected
					<span class="mt-0 text-[10px] normal-case"> Press to connect </span>
				</button>
			{:else}
				<button
					class="btn btn-success flex flex-col rounded-b-none rounded-t-2xl leading-3 hover:opacity-90"
					onclick={() => {
						SerialPortActions.DisconnectFromSerialPort();
					}}
				>
					Connected
					<span class="text-[10px] normal-case"> Press to disconnect </span>
				</button>
			{/if}
			<details
				bind:open={isDropdownOpen}
				class="dropdown dropdown-center btn btn-sm z-1 m-0 rounded-b-none rounded-t-2xl"
				onmouseenter={() => {
					isDropdownOpen = true;
				}}
				onmouseleave={() => {
					isDropdownOpen = false;
				}}
			>
				<summary class="text-[12px] font-semibold">Quick menu</summary>
				<ul class="menu dropdown-content bg-base-100 rounded-box z-1 mt-4 p-2 shadow-sm">
					<li>
						<button
							class="btn btn-sm"
							onclick={() => {
								M3.EnableMosfets($SelectedAxis, $SelectedUniqueID);
							}}
						>
							Enable MOSFETS
						</button>
					</li>
					<li>
						<button
							class="btn btn-sm mt-2"
							onclick={() => {
								M3.DisableMosfets($SelectedAxis, $SelectedUniqueID);
							}}
						>
							Disable MOSFETS
						</button>
					</li>
					<li>
						<button
							class="btn btn-sm mt-2"
							onclick={() => {
								M3.SystemReset($SelectedAxis, $SelectedUniqueID);
							}}
						>
							System reset
						</button>
					</li>

					<li>
						<button
							class="btn btn-sm mt-2"
							onclick={() => {
								M3.GetStatus($SelectedAxis, $SelectedUniqueID);
							}}
						>
							Get status
						</button>
					</li>
					<li>
						<ShowLogTimestampComp />
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
				<p class="line-number ml-2 mr-1 w-[45px] text-right text-sm opacity-50">
					{i + 1}
				</p>
				<div class="inline w-full">
					{#if Log.Level == LogLevelType.Error}
						<p class="text-error w-full">
							{#if $ShowLogTimestamp}
								{Log.Timestamp}|
							{/if}
							{Log.Log}
						</p>
					{:else if Log.Level == LogLevelType.Warning}
						<p class="text-warning w-full">
							{#if $ShowLogTimestamp}
								{Log.Timestamp}|
							{/if}{Log.Log}
						</p>
					{:else if Log.Level == LogLevelType.Command}
						<LogLine {Log} />
					{:else}
						<p class="w-full">
							{#if $ShowLogTimestamp}
								{Log.Timestamp}|
							{/if}{Log.Log}
						</p>
					{/if}
				</div>
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
		border-right: 2px solid #6b7280;
		user-select: none;
		padding-right: 5px;
	}
</style>
