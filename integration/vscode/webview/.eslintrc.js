/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['../../../configs/base.eslintrc.json', '../../../configs/warnings.eslintrc.json', '../../../configs/errors.eslintrc.json'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json'
  },
  rules: {
    'no-restricted-imports': [
      'warn',
      {
        name: 'sprotty',
        message: "The sprotty default exports are customized and reexported by GLSP. Please use '@eclipse-glsp/client' instead"
      },
      {
        name: 'sprotty-protocol',
        message: "The sprotty-protocol default exports are customized and reexported by GLSP. Please use '@eclipse-glsp/client' instead"
      }
    ]
  },
  ignorePatterns: ['webpack.config.js']
};
