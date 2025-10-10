<!-- <script lang="ts">
	import BoyImg from '$lib/images/feedback_left_boy.png';
	import GirlImg from '$lib/images/feedback_right_girl.png';
	import FeedbackSent from '$lib/images/feedback_sent.svg';
	import FeedbackError from '$lib/images/feedback_error.svg';
	import JSZip from 'jszip';
	import { firebaseFileStorage, firebaseStore } from '../../hooks.client';
	import { addDoc, collection } from 'firebase/firestore';
	import { ref, uploadBytes } from 'firebase/storage';
	import { Modal, SetModalComponent, SetModalContent } from '$lib/components/modal/modal.svelte';
	import GenericModal from '$lib/components/modal/generic-modal.svelte';

	const ratio = 1.382;
	const maxCharactersFeedbackInput = 10000; //do not allow the feedback to get higher than 10k chars
	
	let innerWidth = $state(0);
	let attachmentInputElem: HTMLInputElement | null = $state(null);
	let waitingFeedbackReply = $state(false);
	let feebackTextInputLeft = $state(maxCharactersFeedbackInput);
	let feebackTextInput = $state('');

	async function sendFeedback(e: any) {
		e.preventDefault();
		if (attachmentInputElem == null) return;

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
				Image: FeedbackError
			});
			SetModalComponent(GenericModal);
			Modal.Dialog?.showModal();

			console.log(err);
		}

		e.target.reset();
		feebackTextInput = '';
		waitingFeedbackReply = false;
	}
</script>

<svelte:window bind:innerWidth />

<div class="flex h-screen w-full flex-col items-center justify-center">
	<h1>Feedback page</h1>
	<a class="btn btn-primary" href="/docs/1002">Docs</a>
</div>

<div class="flex h-screen flex-col items-center justify-start">
	{#if innerWidth > 768}
		<div class="fixed bottom-[20px] -z-10 hidden md:flex">
			<img
				class={`h-auto w-[50%] max-w-[712px]`}
				width={0}
				height={0}
				src={BoyImg}
				alt="boy illustration"
			/>
			<img
				class="h-auto w-[50%] max-w-[712px]"
				width={0}
				height={0}
				src={GirlImg}
				alt="girl illustration"
			/>
		</div>
	{/if}

	<div class=" mt-10 w-full text-center">
		<p class="feedbackTextColor text-center text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl">
			We care.
		</p>
		<p class="feedbackTextColor text-center text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl">
			That&apos;s why we need your feedback.
		</p>
	</div>

	<form onsubmit={sendFeedback} class="mx-10 mt-10 flex flex-col">
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
			value={feebackTextInput}
			maxlength={maxCharactersFeedbackInput}
			onchange={(event) => {
				const textareaElem = event.target as HTMLTextAreaElement;

				//assure the length cannot get larger than max
				const inputWritten = textareaElem.value.slice(0, maxCharactersFeedbackInput);

				feebackTextInput = inputWritten;
				feebackTextInputLeft = maxCharactersFeedbackInput - inputWritten.length;
			}}
		></textarea>
		<span class="mt-1 text-right text-xs">
			Characters left {feebackTextInputLeft}/
			{maxCharactersFeedbackInput}
		</span>
		<label class="mt-3 w-full max-w-sm cursor-pointer text-justify text-xs 2xl:text-lg">
			Images or documents help us diagnose issues faster, attach anything that can give us more
			insight.
			<input
				bind:this={attachmentInputElem}
				multiple
				class="border-neutral file:btn file:btn-sm block w-full max-w-sm cursor-pointer rounded-lg border text-sm file:mr-5 file:rounded-none file:border-0"
				type="file"
				accept=".doc,.docx,.zip,.7z,.pdf,image/*"
				name="attachment"
				id="attachment"
			/>
		</label>
		<button
			type="submit"
			class={`btn btn-primary btn-md mx-auto mt-5 max-w-[220px] ${
				waitingFeedbackReply ? 'loading' : ''
			}`}
			disabled={waitingFeedbackReply}
		>
			{#if waitingFeedbackReply}
				<span>Sending feedback</span>
			{:else}
				<span>Send feedback</span>
			{/if}
		</button>
	</form>
</div> -->
