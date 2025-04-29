import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import versionInjector from 'rollup-plugin-version-injector';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

// Shared external dependencies (nothing bundled)
const external = ['three'];

// Shared plugins
const commonPlugins = [
  resolve(),
  versionInjector(),
  commonjs({
    namedExports: {
      'node_modules/esprima/dist/esprima.js': ['parse'],
    },
  }),
  babel({
    exclude: ['node_modules/**'],
    babelHelpers: 'bundled',
  }),
  json({
    include: 'node_modules/**',
    preferConst: true,
    indent: '  ',
    compact: true,
  }),
];

// Main Rollup export
export default [
  // Main browser-friendly UMD build
  {
    input: 'index.js',
    external,
    output: {
      name: 'shader-park-core',
      file: pkg.browser,
      format: 'umd',
      sourcemap: true,
    },
    plugins: commonPlugins,
  },

  // p5.js UMD build
  {
    input: 'targets/p5.js',
    external,
    output: {
      name: 'shaderPark',
      file: pkg.p5,
      format: 'umd',
      sourcemap: true,
    },
    plugins: commonPlugins,
  },

  // Node.js CommonJS and ESM builds
  {
    input: 'index.js',
    external,
    output: [
      { file: pkg.cjs, format: 'cjs', sourcemap: true },
      { file: pkg.module, format: 'es', sourcemap: true },
    ],
    plugins: commonPlugins,
  },

  // Minimal GLSL Renderer CJS and ESM builds
  {
    input: 'targets/minimalGLSLRenderer.js',
    external,
    output: [
      { file: pkg.minimalGLSLRendererCJS, format: 'cjs', sourcemap: true },
      { file: pkg.minimalGLSLRendererESM, format: 'es', sourcemap: true },
    ],
    plugins: commonPlugins,
  },

  // TouchDesigner UMD build
  {
    input: 'targets/touchDesigner.js',
    external,
    output: {
      name: 'SPTD',
      file: pkg.TouchDesigner,
      format: 'umd',
      sourcemap: true,
    },
    plugins: commonPlugins,
  },
];
