<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	let { hexStr, description, color }: { hexStr: string; description: string; color: string } =
		$props();
	let isOpen = $state(false);
	let triggerEl: HTMLElement | null = $state(null);
	let dropdownStyles = $state('');
</script>

<details
	class="dropdown ml-1 cursor-pointer"
	onmouseleave={() => {
		isOpen = false;
	}}
	bind:open={isOpen}
>
	<summary
		class={`${color}`}
		bind:this={triggerEl}
		onclick={() => {
			if (triggerEl == null) {
				return;
			}
			const rect = triggerEl.getBoundingClientRect();
			dropdownStyles = `top: ${rect.bottom}px; left: ${rect.left - 200}px;`; //!!!200px is the content width
		}}>{hexStr}</summary
	>
</details>

{#if isOpen}
	<div class="bg-base-300 rounded-box fixed z-50 w-[200px] p-2 shadow-sm" style={dropdownStyles}>
		<p>{description}</p>
	</div>
{/if}

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
