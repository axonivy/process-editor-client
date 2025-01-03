/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['../../configs/base.eslintrc.json'],
  ignorePatterns: ['**/{app,css,node_modules,lib,server}', 'vite.*.ts'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json'
  }
};
