<script lang="ts">
	import { SerialPortActions } from '$lib/client-server-lib/serial-communication/serial-comm';
	import { SerialPortState } from '$lib/client-server-lib/serial-communication/state.svelte';
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
</script>

<div class="h-full">
	<div class="bg-base-200 flex w-full flex-col items-center justify-center pt-2">
		<p>Log window</p>

		<div class="mt-3 flex w-full justify-around">
			{#if SerialPortState.SerialPort == null}
				<button
					class="btn btn-error flex flex-col rounded-b-none leading-3 hover:opacity-90"
					onclick={() => {
						SerialPortActions.ConnectToSerialPort();
					}}
				>
					Disconnected
					<span class="mt-0 text-[10px] normal-case"> Press to connect </span>
				</button>
			{:else}
				<button
					class="btn btn-success flex flex-col rounded-b-none leading-3 hover:opacity-90"
					onclick={() => {
						SerialPortActions.DisconnectFromSerialPort();
					}}
				>
					Connected
					<span class="text-[10px] normal-case"> Press to disconnect </span>
				</button>
			{/if}

			{@render LogWIndowButton('Addlog', 'btn', () => {
				LogInfo(
					'Lorem ipsum dolor. Lorem ipsum dolor. Lorem ipsum dolor. Lorem ipsum dolor. Lorem ipsum dolor.Lorem ipsum dolor. Lorem ipsum dolor. Lorem ipsum dolor. Lorem ipsum dolor.Lorem ipsum dolor. Lorem ipsum dolor. Lorem ipsum dolor. Lorem ipsum dolor. '
				);
				LogError('test');
				LogWarning('test');
			})}

			{@render LogWIndowButton('Clear', 'btn', () => {
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

{#snippet LogWIndowButton(btnName: string, className: string, onClick: Function)}
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
