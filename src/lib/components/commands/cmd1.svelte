<script lang="ts">
	// let { children, data } = $props();

	function disableEnableMosfets() {}
</script>

<div class="mb-5 w-full">
	<div class="flex justify-center">
		<div class="mr-4">
			<!-- {@render children()} -->
		</div>
		<button class="btn btn-primary btn-sm" onclick={disableEnableMosfets}>
			Cmd1 test
			<!-- {data.CommandId == 0 ? 'DISABLE MOSFETS' : 'ENABLE MOSFETS'} -->
		</button>
	</div>
</div>
