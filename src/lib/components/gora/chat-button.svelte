<script lang="ts">
	import { fly } from 'svelte/transition';
	import UserIcon from '$lib/images/icons/user.svg';
	import { AddToast } from '../toast/toast-state.svelte';
	import {
		ToastLevel,
		type ConversationRoleType,
		type ConversationType
	} from '$lib/client-server-lib/types';
	import { cubicIn } from 'svelte/easing';
	import { ClientGoraApi } from '$lib/client-server-lib/api/gora/Gora';
	import { flip } from 'svelte/animate';

	const maxCharactersInput = 1000;
	let charsLeft = $state(maxCharactersInput);

	let showChat = $state(false);
	let waitingForGora = $state(false);
	let chatDiv: HTMLDivElement | null = $state(null);

	interface ChatCorespondent {
		avatar: string;
		message: string;
		role: ConversationRoleType;
		timestamp: string;
	}

	let chatMessages: ChatCorespondent[] = $state([]);

	$effect(() => {
		chatMessages;

		if (chatDiv == null) {
			return;
		}

		chatDiv.scrollTo({ top: chatDiv.scrollHeight, behavior: 'instant' });
	});

	async function askGora(e: any) {
		try {
			waitingForGora = true;
			if (e.target == null || e == null) {
				throw 'An error occurred';
			}

			e.preventDefault();

			const message = e.target['gorainput'].value.trim() as string;

			if (message.length == 0) {
				throw 'Please enter some text!';
			}

			e.target['gorainput'].value = '';
			charsLeft = maxCharactersInput

			const outgoingTime = new Date();
			let outgoing: ChatCorespondent = {
				avatar: UserIcon,
				message: message,
				role: 'user',
				timestamp: `${outgoingTime.getHours()}:${outgoingTime.getMinutes()}`
			};

			chatMessages = [...chatMessages, outgoing];

			let conversation: ConversationType[] = chatMessages.map((mes) => {
				return { content: mes.message, role: mes.role };
			});

			const clientGoraApi = new ClientGoraApi();
			const reply: ConversationType = await clientGoraApi.AskGora(conversation);

			const incomingTime = new Date();
			let incoming: ChatCorespondent = {
				avatar: '/favicon.ico',
				message: reply.content,
				role: 'assistant',
				timestamp: `${incomingTime.getHours()}:${incomingTime.getMinutes()}`
			};

			chatMessages = [...chatMessages, incoming];
		} catch (err) {
			if (typeof err == 'string') {
				AddToast({ Level: ToastLevel.Error, Message: [err] });
			} else {
				AddToast({ Level: ToastLevel.Error, Message: ['An error occurred.'] });
			}
		} finally {
			waitingForGora = false;
		}
	}
</script>

