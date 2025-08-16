<script lang="ts">
	import '../global-styles.css';
	import ThemeSelector from '$lib/components/theme-selector.svelte';
	import { dev } from '$app/environment';
	let { children, data } = $props();
	let innerWidth = $state(0);
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
		class="fixed bottom-[50px] z-[2000] flex h-[50px] w-[100px] flex-col items-center justify-center rounded-2xl bg-red-400"
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
