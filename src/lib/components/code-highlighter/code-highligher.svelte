<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import { onMount } from 'svelte';
	import { SelectedAxis } from '$lib/stores/global';
	import {
		CodeHighlightObject,
		SetCodeHighlighter,
		SetCodeHighlightLang
	} from './code-highlighter-state.svelte';
	import { GlobalTheme } from '$lib/stores/global';
	import {
		ConvertAxisToNum,
		SupportedLanguages,
		type SupportedCodeLangsStr
	} from '$lib/client-server-lib/utils';
	import { GenericCodeExample } from '$lib/client-server-lib/code-samples-utils/code-utils';
	let { currentCommand }: { currentCommand: MotorCommandType } = $props();
	let codeHtmlText = $state('');
	let codeText = $state('');
	let lang = $state(CodeHighlightObject.Lang);

	let loadingHighlighter = $state(true);
	let loadingStarted = false;

	onMount(() => {
		async function loadHighlighter() {
			try {
				if (CodeHighlightObject.Highlighter == null) {
					if (loadingStarted) {
						// Protect from calling create twice
						return;
					}

					loadingStarted = true;

					console.log('Loading Highlighter');

					//lazy load the highligher
					const { createHighlighter } = await import('shiki');
					const highlighter = await createHighlighter({
						themes: ['github-dark-dimmed', 'github-light', 'tokyo-night', 'material-theme-ocean'],
						langs: ['html', 'c', 'python']
					});

					SetCodeHighlighter(highlighter);
				}
			} finally {
				loadingHighlighter = false;
			}
		}

		loadHighlighter();
	});

	$effect(() => {
		$GlobalTheme;
		CodeHighlightObject.CodeText;
		CodeHighlightObject.Lang;
		CodeHighlightObject.Highlighter;
		currentCommand;
		$SelectedAxis;

		async function updateCode() {
			if (CodeHighlightObject.Highlighter == null) {
				return;
			}

			let axis = '00';
			if ($SelectedAxis.length != 0) {
				axis = $SelectedAxis;
			}
			const modfiedCode = await GenericCodeExample.GetNewCode(
				ConvertAxisToNum(axis),
				currentCommand.CommandEnum,
				CodeHighlightObject.Lang
			);

			codeText = modfiedCode;
			codeHtmlText = CodeHighlightObject.Highlighter.codeToHtml(modfiedCode, {
				lang: CodeHighlightObject.Lang,
				theme: $GlobalTheme.CodeTheme
			});
		}

		updateCode();
	});

	function handleCopy(e: Event) {
		const inpElem = e.target as HTMLInputElement;

		if (!inpElem.checked) {
			return;
		}

		navigator.clipboard.writeText(codeText);

		setTimeout(() => {
			inpElem.checked = false;
		}, 1000);
	}
</script>

<div class="border-base-200 relative m-2 h-full rounded-2xl border-[1px]">
	<div class="bg-base-200 flex w-full flex-col items-center justify-center rounded-t-2xl pt-3">
		<p>Code examples</p>

		<div class="mt-3 flex w-full items-end justify-around">
			<select
				bind:value={lang}
				aria-label="select code example language"
				aria-labelledby="select code example language"
				class="select select-neutral rounded-b-none rounded-t-2xl border-0"
				onchange={(e: Event) => {
					const elem = e.target as HTMLSelectElement;
					SetCodeHighlightLang(elem.value as SupportedCodeLangsStr);
				}}
			>
				{#each SupportedLanguages as lang}
					<option value={lang.Language}>
						{lang.Description}
					</option>
				{/each}
			</select>
		</div>
	</div>

	<div class="absolute right-[10px] top-[100px]">{@render CopyToClipboard()}</div>
	{#if loadingHighlighter}
		<div class="skeleton h-full w-full"></div>
	{:else}
		{@html codeHtmlText}
	{/if}
</div>

{#snippet CopyToClipboard()}
	<label
		class="btn btn-ghost btn-circle swap swap-rotate"
		title="copy to clipboard"
		aria-label="copy to clipboard"
		aria-labelledby="copy to clipboard"
	>
		<!-- this hidden checkbox controls the state -->
		<input type="checkbox" onclick={handleCopy} />

		<svg
			class="swap-off fill-gray-400"
			width="32"
			height="32"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z"
				stroke="#292D32"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M22 6.9V11.1C22 14.6 20.6 16 17.1 16H16V12.9C16 9.4 14.6 8 11.1 8H8V6.9C8 3.4 9.4 2 12.9 2H17.1C20.6 2 22 3.4 22 6.9Z"
				stroke="#292D32"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>

		<svg
			class="swap-on fill-gray-400"
			width="32"
			height="32"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M22 11.1V6.9C22 3.4 20.6 2 17.1 2H12.9C9.4 2 8 3.4 8 6.9V8H11.1C14.6 8 16 9.4 16 12.9V16H17.1C20.6 16 22 14.6 22 11.1Z"
				stroke="#292D32"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M16 17.1V12.9C16 9.4 14.6 8 11.1 8H6.9C3.4 8 2 9.4 2 12.9V17.1C2 20.6 3.4 22 6.9 22H11.1C14.6 22 16 20.6 16 17.1Z"
				stroke="#292D32"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M6.08008 15L8.03008 16.95L11.9201 13.05"
				stroke="#292D32"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</label>
{/snippet}
