<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import CommandMenu from '$lib/components/command-menu.svelte';
	import Command from '$lib/components/commands/command.svelte';
	import LogWindow from '$lib/components/log-window/log-window.svelte';

	let { data } = $props();
</script>

<div class="m-2 flex rounded-2xl">
	<section class="bg-base-100 h-[98vh] w-2/12 overflow-auto rounded-2xl 2xl:w-[10%]">
		<CommandMenu MotorCommands={data.MotorCommands} />
	</section>
	<section class="bg-base-100 mx-2 h-[98vh] w-5/12 overflow-auto rounded-2xl 2xl:w-[45%]">
		<Command {data} />
	</section>
	<section id="parent-log-window" class="bg-base-100 h-[98vh] w-5/12 overflow-auto rounded-2xl 2xl:w-[45%]">
		<LogWindow />
	</section>
</div>
