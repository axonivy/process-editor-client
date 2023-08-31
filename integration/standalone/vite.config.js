/** @type {import('vite').UserConfig} */
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
  const config = {
    plugins: [tsconfigPaths()],
    build: { outDir: 'build', chunkSizeWarningLimit: 5000 },
    server: {
      port: 3000,
      open: false,
      sourcemapIgnoreList(sourcePath, sourcemapPath) {
        return sourcePath.includes('node_modules') && !sourcePath.includes('node_modules/@eclipse-glsp');
      }
    },
    resolve: {
      alias: { path: 'path-browserify' }
    },
    base: './'
  };
  return config;
});
