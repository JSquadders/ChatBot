/* eslint-disable no-undef */
import { terser } from 'rollup-plugin-terser';
import { eslint } from 'rollup-plugin-eslint';

let output = [{
	file: 'src/jsquadbot.mjs',
	format: 'esm'
}];

if (process.env.RELEASE) {
	output.push({
		file: 'src/jsquadbot.min.mjs',
		format: 'esm',
		plugins: [
			terser({
				keep_classnames: true,
				module: true,
				compress: {defaults: false, drop_console: true}
			})
		]
	});
}

export default {
	input: 'src/loader.mjs',
	plugins: [
		eslint()
	],
	treeshake: false,
	output: output
};