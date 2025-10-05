<script lang="ts">
	import { ToastLevel } from '$lib/client-server-lib/types';
	import { fly } from 'svelte/transition';
	import {
		computePosition,
		type ReferenceElement,
		type FloatingElement,
		offset,
		autoPlacement
	} from '@floating-ui/dom';
	import { sleep } from '$lib/client-server-lib/utils';
	import { AddToast } from '../toast/toast-state.svelte';
	let { hexStr, description, color }: { hexStr: string; description: string; color: string } =
		$props();
	let isOpen = $state(false);
	let isMouseOver = $state(false);

	let floatingElem: HTMLElement | null = $state(null);
	let floatingStyles = $state('');
</script>

<div
	tabindex="0"
	role="button"
	class={`inline-block cursor-pointer ${color} wrap-break-word break-all ${isMouseOver ? 'scale-[97%] transition-all duration-200' : ''}`}
	onkeydown={() => {}}
	onmouseleave={() => {
		isOpen = false;
		isMouseOver = false;
	}}
	onmouseover={(e) => {
		isMouseOver = true;
	}}
	onfocus={() => {}}
	oncontextmenu={async (e: any) => {
		e.preventDefault();
		navigator.clipboard.writeText(hexStr);

		AddToast({
			Level: ToastLevel.Info,
			Message: ['Parameter was copied to clipboard!']
		});
	}}
	onclick={async (e) => {
		isOpen = true;

		await sleep(10); //this sleep will allow the floating elem to be mounted when isOpen changes. Required for animation to trigger

		const res = await computePosition(
			e.target as ReferenceElement,
			floatingElem as FloatingElement,
			{
				middleware: [autoPlacement(), offset(20)]
			}
		);
		floatingStyles = `top: ${res.y}px; left: ${res.x}px;`;
	}}
>
	{hexStr}
</div>

{#if isOpen}
	<div
		transition:fly={{ y: -30, duration: 500 }}
		bind:this={floatingElem}
		class={`bg-base-300 rounded-box fixed left-0 top-0 z-50 w-[500px] break-words p-5 shadow-sm `}
		style={floatingStyles}
	>
		{@html description}
	</div>
{/if}
