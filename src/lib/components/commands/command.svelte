<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import CmdNotImplemented from './cmd-not-implemented.svelte';

	let { data }: { data: { MotorCommands: MotorCommandType[]; CommandId: string; Theme: string } } =
		$props();
</script>

{#await import(`./cmd${data.CommandId}.svelte`) then Widget}
	<Widget.default />
{:catch}
	<CmdNotImplemented {data} />
{/await}
