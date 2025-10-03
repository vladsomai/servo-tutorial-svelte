<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import { ShowLogTimestamp } from '$lib/stores/global';
	import { onMount } from 'svelte';
	import HexString from './hex-string.svelte';
	import type { LogCommandType, LogType } from './state.svelte';
	import { InterpretCommand, type ByteInterpretation } from '../commands/commands';

	let { Log }: { Log: LogCommandType } = $props();

	interface ByteInterpretationWithColor extends ByteInterpretation {
		Color: string;
	}

	let logComponents: ByteInterpretationWithColor[] = $state([]);
	const logCompColor = [' text-violet-400', ' text-violet-500'];

	let colorIdx = 0;

	function GetByteColor() {
		return logCompColor[colorIdx++ % 2];
	}

	onMount(() => {
		const commandInterp = InterpretCommand(Log);

		const temp: ByteInterpretationWithColor[] = [];
		for (const part of commandInterp) {
			temp.push({ ...part, Color: GetByteColor() });
		}

		logComponents = temp;
	});
</script>

<p class="">
	{#if $ShowLogTimestamp}
		{Log.Timestamp}|
	{/if}
</p>
<p class="">
	{#if Log.IsSendCmd}
		{'Sent 0x'}
	{:else}
		{'Received 0x'}
	{/if}
</p>
{#each logComponents as logComp}
	<HexString hexStr={logComp.HexString} description={logComp.Description} color={logComp.Color} />
{/each}
