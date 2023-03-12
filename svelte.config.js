import preprocess from "svelte-preprocess";
import autoprefixer from "autoprefixer";
import adapter from "@sveltejs/adapter-auto";
import path from "path";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			$comps: path.resolve("./src/lib/components/_exporter.js"),
			$scripts: path.resolve("./src/lib/scripts/_exporter.js"),
			$stores: path.resolve("./src/lib/stores/_exporter.js"),
			src: path.resolve("./src"),
		},
	},

	preprocess: [
		preprocess({
			scss: {
				prependData: '@use "src/variables.scss" as *;',
			},

			postcss: {
				plugins: [autoprefixer()],
			},
		}),
	],
};

export default config;
