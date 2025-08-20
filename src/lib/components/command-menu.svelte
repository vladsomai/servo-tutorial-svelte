<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import LogoImg from '$lib/images/logo.png';

	let { MotorCommands }: { MotorCommands: MotorCommandType[] } = $props();
</script>

<div class="flex flex-col justify-center py-10">
	<a href="/" class="mx-auto mb-5">
		<img src={LogoImg} height="auto" width="160" alt="Gearotons" />
	</a>
	{#each MotorCommands as MotorCommand}
		<a href={`/docs/${MotorCommand.CommandEnum}`} class="text-sm w-full text-center hover:bg-base-300 p-1 py-3 hover:text-primary rounded-r-2xl"
			>{MotorCommand.CommandString}</a
		>
	{/each}
</div>
