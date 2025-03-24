export default {
  defaultNamespace: 'process-editor',
  defaultValue: '__MISSING_TRANSLATION__',
  keepRemoved: false,
  locales: ['en', 'de'],
  output: 'packages/editor/src/translation/$NAMESPACE/$LOCALE.json',
  pluralSeparator: '_',
  input: ['packages/*/src/**/*.{ts,tsx}'],
  verbose: false,
  sort: true
};
