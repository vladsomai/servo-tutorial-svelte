<script lang="ts">
	let {
		children,
		Label,
		Class = ''
	}: {
		children: any;
		Label: string;
		Class: string;
	} = $props();
	let isDropdownOpen = $state(false);
</script>

<details
	bind:open={isDropdownOpen}
	class="dropdown dropdown-center btn btn-sm z-1 m-0 rounded-b-none rounded-t-2xl"
	onmouseenter={() => {
		isDropdownOpen = true;
	}}
	onmouseleave={() => {
		isDropdownOpen = false;
	}}
>
	<summary class="text-[12px] font-semibold">{Label}</summary>
	<div class="menu dropdown-content bg-base-100 rounded-box z-1 mt-4 p-2 shadow-sm">
		{@render children()}
	</div>
</details>
