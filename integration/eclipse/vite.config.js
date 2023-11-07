/** @type {import('vite').UserConfig} */
import { defineConfig } from 'vite';
import { resolve } from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
  const config = {
    plugins: [tsconfigPaths()],
    build: {
      outDir: 'build',
      chunkSizeWarningLimit: 5000,
      rollupOptions: {
        output: {
          manualChunks: id => {
            if (id.includes('monaco-languageclient')) {
              return 'monaco';
            }
          }
        }
      }
    },
    server: {
      port: 3000,
      open: false,
      sourcemapIgnoreList(sourcePath, sourcemapPath) {
        return sourcePath.includes('node_modules') && !sourcePath.includes('@eclipse-glsp') && !sourcePath.includes('@axonivy');
      }
    },
    base: './',
    resolve: {
      alias: {
        path: 'path-browserify',
        '@axonivy/process-editor': resolve(__dirname, '../../packages/editor/src'),
        '@axonivy/process-editor-inscription': resolve(__dirname, '../../packages/inscription/src'),
        '@axonivy/process-editor-protocol': resolve(__dirname, '../../packages/protocol/src')
      }
    }
  };
  return config;
});
