<script lang="ts">
	let {
		TooltipText,
		Label,
		SelectValue = $bindable(),
		Class = '',
		Options
	}: {
		TooltipText: string;
		Label: string;
		SelectValue: string;
		Class: string;
		Options: string[];
	} = $props();
</script>

<div class={`${TooltipText.length > 0 ? 'tooltip' : ''}`}>
	{#if TooltipText.length > 0}
		<div class="tooltip-content w-[200px]">
			<div class="font-black">{TooltipText}</div>
		</div>
	{/if}
	<label class={`select select-sm w-[200px] ${Class}`}>
		<span class="label w-[100px]">{Label} </span>
		<select class="" bind:value={SelectValue}>
			{#each Options as opt}
				<option>{opt}</option>
			{/each}
		</select>
	</label>
</div>
