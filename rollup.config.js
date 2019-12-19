import { terser } from 'rollup-plugin-terser';
import { eslint } from 'rollup-plugin-eslint';

let eslintOptions = {};
eslintOptions.rules = {};
eslintOptions.rules['no-console'] = (process.env.PRODUCTION ? 'warn' : 'off');
// eslintOptions['fix-type'] = 'problem';
// eslintOptions.fix = true;
// eslintOptions.throwOnWarning = !!process.env.PRODUCTION;
// eslintOptions.throwOnError = !!process.env.PRODUCTION;

export default {
	input: 'loader.mjs',
	plugins: [
		eslint(eslintOptions)
	],
	treeshake: false,
	output: [
		{
			file: 'bundle.mjs',
			format: 'esm'
		},
		{
			file: 'bundle.min.mjs',
			format: 'esm',
			sourcemap: !!process.env.DEVELOPMENT,
			sourcemapExcludeSources: true,
			plugins: [terser({
				keep_classnames: true,
				module: true,
				compress: false
			})]
		}
	]
};