<script lang="ts">
	import { SelectedAxis } from '$lib/stores/global';

	// let { currentCommand, children }: { currentCommand: MotorCommandType; children: any } = $props();
</script>

<input name="select-axis" bind:value={$SelectedAxis} class="input input-sm w-[100px]" />
