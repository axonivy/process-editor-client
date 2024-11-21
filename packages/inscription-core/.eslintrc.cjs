/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['../../configs/base.eslintrc.json'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json'
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off'
  }
};
