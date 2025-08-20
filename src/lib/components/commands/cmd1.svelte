<script lang="ts">
	import { sleep } from '$lib/client-server-lib/utils';
	import { DisableMosfets, EnableMosfets } from './commands';
	import type { MotorCommandType } from '$lib/client-server-lib/types';

	// let { children, data } = $props();
	let { currentCommand }: { currentCommand: MotorCommandType } = $props();

	async function enableMosfets() {
		EnableMosfets(0x58);
	}
</script>

<div class="mb-5 w-full">
	<div class="flex justify-center flex-col">
		<div class="mr-4">
			<!-- {@render children()} -->
		</div>
		<div class="mt-10 flex w-full flex-col items-center justify-center">
			<p class="text-2xl">Command {currentCommand.CommandEnum}</p>
			<p class="text-2xl">{currentCommand.CommandString}</p>
		</div>
		<button class="btn btn-primary btn-sm mx-auto mt-5" onclick={enableMosfets}>
			Enable MOSFETS
			<!-- {data.CommandId == 0 ? 'DISABLE MOSFETS' : 'ENABLE MOSFETS'} -->
		</button>
	</div>
</div>
