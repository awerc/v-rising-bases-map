const path = require('path');

/** @type {import('eslint').Linter.BaseConfig} */
module.exports = {
  parser: '@typescript-eslint/parser',
  root: true,

  env: {
    es6: true,
    browser: false,
  },

  plugins: [
    '@typescript-eslint', //
    'import',
  ],

  extends: [
    'airbnb', //
    'airbnb-typescript',
    'prettier',
    'plugin:prettier/recommended',
    'next/core-web-vitals',
  ],

  ignorePatterns: [
    'dist/*', //
    'scripts/*',
    'eslint/*',
    'public/*',
    '*.config.js',
    'cpp/*',
    '.eslintrc.cjs',
    'src/prisma/stats/*',
  ],

  rules: {
    'react/no-danger': 'off',
    'react/destructuring-assignment': 'off',
    'no-continue': 'off',
    'no-plusplus': 'off',
    'no-await-in-loop': 'off',
    'no-console': 'off',
    'no-param-reassign': ['error', {props: true, ignorePropertyModificationsFor: ['config']}],
    'prefer-promise-reject-errors': 'off',
    'prefer-destructuring': 'off',
    'no-nested-ternary': 'off',

    'react/require-default-props': 'off',
    'react-hooks/exhaustive-deps': 'error',
    'react/jsx-props-no-spreading': 'off',
    'import/no-default-export': 'off',
    'import/prefer-default-export': 'off',
    'react/jsx-sort-props': [
      'error',
      {
        callbacksLast: true,
        shorthandFirst: true,
        ignoreCase: true,
        reservedFirst: true,
      },
    ],

    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        distinctGroup: false,
        'newlines-between': 'always',
        groups: [
          ['builtin', 'external'], //
          'internal',
          ['index', 'sibling', 'parent'],
          'type',
          'object',
        ],
      },
    ],

    'no-restricted-imports': [
      'error',
      {
        patterns: ['@/*/*/*', '../../../../**'],
      },
    ],

    '@typescript-eslint/object-curly-spacing': ['error', 'never'],
    '@typescript-eslint/ban-types': 'error',
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
      },
    ],
    '@typescript-eslint/array-type': [
      'error',
      {
        default: 'array',
        readonly: 'array',
      },
    ],
  },

  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
