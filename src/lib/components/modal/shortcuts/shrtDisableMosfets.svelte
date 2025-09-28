<script>
	import ShortcutImg from '$lib/images/shortcuts.svg';
</script>

<div class="mt-5 flex flex-col items-center justify-center">
	<p class="text-2xl">This command supports shortcuts</p>
	<ul class="my-10">
		<li>
			<kbd class="kbd">ctrl</kbd>+
			<kbd class="kbd">d</kbd>
			<p class="inline">to disable MOSFETs on the current selected alias</p>
		</li>
		<li class="mt-2">
			<kbd class="kbd">ctrl</kbd>+
			<kbd class="kbd">D</kbd>
			<p class="inline">to disable MOSFETs for all aliases (255)</p>
		</li>
	</ul>

	<div class="bg-gray-200 p-5 rounded-2xl w-1/2 flex justify-center">
		<img src={ShortcutImg} alt="shortcut supported" width="200" height="auto" />
	</div>
</div>
