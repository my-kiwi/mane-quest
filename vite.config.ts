import { defineConfig } from 'vite';

// vite.config.ts

import {
  advzipPlugin,
  ectPlugin,
  defaultViteBuildOptions,
  roadrollerPlugin,
  shaderMinifierPlugin,
} from "js13k-vite-plugins";

// export default defineConfig({
//   build: defaultViteBuildOptions,
//   plugins: [
//     shaderMinifierPlugin(),
//     roadrollerPlugin(),
//     ectPlugin(),
//     advzipPlugin(),
//   ],
// });

function replaceStringPlugin(target: string, replacement: string) {
  return {
    name: 'vite-plugin-replace-char',
    transform(code: string, id: string) {
      // Filter for JS/TS source files, excluding node_modules
      if (/\.(js|ts|jsx|tsx)$/.test(id) && !id.includes('node_modules')) {
        return {
          code: code.replaceAll(target, replacement),
          map: null, // Pass sourcemap if needed
        };
      }
    },
  };
}


export default defineConfig({
  plugins: [
    replaceStringPlugin('■', 'w'), // Replaces all occurrences of '■' with 'W'
    replaceStringPlugin('─', 'p'), // Replaces all occurrences of '─' with 'p'
    replaceStringPlugin('const ', 'let '),
    ectPlugin(),
     advzipPlugin(),
  ],
  base: './', // Ensures relative paths are used in the generated HTML
  build: {
    ...defaultViteBuildOptions,
    target: 'esnext',          // Emits raw modern JS without bulky polyfills
    minify: 'terser',          // Switched to Terser for more aggressive compression
    terserOptions: {
      compress: {
        drop_console: true,    // Removes console.log statements
        drop_debugger: true,   // Removes debugger statements
        passes: 5,             // Re-runs optimizer 3 times for max reduction
        pure_getters: true,    // Optimizes property access
        booleans_as_integers: true,
        unsafe_arrows: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_methods: true,
        unsafe_proto: true,
      },
      mangle: {
        module: true,
        toplevel: true,
        properties:{
          regex: /^_/
        }
      },
      format: {
        comments: false,       // Strips all comments completely
        ecma: 2020
      },
    },
    sourcemap: false,          // Eliminates heavy sourcemap files
    cssCodeSplit: true,        // Isolates CSS to load only what is needed
    modulePreload: false,      // Removes injected HTML preload tags
    assetsInlineLimit: 0,      // Forces assets into separate files instead of base64 inlining
    rollupOptions: {
      output: {
        // Keeps files small and flat
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
      treeshake: true
    },
  },
});