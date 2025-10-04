<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	let {
		TooltipText = '',
		Label,
		InputValue = $bindable(),
		Class = '',
		Type = 'number'
	}: {
		TooltipText?: string;
		Label: string;
		InputValue: number | string;
		Class?: string;
		Type?: string;
	} = $props();
</script>

<div class={`${TooltipText.length > 0 ? 'tooltip' : ''}`}>
	{#if TooltipText.length > 0}
		<div class="tooltip-content w-[200px]">
			<div class="font-black">{TooltipText}</div>
		</div>
	{/if}
	<label class={`input input-sm w-[200px] ${Class}`}>
		<span class="label w-[100px]">{Label} </span>
		<input bind:value={InputValue} type={Type} placeholder="" class="w-[50px]" />
	</label>
</div>

<style>
	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
