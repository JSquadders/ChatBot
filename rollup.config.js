import { terser } from 'rollup-plugin-terser';

export default {
  input: 'loader.mjs',
  treeshake: false,
  output: [
    {
      file: 'bundle.mjs',
      format: 'esm'
    },
    {
      file: 'bundle.min.mjs',
      format: 'esm',
      plugins: [terser({
        keep_classnames: true,
        module: true,
        compress: false
      })]
    }
  ]
};