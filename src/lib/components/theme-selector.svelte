<script lang="ts">
	import { SupportedCookies, UpdateCookie } from '$lib/client-server-lib/cookies';
	import { SupportedThemes } from '$lib/client-server-lib/utils';
	import { GlobalTheme } from '$lib/stores/global';
	import ThemeIcon from '$lib/images/icons/theme-picker.svg';

	const themeAttribute = 'data-theme';
	let isOpen = $state(false);

	let { IncomingTheme } = $props();
	let theme = $state(IncomingTheme);

	function handleThemeChange(newTheme: string) {
		const rootElem = document.getElementById('root-html');
		if (rootElem == null) {
			return;
		}
		$GlobalTheme = newTheme;
		rootElem.setAttribute(themeAttribute, newTheme);
		UpdateCookie(SupportedCookies.Theme, newTheme);
	}
</script>

<details
	class="dropdown dropdown-top"
	onmouseleave={() => {
		isOpen = false;
	}}
	bind:open={isOpen}
>
	<summary class="btn btn-lg m-1 rounded-full p-0"
		><img src={ThemeIcon} class="m-2" alt="Pick a theme" width="40px" height="40px" /></summary
	>
	<ul class="menu dropdown-content bg-base-100 rounded-box z-1 p-2 shadow-sm">
		{#each SupportedThemes as theme}
			<li>
				<button
					class=""
					onclick={() => {
						handleThemeChange(theme);
					}}
				>
					{theme}
				</button>
			</li>
		{/each}
	</ul>
</details>
