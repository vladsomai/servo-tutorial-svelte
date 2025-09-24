<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import { SelectedAxis } from '$lib/stores/global';
	import { M3 } from './commands';

	let { currentCommand, children }: { currentCommand: MotorCommandType; children: any } = $props();
	let velocity = $state(1000);
	let duration = $state(1);
</script>

<div class="mb-5 mt-2 w-full">
	<div class="flex flex-col justify-center">
		<div class="flex flex-col items-center justify-center">
			<label class="input input-sm w-[200px]">
				<span class="label w-[100px]">Velocity</span>
				<input bind:value={velocity} placeholder="" class="w-[50px]" />
			</label>
			<label class="input input-sm mt-2 w-[200px]">
				<span class="label w-[100px]">Duration </span>
				<input bind:value={duration} placeholder="" class="w-[50px]" />
			</label>
		</div>
		<button
			class="btn btn-primary btn-sm mx-auto mt-5"
			onclick={() => {
				M3.MoveWithVelocity($SelectedAxis, velocity, duration);
			}}
		>
			Move with velocity
		</button>
	</div>
</div>
