<script>
	import BabylonThreeD from '../babylon-three-d/babylon-three-d.svelte';
</script>

<div class="">
	<BabylonThreeD
		glbFileName={'motor3.glb'}
		cameraAlpha={-Math.PI / 0.8}
		cameraBeta={-Math.PI / 10}
		cameraRadius={-0.1}
	/>
</div>
