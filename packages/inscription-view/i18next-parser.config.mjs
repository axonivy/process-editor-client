export default {
  defaultNamespace: 'inscription-view',
  defaultValue: '__MISSING_TRANSLATION__',
  keepRemoved: false,
  locales: ['en'],
  output: 'src/translation/$NAMESPACE/$LOCALE.json',
  pluralSeparator: '_',
  input: ['src/**/*.ts', 'src/**/*.tsx'],
  verbose: false,
  sort: true
};
