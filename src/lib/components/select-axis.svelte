<script lang="ts">
	import { SelectedAxis } from '$lib/stores/global';
	import LabeledInput from './labeled-input.svelte';
</script>

<LabeledInput
	Class="mt-2"
	TooltipText={''}
	Label={'Alias'}
	bind:InputValue={$SelectedAxis}
	Type="string"
/>
