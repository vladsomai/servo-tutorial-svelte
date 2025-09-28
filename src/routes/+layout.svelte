<script lang="ts">
	import '../global-styles.css';
	import ThemeSelector from '$lib/components/theme-selector.svelte';
	import { dev } from '$app/environment';
	import { SelectedAxis, ShowLogTimestamp } from '$lib/stores/global';
	import { GetCookie, SupportedCookies, UpdateCookie } from '$lib/client-server-lib/cookies';
	import { onMount } from 'svelte';
	import { SupportedThemes } from '$lib/client-server-lib/utils';
	import { Modal } from '$lib/components/modal/modal.svelte';
	import { M3 } from '$lib/components/commands/commands';
	let { children, data } = $props();
	let innerWidth = $state(0);

	onMount(() => {
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
				M3.SystemReset($SelectedAxis);
			} else if (e.key == 'R' && e.ctrlKey) {
				e.preventDefault();
				M3.SystemReset('255');
			} else if (e.key == 'e' && e.ctrlKey) {
				e.preventDefault();
				M3.EnableMosfets($SelectedAxis);
			} else if (e.key == 'E' && e.ctrlKey) {
				e.preventDefault();
				M3.EnableMosfets('255');
			} else if (e.key == 'd' && e.ctrlKey) {
				e.preventDefault();
				M3.DisableMosfets($SelectedAxis);
			} else if (e.key == 'D' && e.ctrlKey) {
				e.preventDefault();
				M3.DisableMosfets('255');
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

	<!-- Prevents FOUC by setting the theme on initial page load -->
	<script>
		(function () {
			const allCookies = document.cookie.split(';');

			let cookieValue = '';
			const foundCookie = allCookies.find((cookie) => {
				const [key, value] = cookie.split('=');

				if (key.trim() == 'Theme') {
					cookieValue = value;
					return true;
				}
			});

			if (foundCookie == null) {
				return '';
			}

			const rootElem = document.getElementById('root-html');
			if (rootElem == null) {
				return;
			}
			rootElem.setAttribute('data-theme', cookieValue);
		})();
	</script>
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

<div class="text-base-content/70 tracking-wide">
	{@render children()}
</div>

<div class="fixed bottom-[50px] right-[50px]">
	<ThemeSelector IncomingTheme={data.Theme} />
</div>
{#if dev}
	<div
		class="bg-base-300 fixed bottom-[50px] z-[2000] flex h-[50px] w-[100px] flex-col items-center justify-center rounded-2xl"
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
