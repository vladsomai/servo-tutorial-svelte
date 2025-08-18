<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';

	let { data }: { data: { MotorCommands: MotorCommandType[]; CommandId: string; Theme: string } } =
		$props();

	let currentCommand = $derived.by(() => {
		const foundCmd = data.MotorCommands.find((cmd: MotorCommandType) => {
			if (cmd.CommandEnum.toString().toLowerCase() == data.CommandId.toLocaleLowerCase()) {
				return true;
			}
		});

		return foundCmd;
	});
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
