/* eslint-disable no-undef */
import { terser } from 'rollup-plugin-terser';
import { eslint } from 'rollup-plugin-eslint';

export default {
	input: 'loader.mjs',
	plugins: [
		eslint()
	],
	treeshake: false,
	output: [
		{
			file: 'jsquadbot.mjs',
			format: 'esm'
		},
		{
			file: 'jsquadbot.min.mjs',
			format: 'esm',
			plugins: [
				terser({
					keep_classnames: true,
					module: true,
					compress: {defaults: false, drop_console: true}
				})
			]
		}
	]
};