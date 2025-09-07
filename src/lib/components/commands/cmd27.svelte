<script lang="ts">
	import { EnableMosfets, SystemReset } from './commands';
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import { LogInfo } from '../log-window/state.svelte';
	import { SelectedAxis } from '$lib/stores/global';

	let { currentCommand, children }: { currentCommand: MotorCommandType; children: any } = $props();

	async function systemReset() {
		await SystemReset($SelectedAxis);
	}
</script>

<div class="mb-5 w-full">
	<div class="flex flex-col justify-center">
		<button class="btn btn-primary btn-sm mx-auto mt-5" onclick={systemReset}>
			System reset
		</button>
	</div>
</div>
