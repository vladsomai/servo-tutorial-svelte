<script lang="ts">
	import { goto } from '$app/navigation';
	import { UserStateObj } from '$lib/stores/global-state.svelte';
	import { onMount } from 'svelte';
	import { firebaseAuth, firebaseApp } from '../../../hooks.client';
	import { signOut } from 'firebase/auth';
	import { collection, deleteDoc, doc, type Firestore, getDocs } from 'firebase/firestore';
	import { ToastLevel, type FeedbackType } from '$lib/client-server-lib/types';
	import { getDownloadURL, ref, type FirebaseStorage } from 'firebase/storage';
	import { AddToast } from '$lib/components/toast/toast-state.svelte';

	let firebaseStore: Firestore | null = null;
	let firebaseFileStorage: FirebaseStorage | null = null;

	let signingOut = $state(false);
	let timeoutLoadingUser: NodeJS.Timeout | null = null;

	let allFeedbacks: FeedbackType[] = [];
	let feedbacks = $state<FeedbackType[]>([]);
	let loadingFeedbacks = $state(true);

	onMount(() => {
		async function loadFirebaseDeps() {
			const { getFirestore } = await import('firebase/firestore');
			firebaseStore = getFirestore(firebaseApp);

			const { getStorage } = await import('firebase/storage');
			firebaseFileStorage = getStorage(firebaseApp);

			console.log('Firebase loaded');

			if (UserStateObj.CurrentUser) {
				getFeedbacks();
			}
		}

		loadFirebaseDeps();

		timeoutLoadingUser = setTimeout(() => {
			if (UserStateObj.CurrentUser == null) {
				goto('/signin');
			}
		}, 3000);

		return () => {
			if (timeoutLoadingUser) {
				clearTimeout(timeoutLoadingUser);
			}
		};
	});

	$effect(() => {
		//When the user gets updated, clear the timeout
		if (UserStateObj.CurrentUser && timeoutLoadingUser) {
			clearTimeout(timeoutLoadingUser);

			if (firebaseStore && firebaseFileStorage) {
				getFeedbacks();
			}
		}
	});

	async function signout() {
		signingOut = true;
		try {
			await signOut(firebaseAuth).catch((err) => {
				console.log('Error signing out', err);
			});
			goto('/signin');
		} finally {
			signingOut = false;
		}
	}

	async function handleSearchChanged(e: Event) {
		const inputElem = e.target as HTMLInputElement;
		if (inputElem.value === '') {
			feedbacks = allFeedbacks;
			return;
		}

		const filteredFeedbacks = allFeedbacks.filter((value) => value.email.includes(inputElem.value));

		feedbacks = filteredFeedbacks;
	}

	async function handleDownlaod(url: string) {
		window.open(url, '_blank');
	}

	async function deleteFeedback(feedback: any, index: number) {
		if (firebaseStore == null || firebaseFileStorage == null) {
			AddToast({
				Level: ToastLevel.Error,
				Message: ['An error occurred, please contact us via email!']
			});
			return;
		}

		const deleteConfirmed = confirm(
			`You are going to delete feedback with index ${index + 1}, proceed?`
		);

		if (deleteConfirmed) {
			await deleteDoc(doc(firebaseStore, 'feedbacks', feedback.id));
			allFeedbacks = allFeedbacks.filter((fb) => fb.id != feedback.id);
			feedbacks = allFeedbacks;
			AddToast({
				Level: ToastLevel.Info,
				Message: ['Feedback deleted!']
			});
		}
	}

	async function getFeedbacks() {
		if (UserStateObj.CurrentUser == null) {
			return;
		}

		if (firebaseStore == null || firebaseFileStorage == null) {
			AddToast({
				Level: ToastLevel.Error,
				Message: ['An error occurred, please contact us via email!']
			});
			return;
		}

		console.log('Effect running');

		loadingFeedbacks = true;
		try {
			const querySnapshot = await getDocs(collection(firebaseStore, 'feedbacks'));
			const promises: Promise<FeedbackType>[] = [];

			querySnapshot.forEach(async (doc) => {
				const promise: Promise<FeedbackType> = new Promise(async (resolve: Function) => {
					const documentData = doc.data();

					//convert data form unix like to js date object
					const jsDate = new Date(documentData.date?.seconds * 1000);

					let feedback: FeedbackType = {
						id: doc.id,
						email: documentData.email,
						message: documentData.message,
						date: jsDate,
						downloadURL: null
					};

					try {
						if (firebaseFileStorage == null) {
							AddToast({
								Level: ToastLevel.Error,
								Message: ['An error occurred, please contact us via email!']
							});
							return;
						}

						//get all the links to zip file download for each feedback
						const pathReference = ref(firebaseFileStorage, `${doc.id}.zip`);

						const attachmentURL = await getDownloadURL(pathReference).catch((err) => {
							console.log(err);
							return null;
						});

						feedback.downloadURL = attachmentURL;
					} catch (err) {
						console.log(err);
					}

					resolve(feedback);
				});

				promises.push(promise);
			});

			const data = await Promise.all(promises);
			const sortedData = data.sort((a, b) => b.date.getTime() - a.date.getTime());

			allFeedbacks = sortedData;
			feedbacks = sortedData;
		} catch (err) {
			console.log(err);
		} finally {
			loadingFeedbacks = false;
		}
	}
