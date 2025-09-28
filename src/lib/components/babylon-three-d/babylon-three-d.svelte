<script lang="ts">
	import * as BABYLON from 'babylonjs';
	import 'babylonjs-loaders';
	import { onMount } from 'svelte';

	interface ILoadingScreen {
		//What happens when loading starts
		displayLoadingUI: () => void;
		//What happens when loading stops
		hideLoadingUI: () => void;
		//default loader support. Optional!
		loadingUIBackgroundColor: string;
		loadingUIText: string;
	}

	class CustomLoadingScreen implements ILoadingScreen {
		//optional, but needed due to interface definitions
		public loadingUIBackgroundColor: string = '#FFF';
		public loadingUIText: string = '';
		private static loadingDiv: HTMLDivElement | null = null;

		public displayLoadingUI() {}

		public hideLoadingUI() {
			CustomLoadingScreen.loadingDiv?.classList.add('hidden');
		}

		public static setLoadingDiv: Function = function (input: HTMLDivElement | null): void {
			CustomLoadingScreen.loadingDiv = input;
		};
	}

	class Playground {
		public static CreateScene(
			canvas: HTMLCanvasElement,
			sceneFileName: string,
			cameraAlpha: number,
			cameraBeta: number,
			cameraRadius: number
		): {
			scene: BABYLON.Scene;
			engine: BABYLON.Engine;
		} {
			const engine = new BABYLON.Engine(canvas, true);
			engine.loadingScreen = new CustomLoadingScreen();

			const scene = new BABYLON.Scene(engine);
			scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

			const camera = new BABYLON.UniversalCamera('camera1', new BABYLON.Vector3(0, 0, 0), scene);
			camera.attachControl(canvas, true);

			BABYLON.SceneLoader.Append('/', sceneFileName, scene, function (scene) {
				scene.createDefaultCamera(true, true, true);
				let helper = scene.createDefaultEnvironment({
					enableGroundMirror: true,
					groundYBias: 0.01
				});
				helper?.setMainColor(BABYLON.Color3.FromInts(15, 23, 42));

				//@ts-ignore
				scene.activeCamera!.alpha += cameraAlpha;
				//@ts-ignore
				scene.activeCamera!.beta += cameraBeta;
				//@ts-ignore
				scene.activeCamera!.radius += cameraRadius;
			});

			engine.runRenderLoop(function () {
				scene?.render();
			});

			return { scene: scene, engine: engine };
		}
	}

	let { glbFileName, cameraAlpha, cameraBeta, cameraRadius } = $props();

	let canvas: HTMLCanvasElement | null = $state(null);
	let loadingDiv: HTMLDivElement | null = $state(null);

	onMount(() => {
		CustomLoadingScreen.setLoadingDiv(loadingDiv);
		const { scene, engine } = Playground.CreateScene(
			canvas as HTMLCanvasElement,
			glbFileName,
			cameraAlpha,
			cameraBeta,
			cameraRadius
		);

		function handleResize() {
			engine.resize();
		}

		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<div class="flex flex-col items-center justify-center rounded-2xl">
	<div bind:this={loadingDiv} class="flex flex-col items-center justify-center rounded-2xl mt-2 min-h-[500px] absolute">
		<progress class="progress progress-primary"></progress>
		<p class="mt-5 text-3xl">Loading 3D assets...</p>
	</div>

	<canvas class="h-full w-full rounded-2xl" bind:this={canvas}></canvas>
</div>
