<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import { GetFuncNameFromCmdString } from '$lib/client-server-lib/utils';
	import { SelectedAxis, SelectedUniqueID } from '$lib/stores/global';
	import LabeledInput from '../labeled-input.svelte';
	import LabeledSelect from '../labeled-select.svelte';
	import { LogWarning } from '../log-window/state.svelte';
	import { M3 } from './commands';
	import AddAccVelInp from '$lib/images/icons/add.svg';
	import ResetAccVelInp from '$lib/images/icons/reset.svg';
	import DeleteAccVelInp from '$lib/images/icons/delete.svg';
	import { fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { GlobalConversionTypes } from '../../../hooks.client';
	import { onMount } from 'svelte';

	let { currentCommand, children }: { currentCommand: MotorCommandType; children: any } = $props();
	let multimoveInputs: VelAccInput[] = $state([]);

	onMount(() => {
		AddDefaultInputs();
	});
	const VelocityStr = 'Velocity';
	const AccelerationStr = 'Acceleration';

	const LastMove = {
		is_velocity: VelocityStr,

		value: 0,
		value_unit: GlobalConversionTypes.units.velocity[0],

		duration: 0.01,
		time_unit: GlobalConversionTypes.units.time[1]
	};

	interface VelAccInput {
		is_velocity: string;

		value: number;
		value_unit: string;

		duration: number;
		time_unit: string;
	}

	function AddDefaultInputs() {
		multimoveInputs = [];

		const inp = {
			is_velocity: AccelerationStr,

			value: -2,
			value_unit: GlobalConversionTypes.units.acceleration[0],

			duration: 1,
			time_unit: GlobalConversionTypes.units.time[1]
		};

		const inp2 = {
			is_velocity: VelocityStr,

			value: -2,
			value_unit: GlobalConversionTypes.units.velocity[0],

			duration: 1,
			time_unit: GlobalConversionTypes.units.time[1]
		};

		const inp3 = {
			is_velocity: AccelerationStr,

			value: 2,
			value_unit: GlobalConversionTypes.units.acceleration[0],

			duration: 1,
			time_unit: GlobalConversionTypes.units.time[1]
		};

		multimoveInputs.push(inp);
		multimoveInputs.push(inp2);
		multimoveInputs.push(inp3);
		multimoveInputs.push(LastMove);
	}

	function AddNewInputs() {
		if (multimoveInputs.length > 30) {
			LogWarning('Reached max no of moves');
			return;
		}

		const inp = {
			is_velocity: VelocityStr,

			value: 3,
			value_unit: GlobalConversionTypes.units.velocity[0],

			duration: 5,
			time_unit: GlobalConversionTypes.units.time[1]
		};
		multimoveInputs.pop();
		multimoveInputs.push(inp);
		multimoveInputs.push(LastMove);
	}

	function RemoveAllInputs() {
		multimoveInputs = [];
	}
</script>

<div class="mb-5 mt-2 w-full">
	<div class="flex flex-col justify-center">
		<div class="mx-auto my-2 flex w-2/6 justify-center">
			<div class="tooltip">
				<div class="tooltip-content w-[200px]">
					<div class="font-black">Add new move</div>
				</div>
				<button class="btn btn-primary mx-auto" onclick={AddNewInputs}
					><img src={AddAccVelInp} alt="Add new move" /></button
				>
			</div>

			<div class="tooltip ml-5">
				<div class="tooltip-content w-[200px]">
					<div class="font-black">Remove all moves</div>
				</div>

				<button class="btn btn-error mx-auto" onclick={RemoveAllInputs}
					><img src={ResetAccVelInp} alt="Remove all moves" /></button
				>
			</div>
		</div>
		{#each multimoveInputs as multimoveInp, index (multimoveInp)}
			<div animate:flip out:fade class="flex flex-col items-center justify-center">
				<div class="divider"></div>
				{@render VelocityAcceleration(index)}
			</div>
		{/each}
		<button
			class="btn btn-primary btn-sm mx-auto mt-5"
			onclick={() => {
				if (multimoveInputs.length == 0) {
					LogWarning('Add at least one move command');
					return;
				}
				const cmdFunction = GetFuncNameFromCmdString(currentCommand.CommandString);

				const noOfMoves = { value: multimoveInputs.length, type: 'number', unit: '' };
				let moveTypesBits = 0;
				let moveTypes = {};
				let rawMoves: any[] = [];
				for (let i = 0; i < multimoveInputs.length; i++) {
					if (multimoveInputs[i].is_velocity == VelocityStr) {
						//set ith bit when using velocity movement
						const mask = 1 << i;
						moveTypesBits |= mask;
					}

					moveTypes = { value: moveTypesBits, type: 'number', unit: '' };

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

				const moves = {
					value: rawMoves,
					type: 'mixed_acceleration_velocity_time',
					unit: 'mixed_acceleration_velocity_time'
				};

				// @ts-ignore
				M3[cmdFunction]($SelectedAxis, $SelectedUniqueID, currentCommand, [
					noOfMoves,
					moveTypes,
					moves
				]);
			}}>{currentCommand.CommandString}</button
		>
	</div>
</div>

{#snippet VelocityAcceleration(index: number)}
	<div class="flex items-center">
		<LabeledSelect
			Label={'Move type'}
			bind:SelectValue={multimoveInputs[index].is_velocity}
			Options={[VelocityStr, AccelerationStr]}
			Onchange={(e: any) => {
				let defaultUnit = GlobalConversionTypes.units.velocity[0];
				if (e.target.value == AccelerationStr) {
					defaultUnit = GlobalConversionTypes.units.acceleration[0];
				}

				multimoveInputs[index].value_unit = defaultUnit;
			}}
		/>

		<div class="tooltip ml-5">
			<div class="tooltip-content w-[200px]">
				<div class="font-black">Remove this move</div>
			</div>

			<button
				class="btn btn-error mx-auto"
				onclick={() => {
					multimoveInputs.splice(index, 1);
				}}
			>
				<img src={DeleteAccVelInp} alt="Delete move" />
			</button>
		</div>
	</div>
	<div class="flex">
		<div class="my-2 mr-2">
			<LabeledSelect
				Class="mt-5"
				TooltipText={''}
				Label={`${multimoveInputs[index].is_velocity} unit`}
				bind:SelectValue={multimoveInputs[index].value_unit}
				Options={multimoveInputs[index].is_velocity == VelocityStr
					? GlobalConversionTypes.units.velocity
					: GlobalConversionTypes.units.acceleration}
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
				Options={GlobalConversionTypes.units.time}
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
