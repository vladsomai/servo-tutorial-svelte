<script lang="ts">
	import { SupportedCookies, UpdateCookie } from '$lib/client-server-lib/cookies';
	import { SupportedThemes } from '$lib/client-server-lib/utils';
	import { GlobalTheme } from '$lib/stores/global';

	const themeAttribute = 'data-theme';

	let { IncomingTheme } = $props();
	let theme = $state(IncomingTheme);

	$effect(() => {
		updateTheme(theme);
	});

	function updateTheme(newTheme: string) {
		const rootElem = document.getElementById('root-html');
		if (rootElem == null) {
			return;
		}
		$GlobalTheme = newTheme;
		rootElem.setAttribute(themeAttribute, newTheme);
		UpdateCookie(SupportedCookies.Theme, newTheme);
	}
</script>

<select class="select select-primary rounded-full w-[120px]" bind:value={theme}>
	{#each SupportedThemes as theme}
		<option>{theme}</option>
	{/each}
</select>
