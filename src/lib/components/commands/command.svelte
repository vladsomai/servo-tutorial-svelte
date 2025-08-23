<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import CmdNotImplemented from './cmd-not-implemented.svelte';

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
{#await import(`./cmd${data.CommandId}.svelte`) then Command}
	<Command.default {currentCommand} />
{:catch}
	<CmdNotImplemented {currentCommand} />
{/await}
