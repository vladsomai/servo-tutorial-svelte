<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import { ShowLogTimestamp } from '$lib/stores/global';
	import { onMount } from 'svelte';
	import HexString from './hex-string.svelte';
	import type { LogType } from './state.svelte';
	import { InterpretCommand } from '../commands/commands';

	let { Log }: { Log: LogType } = $props();
	const IsSendCommand = Log.Log.includes('Sent') ? true : false;
	const indexOf0x = Log.Log.indexOf('0x');
	const logBeforeHex = Log.Log.slice(0, indexOf0x + 2);
	const hexString = Log.Log.slice(indexOf0x + 2, Log.Log.length);
	const logSplitted = hexString.match(/.{1,2}/g) as unknown as string;

	interface LogComponent {
		HexStr: string;
		Description: string;
		Color: string;
	}
	const logComponents: LogComponent[] = $state([]);

	const cmdDescriptionReceived = ['Sender ID (R)', 'Response status', 'Length byte'];
	const cmdDescriptionSent = ['Target motor alias', 'Command byte', 'Length byte'];

	const logCompColor = [
		' text-violet-400',
		' text-violet-500',
		' text-violet-400',
		' text-blue-400',
		' text-blue-500'
	];

	onMount(() => {
		const byteInterp = InterpretCommand(hexString);
		for (let i = 0; i < logSplitted.length; i++) {
			const logComp: LogComponent = {
				HexStr: logSplitted[i],
				Description: `${logSplitted[i]}`,
				Color: i % 2 == 0 ? logCompColor[0] : logCompColor[1]
			};


			if (i < 3) {
				const desc = IsSendCommand ? cmdDescriptionSent[i] : cmdDescriptionReceived[i];

				logComp.Description = desc;
				logComp.Color = i % 2 == 0 ? logCompColor[0] : logCompColor[1];
			}

			logComponents.push(logComp);
		}
	});
</script>

<p class="">
	{#if $ShowLogTimestamp}
		{Log.Timestamp}|
	{/if}{logBeforeHex}
</p>
{#each logComponents as logComp}
	<HexString hexStr={logComp.HexStr} description={logComp.Description} color={logComp.Color} />
{/each}
