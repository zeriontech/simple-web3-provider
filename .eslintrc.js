module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:import/typescript'],
  plugins: ['@typescript-eslint'],
  rules: {
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-use-before-define.md#how-to-use
    // note you must disable the base rule as it can report incorrect errors
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: false, classes: false },
    ],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-unused-vars': 'off', // checked by TypeScript's 'noUnusedLocals'
        'react/prop-types': 'off', // Use TypeScript types and interfaces instead
      },
    },
    {
      files: ['.eslintrc.js', '.prettierrc.js'],
      env: { node: true },
      rules: {
        'import/no-commonjs': 'off',
        'import/no-nodejs-modules': 'off',
      },
    },
  ],
};
