<script lang="ts">
	import '../global-styles.css';
	import ThemeSelector from '$lib/components/theme-selector.svelte';
	import { dev } from '$app/environment';
	import {
		DetectedDevices,
		SelectedAxis,
		SelectedUniqueID,
		ShowLogTimestamp
	} from '$lib/stores/global';
	import { GetCookie, SupportedCookies } from '$lib/client-server-lib/cookies';
	import { onMount } from 'svelte';
	import { Modal } from '$lib/components/modal/modal.svelte';
	import { HandleOutputMap, M3 } from '$lib/components/commands/commands';
	import Toast from '$lib/components/toast/toast.svelte';

	let { children, data } = $props();

	let innerWidth = $state(0);

	onMount(() => {
		function HandleDetectDevicesResponse(uniqueId: string, alias: string) {
			$DetectedDevices = [{ UniqueID: uniqueId, Alias: parseInt(alias, 16) }];
		}
		HandleOutputMap.set(20, HandleDetectDevicesResponse);

		const showTimestampStr = GetCookie(SupportedCookies.ShowLogTimestamp);
		if (showTimestampStr != null) {
			const showTimestamp = showTimestampStr.toLowerCase() === 'true';
			$ShowLogTimestamp = showTimestamp;
		}

		// Enable shortcuts
		const onKeyDown = (e: KeyboardEvent) => {
			/**System Reset shortcut */
			if (e.key == 'r' && e.ctrlKey) {
				e.preventDefault();
				M3.SystemReset($SelectedAxis, $SelectedUniqueID);
			} else if (e.key == 'R' && e.ctrlKey) {
				e.preventDefault();
				M3.SystemReset('255', $SelectedUniqueID);
			} else if (e.key == 'e' && e.ctrlKey) {
				e.preventDefault();
				M3.EnableMosfets($SelectedAxis, $SelectedUniqueID);
			} else if (e.key == 'E' && e.ctrlKey) {
				e.preventDefault();
				M3.EnableMosfets('255', $SelectedUniqueID);
			} else if (e.key == 'd' && e.ctrlKey) {
				e.preventDefault();
				M3.DisableMosfets($SelectedAxis, $SelectedUniqueID);
			} else if (e.key == 'D' && e.ctrlKey) {
				e.preventDefault();
				M3.DisableMosfets('255', $SelectedUniqueID);
			}
		};

		document.addEventListener('keydown', onKeyDown);

		return () => {
			document.removeEventListener('keydown', onKeyDown);
		};
	});
</script>

<svelte:window bind:innerWidth />
<svelte:head>
	<title>Gearotons</title>
	<meta name="description" content="Gearotons servo motors" />
</svelte:head>

<dialog class="modal m-0 p-0" bind:this={Modal.Dialog}>
	<div class="modal-box min-w-8/12">
		<Modal.Component />
		<div class="modal-action">
			<form method="dialog">
				<!-- if there is a button in form, it will close the modal -->
				<button
					class="btn btn-circle absolute right-2 top-2"
					onclick={() => {
						Modal.Dialog?.showModal();
					}}>✕</button
				>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<Toast />

<div class="text-base-content/85 tracking-wide">
	{@render children()}
</div>

<ThemeSelector />

{#if dev}
	<div
		class="bg-base-300 fixed bottom-[50px] z-50 flex h-[50px] w-[100px] flex-col items-center justify-center rounded-2xl"
	>
		<p>{innerWidth} px</p>
		{#if innerWidth > 1536}
			<p>2xl</p>
		{:else if innerWidth > 1280}
			<p>xl</p>
		{:else if innerWidth > 1024}
			<p>lg</p>
		{:else if innerWidth > 768}
			<p>md</p>
		{:else if innerWidth > 640}
			<p>sm</p>
		{:else}
			<p>xs</p>
		{/if}
	</div>
{/if}
