<script lang="ts">
	import LogoImg from '$lib/images/logo.png';

	let { MotorCommands } = $props();
</script>

<div class="flex flex-col justify-center py-10">
	<a href="/" class="mx-auto mb-5">
		<img src={LogoImg} height="auto" width="160" alt="Gearotons" />
	</a>
	{#each MotorCommands as MotorCommand}
		<a href={`/docs/${MotorCommand.CommandEnum}`} class="btn m-1 py-3"
			>{MotorCommand.CommandString}</a
		>
	{/each}
</div>
