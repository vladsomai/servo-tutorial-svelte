<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';

	let { currentCommand }: { currentCommand: MotorCommandType | undefined } = $props();
</script>

{#if currentCommand == null}
	<div class="mt-10 flex w-full flex-col items-center justify-center">
		<p class="text-2xl">Command does not exist</p>
	</div>
{:else}
	<div class="mt-10 flex w-full flex-col items-center justify-center">
		<p class="text-2xl">Command {currentCommand.CommandEnum}</p>
		<p class="text-2xl">{currentCommand.CommandString}</p>
		<p class="text-2xl">Command not implemented</p>
	</div>
{/if}
