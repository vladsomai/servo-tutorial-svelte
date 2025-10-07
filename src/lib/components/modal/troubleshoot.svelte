<script lang="ts">
	import DefaultImage from '$lib/images/troubleshoot.svg';
	import { Modal } from './modal.svelte';
</script>

<div class="flex h-full w-full flex-col overflow-auto px-2">
	<article class="prose prose-slate mb-5 max-w-full">
		<h2 class="text-center capitalize">{Modal.StatusErrorCode!.short_desc}</h2>

		<p class="text-center text-2xl mb-0">{Modal.StatusErrorCode!.long_desc}</p>

		<div class="w-ful flex justify-around">
			<div>
				<p class="text-2xl">Causes</p>
				<ul class="flex flex-col break-words">
					{#each Modal.StatusErrorCode!.causes as cause}
						<li>
							<p class="mt-0">{cause}</p>
						</li>
					{/each}
				</ul>
			</div>
			<div>
				<p class="text-2xl">Solutions</p>
				<ul class="flex flex-col break-words">
					{#each Modal.StatusErrorCode!.solutions as solution}
						<li>
							<p class="mt-0">{solution}</p>
						</li>
					{/each}
				</ul>
			</div>
		</div>
		<div class="flex w-full justify-center">
			<img src={DefaultImage} class="h-auto w-[200px]" alt="troubleshoot" />
		</div>
	</article>
</div>
