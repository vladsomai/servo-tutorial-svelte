<script lang="ts">
	import { NumberToUint8Arr, Uint8ArrayToString } from '$lib/client-server-lib/utils';
	import { GlobalConversionTypes } from '../../../hooks.client';

	let { unit, value, converter }: { unit: string; value: number; converter: string } = $props();
</script>

<div class="prose mb-10 ml-5">
	<p class="mb-5 text-2xl">{converter} conversion</p>
	<ol>
		<li>
			<p>Get the conversion factor for the selected unit</p>
			<p>
				Conversion factor for {unit}: {GlobalConversionTypes.conversion_factors[unit]}
			</p>
		</li>

		<li>
			<p class="">
				Convert {converter} to motor units using formula: <br /><span class="underline">
					motor_units = {converter} * conversion_factor
				</span>
			</p>
			<p class="">
				motor_units = {value}
				{unit} * {GlobalConversionTypes.conversion_factors[unit]} = {value *
					GlobalConversionTypes.conversion_factors[unit]}
			</p>
		</li>

		<li>
			<p class="">Convert motor_units (rounded) to little endian hexadecimal</p>
			<p class="">
				{Math.round(value * GlobalConversionTypes.conversion_factors[unit])} motor_units = 0x{Uint8ArrayToString(
					NumberToUint8Arr(Math.round(value * GlobalConversionTypes.conversion_factors[unit]), 4)
				)}
			</p>
		</li>
	</ol>
</div>
