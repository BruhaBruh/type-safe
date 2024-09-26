/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    '@bruhabruh/eslint-config',
    '@bruhabruh/eslint-config/server',
    '@bruhabruh/eslint-config/prettier',
    '@bruhabruh/eslint-config/import-order',
  ],
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.node.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    'new-cap': ['error', { capIsNewExceptions: ['Some', 'None', 'Ok', 'Err'] }],
  },
};
