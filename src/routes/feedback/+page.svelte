<script lang="ts">
	import BoyImg from '$lib/images/feedback_left_boy.webp';
	import GirlImg from '$lib/images/feedback_right_girl.webp';
	import FeedbackSent from '$lib/images/feedback_sent.svg';
	import ErrorImg from '$lib/images/error.svg';
	import JSZip from 'jszip';
	import { type Firestore } from 'firebase/firestore';
	import { type FirebaseStorage } from 'firebase/storage';
	import { firebaseApp } from '../../hooks.client';
	import { addDoc, collection } from 'firebase/firestore';
	import { ref, uploadBytes } from 'firebase/storage';
	import { Modal, SetModalComponent, SetModalContent } from '$lib/components/modal/modal.svelte';
	import GenericModal from '$lib/components/modal/generic-modal.svelte';
	import { onMount } from 'svelte';
	import { AddToast } from '$lib/components/toast/toast-state.svelte';
	import { ToastLevel } from '$lib/client-server-lib/types';

	let firebaseStore: Firestore | null = null;
	let firebaseFileStorage: FirebaseStorage | null = null;

	const maxCharactersFeedbackInput = 3000;

	let innerWidth = $state(0);
	let attachmentInputElem: HTMLInputElement | null = $state(null);
	let waitingFeedbackReply = $state(false);
	let feedbackTextInputLeft = $state(maxCharactersFeedbackInput);
	let feedbackTextInput = $state('');

	onMount(() => {
		async function loadFirebaseDeps() {
			const { getFirestore } = await import('firebase/firestore');
			firebaseStore = getFirestore(firebaseApp);

			const { getStorage } = await import('firebase/storage');
			firebaseFileStorage = getStorage(firebaseApp);

			console.log('Firebase loaded');
		}

		loadFirebaseDeps();
	});

	async function sendFeedback(e: any) {
		e.preventDefault();
		if (attachmentInputElem == null || firebaseStore == null || firebaseFileStorage == null) {
			AddToast({
				Level: ToastLevel.Error,
				Message: ['An error occurred, please contact us via email!']
			});
			return;
		}

		waitingFeedbackReply = true;

		const attachedFiles = attachmentInputElem.files;

		const email = e.target['email'].value;
		const message = e.target['message'].value;

		const currentDate = new Date();
		try {
			//send email and message
			const docRef = await addDoc(collection(firebaseStore, 'feedbacks'), {
				email: email,
				message: message,
				date: currentDate
			});

			//send attachments if any
			if (attachedFiles != null && attachedFiles.length != 0) {
				const zip = new JSZip(); //create new zip object

				for (let i = 0; i < attachedFiles.length; i++) {
					//add each attachment bytes to a zip
					zip.file(attachedFiles[i].name, attachedFiles[i]);
				}

				const zipBlob = await zip.generateAsync({ type: 'blob' });
				const storageRef = ref(firebaseFileStorage, docRef.id + '.zip');
				await uploadBytes(storageRef, zipBlob);
			}

			SetModalContent({
				Description: [
					'Thank you!',
					`We constantly work on improving our service. In case your feedback refers to an issue, we will	do our best to solve it as soon as possible.`
				],
				Title: 'Feedback sent successfully!',
				Image: FeedbackSent
			});
			SetModalComponent(GenericModal);
			Modal.Dialog?.showModal();
		} catch (err) {
			SetModalContent({
				Description: [
					'Something went wrong!',
					'It seems our servers are currently down. We work on solving it.'
				],
				Title: 'Feedback could not be sent!',
				Image: ErrorImg
			});
			SetModalComponent(GenericModal);
			Modal.Dialog?.showModal();

			console.log(err);
		}

		e.target.reset();
		feedbackTextInput = '';
		waitingFeedbackReply = false;
	}
</script>

<svelte:window bind:innerWidth />

<div class="flex h-screen flex-col items-center justify-start">
	<div class="fixed bottom-[20px] -z-10 flex">
		<img
			class={`h-auto w-[50%] max-w-[500px]`}
			width={0}
			height={0}
			src={BoyImg}
			alt="boy illustration"
			loading="eager"
			fetchpriority="high"
		/>
		<img
			class="h-auto w-[50%] max-w-[500px]"
			width={0}
			height={0}
			src={GirlImg}
			alt="girl illustration"
			loading="eager"
			fetchpriority="high"
		/>
	</div>
	<a class="link mt-5" href="/docs/1002">Go to docs</a>

	<div class=" mt-5 w-full text-center">
		<p
			class="feedbackTextColor to-primary/30 from-primary/100 bg-gradient-to-r bg-clip-text text-center text-4xl text-transparent md:text-5xl lg:text-6xl 2xl:text-7xl"
		>
			We care.
		</p>
		<p class="feedbackTextColor text-center text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl">
			That's why we need your feedback.
		</p>
	</div>

	<form onsubmit={sendFeedback} class="mx-10 mt-3 flex flex-col">
		<input
			required
			name="email"
			class="input input-sm 2xl:input-lg input-bordered mt-5 w-full max-w-sm"
			placeholder="Your email"
			type="email"
			autocomplete="email"
		/>
		<textarea
			required
			name="message"
			placeholder="What should we change?"
			class="textarea textarea-bordered textarea-xs 2xl:textarea-lg mt-5 h-[80px] w-full max-w-sm resize-none md:h-[120px]"
			maxlength={maxCharactersFeedbackInput}
			oninput={(event) => {
				const textareaElem = event.target as HTMLTextAreaElement;

				//assure the length cannot get larger than max
				const inputWritten = textareaElem.value.slice(0, maxCharactersFeedbackInput);

				feedbackTextInputLeft = maxCharactersFeedbackInput - inputWritten.length;
			}}
		></textarea>
		<span class="mt-1 text-right text-xs">
			Characters left {feedbackTextInputLeft}/
			{maxCharactersFeedbackInput}
		</span>
		<label class="mt-10 w-full max-w-sm cursor-pointer text-justify text-xs 2xl:text-lg">
			Images or documents help us diagnose issues faster, attach anything that can give us more
			insight.
			<input
				bind:this={attachmentInputElem}
				multiple
				class="border-neutral file-input input-sm mt-2 w-full"
				type="file"
				accept=".doc,.docx,.zip,.7z,.pdf,image/*"
				name="attachment"
			/>
		</label>
		<button
			class={`btn btn-primary btn-md mx-auto mt-5 max-w-[220px]`}
			disabled={waitingFeedbackReply}
		>
			{#if waitingFeedbackReply}
				<span class="loading loading-dots"></span>
				<span>Sending feedback</span>
			{:else}
				<span>Send feedback</span>
			{/if}
		</button>
	</form>
</div>

<style>
	/* .feedbackTextColor {
		font-weight: bold;
		background: -webkit-linear-gradient(360deg, #74bf44, rgba(116, 191, 68, 0.6));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	} */
</style>
