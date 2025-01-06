/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['../../configs/base.eslintrc.json'],
  ignorePatterns: ['**/{css,node_modules,lib,server}', 'vitest.config.*ts'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json'
  },
  rules: {
    'react/no-unknown-property': 'off'
  }
};
