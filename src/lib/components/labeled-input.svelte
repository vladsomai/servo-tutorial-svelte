<script lang="ts">
	let {
		TooltipText,
		Label,
		InputValue = $bindable(),
		Class = ''
	}: { TooltipText: string; Label: string; InputValue: number | string; Class: string } = $props();
</script>

<div class="tooltip">
	{#if TooltipText.length > 0}
		<div class="tooltip-content w-[200px]">
			<div class="font-black">{TooltipText}</div>
		</div>
	{/if}
	<label class={`input input-sm w-[200px] ${Class}`}>
		<span class="label w-[100px]">{Label} </span>
		<input bind:value={InputValue} placeholder="" class="w-[50px]" />
	</label>
</div>
