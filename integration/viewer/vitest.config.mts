import { defineProject } from 'vitest/config';
import { resolve } from 'path';

export default defineProject({
  test: {
    name: 'viewer',
    include: ['src/**/*.test.ts?(x)'],
    alias: {
      '@axonivy/process-editor-protocol': resolve(__dirname, '../../packages/protocol/src')
    },
    globals: true,
    css: false
  }
});
