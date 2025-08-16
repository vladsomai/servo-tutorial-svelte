<script lang="ts">
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

	<div class="h-[500px] overflow-auto border-2 py-3" id="log-content-container">
		{#each LogWindowLogs.Logs as Log, i}
			<div class="flex w-full">
				<p class="line-number w-[30px] ml-1 text-sm">
					{i}
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
		class={`${className} btn btn-sm rounded-t-2xl `}
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
