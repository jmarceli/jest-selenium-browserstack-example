// nice example: https://github.com/rollup/rollup-starter-lib/blob/master/rollup.config.js
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

import pkg from './package.json';

const plugins = (browser = false) => {
  const plugins = [];

  if (browser) {
    plugins.push(commonjs());
    plugins.push(resolve());
    plugins.push(
      babel({
        exclude: 'node_modules/**',
      }),
    );
  }

  return plugins;
};

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: pkg.browser,
        name: 'JestSeleniumBrowserStackExample',
        format: 'umd',
        sourcemap: true,
      },
      {
        // IIFE is the easiest format to read, UMD might be used as well
        file: 'test/jest-selenium-browserstack-example.js',
        name: 'JestSeleniumBrowserStackExample',
        format: 'iife',
        sourcemap: true,
      },
    ],
    plugins: plugins(true),
  },
  {
    input: 'src/index.js',
    output: [
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
      },
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: plugins(false),
  },
];
