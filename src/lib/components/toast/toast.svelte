<script lang="ts">
	import { flip } from 'svelte/animate';
	import Alert from './alert.svelte';
	import { ToastObject } from './toast-state.svelte';
	import { fly } from 'svelte/transition';
</script>

<div class="toast toast-center z-10">
	{#each ToastObject.ToastElements as toast (toast)}
		<div animate:flip out:fly={{ duration: 500, y: 30 }}>
			<Alert {toast} />
		</div>
	{/each}
</div>
