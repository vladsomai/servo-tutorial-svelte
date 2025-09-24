<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import { SelectedAxis } from '$lib/stores/global';
	import { M3 } from './commands';

	let { currentCommand, children }: { currentCommand: MotorCommandType; children: any } = $props();

	async function detectDevices() {
		await M3.DetectDevices($SelectedAxis);
	}
</script>

<div class="mb-5 w-full">
	<div class="flex flex-col justify-center">
		<button class="btn btn-primary btn-sm mx-auto mt-5" onclick={detectDevices}>
			Detect devices
		</button>
	</div>
</div>
