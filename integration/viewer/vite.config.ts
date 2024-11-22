import { defineConfig } from 'vite';
import { resolve } from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => ({
  plugins: [tsconfigPaths()],
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 5000
  },
  esbuild: {
    target: 'esnext',
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true,
        emitDecoratorMetadata: true
      }
    }
  },
  server: {
    port: 3001,
    open: false,
    sourcemapIgnoreList(sourcePath, sourcemapPath) {
      return sourcePath.includes('node_modules') && !sourcePath.includes('@eclipse-glsp') && !sourcePath.includes('@axonivy');
    }
  },
  preview: {
    port: 4001
  },
  resolve: {
    alias: {
      path: 'path-browserify',
      '@axonivy/process-editor': resolve(__dirname, '../../packages/editor/src'),
      '@axonivy/process-editor-protocol': resolve(__dirname, '../../packages/protocol/src')
    }
  },
  base: './'
}));
