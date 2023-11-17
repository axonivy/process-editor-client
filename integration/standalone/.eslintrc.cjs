/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['../../configs/base.eslintrc.json', '../../configs/warnings.eslintrc.json', '../../configs/errors.eslintrc.json'],
  ignorePatterns: ['**/{css,node_modules,lib}', 'vite.*.js', 'playwright.config.ts'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json'
  }
};
