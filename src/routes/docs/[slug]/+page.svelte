<script lang="ts">
	import CommandMenu from '$lib/components/command-menu.svelte';
	import Command from '$lib/components/commands/command.svelte';
	import LogWindow from '$lib/components/log-window/log-window.svelte';
</script>

<div class="m-2 flex rounded-2xl">
	<section
		class="bg-base-100 h-[98vh] w-[40%] overflow-auto rounded-2xl md:w-[25%] lg:w-[20%] xl:w-[15%] 2xl:w-[12%]"
	>
		<CommandMenu />
	</section>
	<div class="flex w-[60%] flex-col md:w-[75%] md:flex-row lg:w-[80%] xl:w-[85%] 2xl:w-[88%]">
		<section
			class="bg-base-100 m-1 h-[48vh] w-full overflow-auto rounded-2xl md:my-0 md:h-[98vh] md:w-[50%]"
		>
			<Command />
		</section>
		<section
			id="parent-log-window"
			class="bg-base-100 m-1 h-[48vh] w-full overflow-auto rounded-2xl md:my-0 md:h-[98vh] md:w-[50%]"
		>
			<LogWindow />
		</section>
	</div>
</div>
