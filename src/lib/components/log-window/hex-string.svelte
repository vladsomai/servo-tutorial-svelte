<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';

	let { hexStr, description, color }: { hexStr: string; description: string; color: string } =
		$props();
	let isOpen = $state(false);
</script>

<details
	class="dropdown ml-1 cursor-pointer"
	onmouseleave={() => {
		isOpen = false;
	}}
	bind:open={isOpen}
>
	<summary class={`${color}`}>{hexStr}</summary>
	<div class="menu dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-sm">
		<p>{description}</p>
	</div>
</details>

<style>
	summary {
		/* Hide the default marker */
		list-style: none;
	}

	/* For Firefox, which sometimes requires a different approach */
	summary::-webkit-details-marker,
	summary::marker {
		display: none;
		content: '';
	}
</style>