<div class="">
	<button
		class="btn mb-2 flex items-center justify-center rounded-full"
		onclick={async (e) => {
			showChat = true;
		}}
	>
		Ask Gora

		<svg
			fill="currentColor"
			class="h-[20px] w-[40px]"
			preserveAspectRatio="none"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			viewBox="0 0 114.838 114.838"
			xml:space="preserve"
		>
			<g>
				<path
					d="M114.822,83.667c0.005-0.003,0.011-0.005,0.016-0.008l-0.242-0.438l-0.174-0.469c-2.889,1.074-5.479,1.014-7.918-0.184
		c-7.797-3.829-12.357-18.479-16.769-32.646c-4.267-13.702-8.295-26.646-15.083-28.488c-2.775-0.755-5.739,0.351-9.064,3.382
		c-4.777,4.55-9.23,14.32-13.539,23.769C46.907,59.866,41.59,71.53,36.476,72.012c-3.446,0.344-6.995-4.27-10.74-9.134
		c-6.261-8.13-14.054-18.248-25.66-10.945l0.229,0.365c-0.084,0.058-0.167,0.105-0.251,0.165l0.24,0.339
		c-0.087,0.066-0.173,0.121-0.26,0.189l0.249,0.316c-0.089,0.074-0.178,0.136-0.267,0.213l0.254,0.293
		c-0.09,0.082-0.18,0.15-0.27,0.235l0.686,0.729c2.635-2.484,5.091-3.456,7.498-2.976c6.335,1.265,11.459,12.705,15.979,22.798
		c4.567,10.196,8.524,19.032,13.547,19.032c0.11,0,0.221-0.004,0.333-0.013c7.147-0.553,9.792-10.111,12.855-21.179
		c2.173-7.854,4.636-16.753,9.091-23.108c3.963-5.409,7.5-7.907,10.817-7.629c5.937,0.494,10.636,9.831,15.611,19.717
		c5.268,10.469,10.717,21.292,18.522,23.691c3.108,0.956,6.427,0.473,9.86-1.432c0.002,0,0.004-0.001,0.006-0.002l0,0
		C114.811,83.673,114.817,83.671,114.822,83.667L114.822,83.667z M24.531,69.191c4.388,7.786,8.159,14.507,12.775,14.122
		c6.434-0.546,10.442-11.369,14.686-22.826c3.227-8.712,6.564-17.721,11.146-23.053c3.447-4.012,6.49-5.736,9.291-5.266
		c6.006,1.004,10.359,11.948,14.968,23.534c2.541,6.386,5.128,12.874,8.129,18.122c-2.808-4.604-5.325-10.21-7.8-15.729
		C82.805,47.113,78.154,36.74,71.658,35.95c-3.406-0.418-6.973,1.813-10.88,6.815c-4.667,5.972-7.538,14.824-10.313,23.385
		c-3.473,10.709-6.752,20.825-12.871,21.32c-4.2,0.358-8.168-7.59-12.355-15.985c-1.759-3.528-3.542-7.097-5.426-10.274
		C21.469,63.768,23.034,66.537,24.531,69.191z M18.281,57.277c2.314,2.75,4.445,6.018,6.449,9.103
		c4.243,6.528,7.916,12.162,12.208,11.781c6.056-0.541,10.657-11.662,15.528-23.435c3.739-9.035,7.604-18.378,12.241-23.236
		c3.227-3.38,6.053-4.754,8.648-4.196c6.096,1.309,10.256,13.104,14.66,25.591c2.211,6.268,4.457,12.633,7.051,18.011
		c-2.417-4.699-4.596-10.17-6.74-15.563c-4.715-11.855-9.169-23.053-15.73-24.15c-3.176-0.529-6.521,1.3-10.217,5.601
		c-4.699,5.467-8.067,14.562-11.325,23.357c-4.13,11.15-8.032,21.685-13.833,22.177c-3.943,0.333-7.774-6.441-11.819-13.616
		C23.207,64.808,20.868,60.667,18.281,57.277z M24.944,63.489c4.088,5.309,7.611,9.898,11.626,9.52
		c5.69-0.536,10.887-11.937,16.389-24.006c4.268-9.362,8.681-19.042,13.31-23.452c3.044-2.775,5.701-3.804,8.121-3.149
		c6.258,1.698,10.207,14.387,14.391,27.822c2.001,6.428,4.034,12.95,6.4,18.56c-2.241-4.952-4.246-10.63-6.223-16.231
		c-4.501-12.759-8.752-24.81-15.395-26.236c-2.961-0.635-6.096,0.831-9.581,4.484c-4.767,4.993-8.668,14.424-12.441,23.544
		c-4.752,11.484-9.241,22.333-14.693,22.819c-3.694,0.341-7.383-5.333-11.281-11.331c-2.567-3.948-5.333-8.194-8.471-11.336
		C19.945,57.002,22.508,60.325,24.944,63.489z M70.889,40.706c-3.684-0.308-7.521,2.321-11.713,8.043
		c-4.56,6.504-7.046,15.493-9.242,23.424c-2.962,10.705-5.521,19.95-11.968,20.448c-4.478,0.347-8.564-8.773-12.89-18.432
		c-1.322-2.952-2.657-5.93-4.038-8.73c1.141,2.136,2.241,4.336,3.305,6.472c4.421,8.864,8.252,16.551,12.978,16.55
		c0.117,0,0.235-0.005,0.354-0.015c6.783-0.549,10.008-10.493,13.741-22.009c2.749-8.478,5.592-17.245,10.15-23.077
		c3.674-4.702,6.941-6.806,9.972-6.438c5.935,0.722,10.474,10.844,15.277,21.561c2.743,6.119,5.538,12.334,8.753,17.243
		c-2.96-4.259-5.633-9.56-8.258-14.775C82.205,50.827,77.383,41.246,70.889,40.706z"
				/>
			</g>
		</svg>
	</button>
</div>

