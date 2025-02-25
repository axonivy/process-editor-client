import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'editor',
    include: ['src/**/*.test.ts?(x)'],
    environment: 'jsdom',
    setupFiles: ['src/test-utils/setupTests.ts'],
    css: false
  }
});
