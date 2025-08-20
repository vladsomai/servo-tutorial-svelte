<script lang="ts">
	import { SupportedCookies, UpdateCookie } from '$lib/client-server-lib/cookies';
	import { SupportedThemes } from '$lib/client-server-lib/utils';
	import { GlobalTheme } from '$lib/stores/global';
	import ThemeIcon from '$lib/images/icons/theme-icon.svg';

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

<select class="select select-primary w-[120px] rounded-full" bind:value={theme}>
	{#each SupportedThemes as theme}
		<option value={theme}>{theme}</option>
	{/each}
</select>