{#if showChat}
	<div
		class="bg-base-300 fixed left-0 top-0 z-[100] m-5 flex min-h-[70vh] w-full max-w-[90vw] flex-col justify-end rounded-2xl p-3 shadow-2xl lg:w-[600px]"
		transition:fly={{ duration: 300, x: -10, easing: cubicIn }}
	>
		<div class="absolute right-0 top-0 z-10">
			<button
				class="btn btn-ghost rounded-full"
				onclick={() => {
					showChat = false;
				}}
			>
				✕
			</button>
		</div>
		{#if !chatMessages.length}
			<div class="mb-10 flex w-full flex-col items-center justify-center">
				<p class=" text-2xl">
					Hello, <span
						class="to-primary/50 from-primary/100 bg-gradient-to-r bg-clip-text text-transparent"
						>I am Gora.
					</span><br />What can I help you with today?
				</p>
				<svg
					fill="currentColor"
					class="max-h-[150px] w-full"
					preserveAspectRatio="none"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					viewBox="0 0 114.838 114.838"
					xml:space="preserve"
				>
					<g>
						<path
							d="M114.822,83.667c0.005-0.003,0.011-0.005,0.016-0.008l-0.242-0.438l-0.174-0.469c-2.889,1.074-5.479,1.014-7.918-0.184
		c-7.797-3.829-12.357-18.479-16.769-32.646c-4.267-13.702-8.295-26.646-15.083-28.488c-2.775-0.755-5.739,0.351-9.064,3.382
		c-4.777,4.55-9.23,14.32-13.539,23.769C46.907,59.866,41.59,71.53,36.476,72.012c-3.446,0.344-6.995-4.27-10.74-9.134
		c-6.261-8.13-14.054-18.248-25.66-10.945l0.229,0.365c-0.084,0.058-0.167,0.105-0.251,0.165l0.24,0.339
		c-0.087,0.066-0.173,0.121-0.26,0.189l0.249,0.316c-0.089,0.074-0.178,0.136-0.267,0.213l0.254,0.293
		c-0.09,0.082-0.18,0.15-0.27,0.235l0.686,0.729c2.635-2.484,5.091-3.456,7.498-2.976c6.335,1.265,11.459,12.705,15.979,22.798
		c4.567,10.196,8.524,19.032,13.547,19.032c0.11,0,0.221-0.004,0.333-0.013c7.147-0.553,9.792-10.111,12.855-21.179
		c2.173-7.854,4.636-16.753,9.091-23.108c3.963-5.409,7.5-7.907,10.817-7.629c5.937,0.494,10.636,9.831,15.611,19.717
		c5.268,10.469,10.717,21.292,18.522,23.691c3.108,0.956,6.427,0.473,9.86-1.432c0.002,0,0.004-0.001,0.006-0.002l0,0
		C114.811,83.673,114.817,83.671,114.822,83.667L114.822,83.667z M24.531,69.191c4.388,7.786,8.159,14.507,12.775,14.122
		c6.434-0.546,10.442-11.369,14.686-22.826c3.227-8.712,6.564-17.721,11.146-23.053c3.447-4.012,6.49-5.736,9.291-5.266
		c6.006,1.004,10.359,11.948,14.968,23.534c2.541,6.386,5.128,12.874,8.129,18.122c-2.808-4.604-5.325-10.21-7.8-15.729
		C82.805,47.113,78.154,36.74,71.658,35.95c-3.406-0.418-6.973,1.813-10.88,6.815c-4.667,5.972-7.538,14.824-10.313,23.385
		c-3.473,10.709-6.752,20.825-12.871,21.32c-4.2,0.358-8.168-7.59-12.355-15.985c-1.759-3.528-3.542-7.097-5.426-10.274
		C21.469,63.768,23.034,66.537,24.531,69.191z M18.281,57.277c2.314,2.75,4.445,6.018,6.449,9.103
		c4.243,6.528,7.916,12.162,12.208,11.781c6.056-0.541,10.657-11.662,15.528-23.435c3.739-9.035,7.604-18.378,12.241-23.236
		c3.227-3.38,6.053-4.754,8.648-4.196c6.096,1.309,10.256,13.104,14.66,25.591c2.211,6.268,4.457,12.633,7.051,18.011
		c-2.417-4.699-4.596-10.17-6.74-15.563c-4.715-11.855-9.169-23.053-15.73-24.15c-3.176-0.529-6.521,1.3-10.217,5.601
		c-4.699,5.467-8.067,14.562-11.325,23.357c-4.13,11.15-8.032,21.685-13.833,22.177c-3.943,0.333-7.774-6.441-11.819-13.616
		C23.207,64.808,20.868,60.667,18.281,57.277z M24.944,63.489c4.088,5.309,7.611,9.898,11.626,9.52
		c5.69-0.536,10.887-11.937,16.389-24.006c4.268-9.362,8.681-19.042,13.31-23.452c3.044-2.775,5.701-3.804,8.121-3.149
		c6.258,1.698,10.207,14.387,14.391,27.822c2.001,6.428,4.034,12.95,6.4,18.56c-2.241-4.952-4.246-10.63-6.223-16.231
		c-4.501-12.759-8.752-24.81-15.395-26.236c-2.961-0.635-6.096,0.831-9.581,4.484c-4.767,4.993-8.668,14.424-12.441,23.544
		c-4.752,11.484-9.241,22.333-14.693,22.819c-3.694,0.341-7.383-5.333-11.281-11.331c-2.567-3.948-5.333-8.194-8.471-11.336
		C19.945,57.002,22.508,60.325,24.944,63.489z M70.889,40.706c-3.684-0.308-7.521,2.321-11.713,8.043
		c-4.56,6.504-7.046,15.493-9.242,23.424c-2.962,10.705-5.521,19.95-11.968,20.448c-4.478,0.347-8.564-8.773-12.89-18.432
		c-1.322-2.952-2.657-5.93-4.038-8.73c1.141,2.136,2.241,4.336,3.305,6.472c4.421,8.864,8.252,16.551,12.978,16.55
		c0.117,0,0.235-0.005,0.354-0.015c6.783-0.549,10.008-10.493,13.741-22.009c2.749-8.478,5.592-17.245,10.15-23.077
		c3.674-4.702,6.941-6.806,9.972-6.438c5.935,0.722,10.474,10.844,15.277,21.561c2.743,6.119,5.538,12.334,8.753,17.243
		c-2.96-4.259-5.633-9.56-8.258-14.775C82.205,50.827,77.383,41.246,70.889,40.706z"
						/>
					</g>
				</svg>
			</div>
		{/if}

		<div class="max-h-[470px] overflow-auto" bind:this={chatDiv}>
			{#each chatMessages as message (message)}
				<div
					animate:flip={{ duration: 500 }}
					class={`${message.role == 'user' ? 'chat-end' : 'chat-start'} chat`}
				>
					<div class="chat-image avatar">
						<div class="w-10 rounded-full">
							<img alt="avatar" src={message.avatar} />
						</div>
					</div>
					<div class="chat-header">
						{message.role == 'assistant' ? 'Gora' : 'Me'}
						<time class="text-xs opacity-50">{message.timestamp}</time>
					</div>
					<div class="chat-bubble">
						{@html message.message.replaceAll('\n', '<br/>')}
					</div>
				</div>
			{/each}
		</div>

		<form class="textarea mt-5 flex w-full flex-col" onsubmit={askGora}>
			<textarea
				name="gorainput"
				placeholder="Ask anything about our products"
				class="textarea textarea-bordered textarea-lg w-full resize-none"
				maxlength={maxCharactersInput}
				oninput={(event) => {
					const textareaElem = event.target as HTMLTextAreaElement;

					//assure the length cannot get larger than max
					const inputWritten = textareaElem.value.slice(0, maxCharactersInput);

					charsLeft = maxCharactersInput - inputWritten.length;
				}}
			></textarea>
			<div class="divider m-0"></div>
			<div class="flex justify-between">
				<span class="text-base-content/50 mt-1 text-xs">
					Characters left {charsLeft}/
					{maxCharactersInput}
				</span>
				<button class="btn btn-ghost" aria-label="Send" type="submit" disabled={waitingForGora}>
					{#if waitingForGora}
						<div class="loading loading-dots loading-lg"></div>
					{:else}
						<svg width="30px" height="30px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M1.265 4.42619C1.04293 2.87167 2.6169 1.67931 4.05323 2.31397L21.8341 10.1706C23.423 10.8727 23.423 13.1273 21.8341 13.8294L4.05323 21.686C2.6169 22.3207 1.04293 21.1283 1.265 19.5738L1.99102 14.4917C2.06002 14.0087 2.41458 13.6156 2.88791 13.4972L8.87688 12L2.88791 10.5028C2.41458 10.3844 2.06002 9.99129 1.99102 9.50829L1.265 4.42619ZM21.0257 12L3.2449 4.14335L3.89484 8.69294L12.8545 10.9328C13.9654 11.2106 13.9654 12.7894 12.8545 13.0672L3.89484 15.3071L3.2449 19.8566L21.0257 12Z"
								fill="#72BF44"
							/>
						</svg>
					{/if}
				</button>
			</div>
		</form>
	</div>
{/if}
