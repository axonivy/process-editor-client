import tseslint from 'typescript-eslint';
import config from '@axonivy/eslint-config';
import i18next from 'eslint-plugin-i18next';

export default tseslint.config(
  ...config.base,
  // TypeScript recommended configs
  {
    name: 'typescript-eslint',
    languageOptions: {
      parserOptions: {
        project: true, // Uses tsconfig.json from current directory
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  // Project specific configs
  {
    name: 'general',
    rules: {
      '@typescript-eslint/no-namespace': 'off'
    }
  },
  {
    ignores: ['**/i18next-parser.config.*']
  },
  {
    name: 'packages/editor',
    rules: {
      'react/no-unknown-property': 'off'
    }
  },
  {
    ...i18next.configs['flat/recommended'],
    files: ['packages/inscription-*/src/**/*.{ts,tsx}'],
    ignores: ['**/*.{test,spec}.{ts,tsx}'],
    rules: {
      'i18next/no-literal-string': [
        'warn',
        {
          mode: 'jsx-only',
          'jsx-attributes': { include: ['label', 'aria-label', 'title', 'name'] }
        }
      ]
    }
  }
);
