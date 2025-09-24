<script lang="ts">
	import { SelectedAxis } from '$lib/stores/global';

	// let { currentCommand, children }: { currentCommand: MotorCommandType; children: any } = $props();
</script>

<label class="input input-sm w-[200px]">
	<span class="label w-[100px]">Alias</span>
	<input
		name="select-axis"
		bind:value={$SelectedAxis}
		class="w-[50px]"
	/>
</label>
