<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import { SelectedAxis } from '$lib/stores/global';
	import { M3 } from './commands';

	let { currentCommand, children }: { currentCommand: MotorCommandType; children: any } = $props();
	let rotations = $state(1);
	let duration = $state(1);
</script>

<div class="mb-5 mt-2 w-full">
	<div class="flex flex-col justify-center">
		<div class="flex flex-col items-center justify-center">
			<label class="input input-sm w-[200px]">
				<span class="label w-[100px]">Target</span>
				<input bind:value={rotations} placeholder="" class="w-[50px]" />
			</label>
			<label class="input input-sm mt-2 w-[200px]">
				<span class="label w-[100px]">Duration </span>
				<input bind:value={duration} placeholder="" class="w-[50px]" />
			</label>
		</div>
		<button
			class="btn btn-primary btn-sm mx-auto mt-5"
			onclick={() => {
				M3.GoToPosition($SelectedAxis, rotations, duration);
			}}
		>
			Trapezoid move
		</button>
	</div>
</div>
