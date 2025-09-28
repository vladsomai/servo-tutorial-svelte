<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import { ShowLogTimestamp } from '$lib/stores/global';
	import { onMount } from 'svelte';
	import HexString from './hex-string.svelte';
	import type { LogType } from './state.svelte';
	import { InterpretCommand, type ByteInterpretation } from '../commands/commands';

	let { Log }: { Log: LogType } = $props();

	const indexOf0x = Log.Log.indexOf('0x');
	const logBeforeHex = Log.Log.slice(0, indexOf0x + 2);
	const hexString = Log.Log.slice(indexOf0x + 2, Log.Log.length);

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
		const commandInterp = InterpretCommand(hexString);

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
	{/if}{logBeforeHex}
</p>
{#each logComponents as logComp}
	<HexString hexStr={logComp.HexString} description={logComp.Description} color={logComp.Color} />
{/each}
