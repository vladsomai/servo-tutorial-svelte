<script lang="ts">
	import type { MotorCommandType } from '$lib/client-server-lib/types';
	import { SelectedAxis, ShowLogTimestamp } from '$lib/stores/global';
	import { SupportedCookies, UpdateCookie } from '$lib/client-server-lib/cookies';

	function checkChanged() {
		UpdateCookie(SupportedCookies.ShowLogTimestamp, String($ShowLogTimestamp));
	}
</script>

<fieldset class="fieldset bg-base-100 border-base-300 rounded-box mx-auto w-64 border p-4">
	<legend class="fieldset-legend"></legend>
	<label class="label mx-auto">
		<input
			type="checkbox"
			bind:checked={$ShowLogTimestamp}
			class="toggle toggle-primary"
			onchange={checkChanged}
		/>
		Show timestamps
	</label>
</fieldset>
