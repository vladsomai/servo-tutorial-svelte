<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import { GetFuncNameFromCmdString } from '$lib/client-server-lib/utils';
	import { SelectedAxis } from '$lib/stores/global';
	import LabeledInput from '../labeled-input.svelte';
	import LabeledSelect from '../labeled-select.svelte';
	import { LogWarning } from '../log-window/state.svelte';
	import { M3 } from './commands';
	import AddAccVelInp from '$lib/images/icons/add.svg';
	import ResetAccVelInp from '$lib/images/icons/reset.svg';
	import DeleteAccVelInp from '$lib/images/icons/delete.svg';
	import conversionData from './unit_conversions_M3.json';
	import { fade, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	const units = conversionData.units;

	let { currentCommand, children }: { currentCommand: MotorCommandType; children: any } = $props();

	const VelocityStr = 'Velocity';
	const AccelerationStr = 'Acceleration';

	const LastMove = {
		is_velocity: VelocityStr,

		value: 0,
		value_unit: units.velocity[0],

		duration: 0.01,
		time_unit: units.time[1]
	};

	interface VelAccInput {
		is_velocity: string;

		value: number;
		value_unit: string;

		duration: number;
		time_unit: string;
	}

	let multimoveInputs: VelAccInput[] = $state([]);

	function AddNewInputs() {
		const inp = {
			is_velocity: VelocityStr,

			value: 3,
			value_unit: units.velocity[0],

			duration: 5,
			time_unit: units.time[1]
		};
		multimoveInputs.pop();
		multimoveInputs.push(inp);
		multimoveInputs.push(LastMove);
	}

	function RemoveAllInputs() {
		multimoveInputs = [];
	}
	$inspect(multimoveInputs);
</script>

<div class="mb-5 mt-2 w-full">
	<div class="flex flex-col justify-center">
		<div class="mx-auto my-2 flex w-2/6 justify-center">
			<div class="tooltip">
				<div class="tooltip-content w-[200px]">
					<div class="font-black">Add new move</div>
				</div>
				<button class="btn btn-primary mx-auto" onclick={AddNewInputs}
					><img src={AddAccVelInp} alt="Add new move" title="Add new move" /></button
				>
			</div>

			<div class="tooltip ml-5">
				<div class="tooltip-content w-[200px]">
					<div class="font-black">Remove all moves</div>
				</div>

				<button class="btn btn-error mx-auto" onclick={RemoveAllInputs}
					><img src={ResetAccVelInp} alt="Remove all moves" title="Remove all moves" /></button
				>
			</div>
		</div>
		{#each multimoveInputs as multimoveInp, index (multimoveInp)}
			<div animate:flip out:fade class="flex flex-col items-center justify-center">
				<div class="divider"></div>
				{@render VelocityAcceleration(index)}
				<button
					class="btn btn-error mx-auto"
					onclick={() => {
						multimoveInputs.splice(index, 1);
					}}
				>
					<img src={DeleteAccVelInp} alt="Delete move" title="Delete move" />
				</button>
			</div>
		{/each}
		<button
			class="btn btn-primary btn-sm mx-auto mt-5"
			onclick={() => {
				const cmdFunction = GetFuncNameFromCmdString(currentCommand.CommandString);

				const noOfMoves = { value: multimoveInputs.length, type: 'moveCount', unit: 'moveCount' };
				let moveTypesBits = 0;
				let moveTypes = {};
				let rawMoves: any[] = [];
				for (let i = 0; i < multimoveInputs.length; i++) {
					if (multimoveInputs[i].is_velocity == VelocityStr) {
						//set ith bit when using velocity movement
						const mask = 1 << i;
						moveTypesBits |= mask;
					}

					moveTypes = { value: moveTypesBits, type: 'moveTypes', unit: 'moveTypes' };

					const currentMoveVal = {
						value: multimoveInputs[i].value,
						type: multimoveInputs[i].is_velocity.toLowerCase(),
						unit: multimoveInputs[i].value_unit
					};

					const currentMoveDur = {
						value: multimoveInputs[i].duration,
						type: 'time',
						unit: multimoveInputs[i].time_unit
					};

					rawMoves.push([currentMoveVal, currentMoveDur]);
				}

				const moves = { value: rawMoves, type: 'mixed_acceleration_velocity_time', unit: 'mixed_acceleration_velocity_time' };

				// @ts-ignore
				M3[cmdFunction]($SelectedAxis, currentCommand, [noOfMoves, moveTypes, moves]);
			}}>{currentCommand.CommandString}</button
		>
	</div>
</div>

{#snippet VelocityAcceleration(index: number)}
	<LabeledSelect
		Label={'Move type'}
		bind:SelectValue={multimoveInputs[index].is_velocity}
		Options={[VelocityStr, AccelerationStr]}
		Onchange={(e: any) => {
			console.log('Changed type', index, e.target.value);

			let defaultUnit = units.velocity[0];
			if (e.target.value == AccelerationStr) {
				defaultUnit = units.acceleration[0];
			}

			multimoveInputs[index].value_unit = defaultUnit;
		}}
	/>

	<div class="flex">
		<div class="my-2 mr-2">
			<LabeledSelect
				Class="mt-5"
				TooltipText={''}
				Label={`${multimoveInputs[index].is_velocity} unit`}
				bind:SelectValue={multimoveInputs[index].value_unit}
				Options={multimoveInputs[index].is_velocity == VelocityStr
					? units.velocity
					: units.acceleration}
			/>
			<LabeledInput
				Class="mt-2"
				TooltipText={''}
				Label={multimoveInputs[index].is_velocity}
				bind:InputValue={multimoveInputs[index].value}
			/>
		</div>
		<div class="my-2">
			<LabeledSelect
				Class="mt-5"
				TooltipText={''}
				Label={'Time unit'}
				bind:SelectValue={multimoveInputs[index].time_unit}
				Options={units.time}
			/>
			<LabeledInput
				Class="mt-2"
				TooltipText={''}
				Label={'Duration'}
				bind:InputValue={multimoveInputs[index].duration}
			/>
		</div>
	</div>
{/snippet}
