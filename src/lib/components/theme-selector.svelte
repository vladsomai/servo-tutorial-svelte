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

<div class="fab">
	<!-- a focusable div with tabindex is necessary to work on all browsers. role="button" is necessary for accessibility -->
	<div tabindex="0" role="button" class="btn btn-lg btn-circle btn-ghost">
		<img src={ThemeIcon} class="" alt="Pick a theme" width="40px" height="40px" />
	</div>

	<!-- Main Action button replaces the original button when FAB is open -->
	<div class="fab-main-action">
		Choose a theme <button class="btn btn-circle btn-secondary btn-lg"><img src={ThemeIcon} class="rotate-90" alt="Pick a theme" width="40px" height="40px" /></button>
	</div>

	{#each SupportedThemes as theme}
		<div>
			<button
				class="btn w-[150px]"
				onclick={() => {
					handleThemeChange(theme);
				}}
			>
				{theme.charAt(0).toUpperCase() + theme.slice(1)}
			</button>
		</div>
	{/each}
</div>
