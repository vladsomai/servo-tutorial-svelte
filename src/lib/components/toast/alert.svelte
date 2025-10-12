<script lang="ts">
	import { ToastLevel } from '$lib/client-server-lib/types';
	import type { ToastContentType } from './toast-state.svelte';

	let { toast }: { toast: ToastContentType } = $props();

	let alertType = $derived.by(() => {
		let res = '';
		switch (toast.Level) {
			case ToastLevel.Success:
				res = 'alert-success';
				break;
			case ToastLevel.Info:
				res = 'alert-info';
				break;
			case ToastLevel.Error:
				res = 'alert-error';
				break;
			case ToastLevel.Warning:
				res = 'alert-warning';
				break;
			default:
				break;
		}
		return res;
	});
</script>

<div class={`alert ${alertType}`}>
	<span>{toast.Message}</span>
</div>
