<script lang="ts">
	import LogoImg from '$lib/images/logo.png';
	import Icon from '@iconify/svelte';

	let { data } = $props();
	const commandGroups = data.MotorCommandsGrouped.size;

	let menuGroupsExpanded: boolean[] = $state(new Array(commandGroups).fill(true));

	let isAtleastOneExpanded: boolean = $derived.by(() => {
		return menuGroupsExpanded.includes(true);
	});
</script>

<div class="flex flex-col justify-center py-10">
	<a href="/" class="mx-auto">
		<img src={LogoImg} height="auto" width="160" alt="Gearotons" />
	</a>

	<button
		title={'Collapse all'}
		class="btn btn-ghost btn-lg"
		onclick={() => {
			let tempExpanded = [];
			for (let grp of menuGroupsExpanded) {
				tempExpanded.push(!isAtleastOneExpanded);
			}
			menuGroupsExpanded = tempExpanded;
		}}
	>
		{#if isAtleastOneExpanded}
			<Icon icon="mdi:collapse-all-outline" />
		{:else}
			<Icon icon="mdi:expand-all-outline" />
		{/if}
	</button>
	<ul class="menu bg-base-200 rounded-box w-full">
		{#each data.MotorCommandsGrouped as [key, value], index}
			<li>
				<details bind:open={menuGroupsExpanded[index]}>
					<summary class="opacity-50">{key}</summary>
					<ul>
						{#each value as cmdid}
							<li class="mt-3">
								<a
									href={`/docs/${cmdid}`}
									class={`hover:bg-base-300 hover:text-primary ${cmdid == data.CommandId ? 'bg-base-300 text-primary' : ''} w-full rounded-r-2xl p-3 text-left text-sm `}
									>{data.MotorCommands.get(cmdid).CommandString}</a
								>
							</li>
						{/each}
					</ul>
				</details>
			</li>
		{/each}
	</ul>
</div>
