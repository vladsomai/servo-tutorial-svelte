<script lang="ts">
	import { SelectedAxis, SelectedUniqueID } from '$lib/stores/global';
	import { fly } from 'svelte/transition';
	import LabeledInput from './labeled-input.svelte';

	let inputs = [
		{ label: 'Alias', bindable: $SelectedAxis },
		{ label: 'UniqueID', bindable: $SelectedUniqueID }
	];
</script>

<div class="flex flex-col lg:flex-row">
	<LabeledInput
		Class="mt-2"
		TooltipText={''}
		Label={'Alias'}
		bind:InputValue={$SelectedAxis}
		Type="string"
	/>

	{#if $SelectedAxis == '254'}
		<div transition:fly={{ duration: 1000, y: -30 }}>
			<LabeledInput
				Class="mt-2 lg:ml-2"
				TooltipText={''}
				Label={'UniqueID'}
				bind:InputValue={$SelectedUniqueID}
				Type="string"
			/>
		</div>
	{/if}
</div>
