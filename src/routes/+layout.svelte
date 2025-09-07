<script lang="ts">
	import '../global-styles.css';
	import ThemeSelector from '$lib/components/theme-selector.svelte';
	import { dev } from '$app/environment';
	import { ShowLogTimestamp } from '$lib/stores/global';
	import { GetCookie, SupportedCookies, UpdateCookie } from '$lib/client-server-lib/cookies';
	import { onMount } from 'svelte';
	let { children, data } = $props();
	let innerWidth = $state(0);

	onMount(() => {
		const showTimestampStr = GetCookie(SupportedCookies.ShowLogTimestamp);
		if (showTimestampStr != null) {
			const showTimestamp = showTimestampStr.toLowerCase() === 'true';
			$ShowLogTimestamp = showTimestamp;
		}
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

{@render children()}

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
