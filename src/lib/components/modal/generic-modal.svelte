<script lang="ts">
	import { Modal } from './modal.svelte';
	import DefaultImage from '$lib/images/icons/unknown.svg';
</script>

<div class="flex h-full w-full flex-col items-center justify-center overflow-auto px-2">
	{#if Modal.Content != null}
		{#if Modal.Content.Title}
			<h3 class="my-5 text-3xl">{Modal.Content.Title}</h3>
		{/if}
		<div class="flex flex-col break-words">
			{#if Modal.Content.Description.length != 0}
				{#each Modal.Content.Description as descItem}
					<p class="mt-2 break-words">{descItem}</p>
				{/each}
			{/if}
		</div>
		{#if Modal.Content.Image && Modal.Content.Image != ''}
			<img src={Modal.Content.Image} class="mt-10 max-w-[200px]" alt="modal" />
		{/if}
	{/if}
</div>
