import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Ensures relative paths are used in the generated HTML
  build: {
    target: 'esnext',          // Emits raw modern JS without bulky polyfills
    minify: 'terser',          // Switched to Terser for more aggressive compression
    terserOptions: {
      compress: {
        drop_console: true,    // Removes console.log statements
        drop_debugger: true,   // Removes debugger statements
        passes: 5,             // Re-runs optimizer 3 times for max reduction
        pure_getters: true,    // Optimizes property access
      },
      format: {
        comments: false,       // Strips all comments completely
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
      treeshake: {
        preset: 'recommended', // Applies strict tree-shaking rules
        moduleSideEffects: false, // Assumes modules have no side effects
      },
    },
  },
});