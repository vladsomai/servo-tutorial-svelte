<script lang="ts">
	import {
		GlobalConversionTypes,
		GlobalDataTypes,
		GlobalStatusErrorCodes
	} from '../../../hooks.client';

	let checked = $state('1');
</script>

<div class="tabs tabs-lift m-2 mt-10">
	<input
		type="radio"
		value="1"
		name="data_types"
		class="tab"
		aria-label="Data types"
		bind:group={checked}
	/>
	<div class="tab-content bg-base-100 border-base-300 p-6">
		<article class="prose prose-slate max-w-full">
			<ul>
				{#each GlobalDataTypes as [key, value]}
					<li><p>{key} - byte size: {value.ByteSize}</p></li>
				{/each}
			</ul>
		</article>
	</div>

	<input
		type="radio"
		name="conversion_factors"
		class="tab"
		aria-label="Conversion factors"
		value="2"
		bind:group={checked}
	/>
	<div class="tab-content bg-base-100 border-base-300 p-6">
		<article class="prose prose-slate max-w-full">
			<ul>
				{#each Object.keys(GlobalConversionTypes.conversion_factors) as i}
					<li><p>{i}: {GlobalConversionTypes.conversion_factors[i]}</p></li>
				{/each}
			</ul>
		</article>
	</div>

	<input
		type="radio"
		value="3"
		name="error_codes"
		class="tab"
		aria-label="Error codes"
		bind:group={checked}
	/>
	<div class="tab-content bg-base-100 border-base-300 p-6">
		<article class="prose prose-slate max-w-full">
			<ul>
				{#each GlobalStatusErrorCodes as [key, value]}
					<li>
						<p class="break-words">
							{value.enum}
							<br />
							Code: {value.code}
							<br />
							Brief: {value.short_desc}
							<br />
							Description: {value.long_desc}
							<br />
							Causes: {value.causes.join(', ')}
							<br />
							Solutions: {value.solutions.join(', ')}
						</p>
					</li>
				{/each}
			</ul>
		</article>
	</div>

	<input
		type="radio"
		name="available_units"
		class="tab"
		aria-label="Available units"
		value="4"
		bind:group={checked}
	/>
	<div class="tab-content bg-base-100 border-base-300 p-6">
		<article class="prose prose-slate max-w-full">
			<ul>
				{#each Object.keys(GlobalConversionTypes.units) as i}
					<li>
						<p class="break-words">{i}: <br /> {GlobalConversionTypes.units[i].join(', ')}</p>
					</li>
				{/each}
			</ul>
		</article>
	</div>
</div>
