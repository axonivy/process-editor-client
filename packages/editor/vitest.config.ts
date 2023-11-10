import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    dir: 'src',
    include: ['**/*.test.ts?(x)'],
    alias: {
      '@axonivy/process-editor-protocol': resolve(__dirname, '../../packages/protocol/src')
    },
    environment: 'happy-dom',
    setupFiles: ['src/test-utils/setupTests.ts'],
    css: false,
    reporters: process.env.CI ? ['basic', 'junit'] : ['default'],
    outputFile: 'report.xml'
  }
});
