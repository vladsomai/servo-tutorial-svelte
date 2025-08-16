<script lang="ts">
	import CommandMenu from '$lib/components/command-menu.svelte';
	import LogWindow from '$lib/components/log-window/log-window.svelte';

	let { data } = $props();
</script>

<div class="m-2 flex rounded-2xl">
	<section class="bg-base-300 h-[98vh] w-2/12 overflow-auto rounded-2xl 2xl:w-[10%]">
		<CommandMenu MotorCommands={data.MotorCommands} />
	</section>
	<section class="bg-base-300 mx-2 h-[98vh] w-5/12 overflow-auto rounded-2xl 2xl:w-[45%]">
		<h1>Command {data.CommandId}</h1>
	</section>
	<section
		id="parent-log-window"
		class="bg-base-300 h-[98vh] w-5/12 overflow-auto rounded-2xl 2xl:w-[45%]"
	>
		<LogWindow />
	</section>
</div>