</script>

{#if UserStateObj.CurrentUser == null}
	<div class="flex h-screen w-screen items-center justify-center">
		<p class="text-3xl">Loading <span class="loading loading-dots loading-xl"></span></p>
	</div>
{:else}
	<div class="mt-20 flex h-full justify-center">
		<div class="flex h-full w-[80%] flex-col items-center justify-center rounded-lg">
			<div class="flex w-full items-center justify-between pt-3">
				<p class="text-2xl sm:text-5xl">Feedbacks</p>
				<a class="btn btn-ghost" href="/docs/1002">Go to docs</a>
				<button class="btn btn-ghost" onclick={signout} disabled={signingOut}>
					{#if signingOut}
						Signing out
						<span class="loading loading-dots"></span>
					{:else}
						Sign out
					{/if}
				</button>
			</div>
			<div
				class=" rounded-box border-base-content/5 bg-base-100 mt-10 h-full w-full overflow-auto border"
			>
				<table class="table w-full">
					<thead>
						<tr>
							<th class="align-top">No.</th>
							<th class="align-top">Menu</th>
							<th class="flex flex-col">
								<span>Email</span>

								<div class="input input-xs mt-3 max-w-[200px] rounded-full pl-5">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										fill="currentColor"
										class="bi bi-search"
										viewBox="0 0 16 16"
									>
										<path
											d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
										/>
									</svg>
									<input
										class="input input-ghost rounded-full focus:outline-0"
										type="text"
										placeholder="Search by email"
										oninput={handleSearchChanged}
									/>
								</div></th
							>
							<th class="align-top">Message</th>
							<th class="align-top">Date</th>
							<th class="align-top">Attachments</th>
						</tr>
					</thead>
					<tbody class="">
						{#if feedbacks.length}
							{#each feedbacks as feedback, index}
								<tr>
									<td>
										{index + 1}
									</td>
									<td>
										<div class="flex justify-center">
											<button
												title="delete feedback"
												aria-label="delete feedback"
												aria-labelledby="delete feedback"
												class="btn btn-error btn-sm btn-circle m-auto flex justify-center"
												onclick={() => {
													deleteFeedback(feedback, index);
												}}
											>
												<svg
													width="20"
													viewBox="0 0 24 24"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M10 12V17"
														stroke="#000000"
														stroke-width="2"
														stroke-linecap="round"
														stroke-linejoin="round"
													/>
													<path
														d="M14 12V17"
														stroke="#000000"
														stroke-width="2"
														stroke-linecap="round"
														stroke-linejoin="round"
													/>
													<path
														d="M4 7H20"
														stroke="#000000"
														stroke-width="2"
														stroke-linecap="round"
														stroke-linejoin="round"
													/>
													<path
														d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10"
														stroke="#000000"
														stroke-width="2"
														stroke-linecap="round"
														stroke-linejoin="round"
													/>
													<path
														d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
														stroke="#000000"
														stroke-width="2"
														stroke-linecap="round"
														stroke-linejoin="round"
													/>
												</svg>
											</button>
										</div>
									</td>
									<td>
										{feedback.email}
									</td>
									<td>
										{feedback.message}
									</td>
									<td>
										{feedback.date.toUTCString()}
									</td>
									<td>
										{#if feedback.downloadURL != null}
											<button
												title="Download attachments"
												aria-label="Download attachments"
												aria-labelledby="Download attachments"
												class="btn"
												onclick={() => {
													handleDownlaod(feedback.downloadURL as string);
												}}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="15"
													fill="currentColor"
													class="bi bi-download"
													viewBox="0 0 16 16"
												>
													<path
														d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"
													/>
													<path
														d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"
													/>
												</svg>
											</button>
										{:else}
											N/A
										{/if}
									</td>
								</tr>
							{/each}
						{:else if loadingFeedbacks}
							<tr>
								{#each [1, 2, 3, 4, 5, 6] as cols}
									<td>
										<div class="skeleton h-10 w-32"></div>
									</td>
								{/each}
							</tr>
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	</div>
{/if}
