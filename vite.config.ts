import { defineConfig } from 'vite';

function replaceCharPlugin(target: string, replacement: string) {
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
    replaceCharPlugin('■', 'W'), // Replaces all occurrences of '■' with 'W'
  ],
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