import mainConfig from '@bruhabruh/eslint-config';
import importOrderConfig from '@bruhabruh/eslint-config/import-order.js';
import prettierConfig from '@bruhabruh/eslint-config/prettier.js';
import serverConfig from '@bruhabruh/eslint-config/server.js';

export default [
  {
    ignores: ['dist', 'node_modules', 'coverage'],
  },
  ...mainConfig,
  ...serverConfig,
  ...importOrderConfig,
  ...prettierConfig,
  {
    rules: {
      'new-cap': [
        'error',
        { capIsNewExceptions: ['Some', 'None', 'Ok', 'Err'] },
      ],
    },
  },
];
