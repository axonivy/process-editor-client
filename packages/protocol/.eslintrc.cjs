/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['../../configs/base.eslintrc.json'],
  ignorePatterns: ['**/{css,node_modules,lib,server}'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json'
  }
};
