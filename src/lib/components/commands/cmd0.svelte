<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import { SelectedAxis } from '$lib/stores/global';
	import { M3 } from './commands';

	let { currentCommand, children }: { currentCommand: MotorCommandType; children: any } = $props();

	async function disableMosfets() {
		await M3.DisableMosfets($SelectedAxis);
	}
</script>

<div class="mb-5 w-full">
	<div class="flex flex-col justify-center">
		<button class="btn btn-primary btn-sm mx-auto mt-5" onclick={disableMosfets}>
			Disable MOSFETS
		</button>
	</div>
</div>
