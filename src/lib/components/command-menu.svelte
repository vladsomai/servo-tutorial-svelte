<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import LogoImg from '$lib/images/logo.png';
	import Icon from '@iconify/svelte';

	let { data } = $props();
	const commandGroups = data.MotorCommandsGrouped.size;

	let menuGroupsExpanded: boolean[] = $state(new Array(commandGroups).fill(true));

	let isAtleastOneExpanded: boolean = $derived.by(() => {
		return menuGroupsExpanded.includes(true);
	});

	let searchText = $state('');

	let motorCommandsGroupedFiltered: Map<string, number[]> = $state(
		new Map(data.MotorCommandsGrouped)
	);

	$effect(() => {
		const tempCmds = new Map();
		for (const [group, commandsIds] of data.MotorCommandsGrouped) {
			const filteredCmdPerGroup = commandsIds
				.map((cmdid: number) => data.MotorCommands.get(cmdid))
				.filter((cmd: MotorCommandType) => {
					if (cmd != null)
						return cmd.CommandString.toLowerCase().includes(searchText.toLocaleLowerCase());
				});
			const cmdIdsFiltered = filteredCmdPerGroup.map((cmd: MotorCommandType) => cmd.CommandEnum);
			tempCmds.set(group, cmdIdsFiltered);
		}
		motorCommandsGroupedFiltered = tempCmds;
	});
</script>

<div class="flex flex-col justify-center py-10">
	<a href="/" class="mx-auto">
		<img src={LogoImg} height="auto" width="160" alt="Gearotons" />
	</a>

	<input bind:value={searchText} class="input input-sm my-3" placeholder="Search command" />

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
		{#each motorCommandsGroupedFiltered as [key, value], index}
			<li>
				<details bind:open={menuGroupsExpanded[index]}>
					<summary class="opacity-50">{key}</summary>
					<ul>
						{#each value as cmdid}
							<li class="mt-3">
								<a
									href={`/docs/${cmdid}`}
									class={`hover:bg-base-300 hover:text-primary ${cmdid == data.CommandId ? 'bg-base-300 text-primary' : ''} w-full rounded-l-lg rounded-r-full p-3 text-left text-sm`}
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
