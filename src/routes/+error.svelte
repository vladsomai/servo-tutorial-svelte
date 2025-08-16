<script lang="ts">
	import { goto } from '$app/navigation';
	import PageNotFoundImg from '$lib/images/404-page-not-found.svg';
</script>

<svelte:head>
	<title>Page not found</title>
	<meta name="description" content="Page not found" lang="en" />
</svelte:head>
<div class="mt-[25vh] flex w-full flex-col items-center justify-center">
	<div class="mx-[10%] flex w-full flex-col items-center justify-center sm:w-[40%] xl:w-[30%]">
		<img src={PageNotFoundImg} alt="page not found" />
		<p class="mt-5 text-center text-2xl sm:text-3xl">Page not found</p>
	</div>
	<button
		class="btn btn-primary btn-xl mx-auto
	mt-5"
		onclick={() => {
			goto('/');
		}}
	>
		Get back on track
	</button>
</div>
