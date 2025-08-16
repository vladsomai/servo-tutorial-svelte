<script lang="ts">
	import LogoImg from '$lib/images/logo.png';
	import BabylonThreeD from '$lib/components/babylon-three-d/babylon-three-d.svelte';
</script>

<div class="grid">

	
	<a href="/docs/1" class="mx-auto my-5">
		<img src={LogoImg} height="auto" width="160" alt="Gearotons" />
	</a>
	<BabylonThreeD
	glbFileName={'motor1.glb'}
	cameraAlpha={-Math.PI / 3}
	cameraBeta={-Math.PI / 10}
	cameraRadius={-0.25}
	/>
</div>
