<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import { fade, fly, slide } from 'svelte/transition';
	import {
		computePosition,
		type ReferenceElement,
		type FloatingElement,
		autoPlacement
	} from '@floating-ui/dom';
	import { sleep } from '$lib/client-server-lib/utils';
	let { hexStr, description, color }: { hexStr: string; description: string; color: string } =
		$props();
	let isOpen = $state(false);

	let floatingElem: HTMLElement | null = $state(null);
	let floatingStyles = $state('');
</script>

<button
	class={`ml-1 cursor-pointer ${color} break-all`}
	onmouseleave={() => {
		isOpen = false;
	}}
	onclick={async (e) => {
		isOpen = true;

		await sleep(30);

		const res = await computePosition(
			e.target as ReferenceElement,
			floatingElem as FloatingElement,
			{
				middleware: [autoPlacement()]
			}
		);
		floatingStyles = `top: ${res.y}px; left: ${res.x}px;`;
	}}
>
	{hexStr}
</button>

{#if isOpen}
	<div
		transition:fly={{ y: -30, duration: 500 }}
		bind:this={floatingElem}
		class={`bg-base-300 rounded-box fixed left-0 top-0 z-50 w-[300px] break-words p-5 shadow-sm `}
		style={floatingStyles}
	>
		<p>
			{description}
		</p>
	</div>
{/if}
