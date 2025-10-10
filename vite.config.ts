import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	optimizeDeps: {
		include: [
			'firebase/app',
			'firebase/firestore',
			'firebase/storage',
			'firebase/auth',
			'shiki']
	},

	plugins: [tailwindcss(), sveltekit(), devtoolsJson()]
});
