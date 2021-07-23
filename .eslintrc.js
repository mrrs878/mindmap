/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-22 17:22:18
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-23 11:09:40
 * @FilePath: \mindmap\.eslintrc.js
 */
module.exports = {
  extends: [
    'airbnb-typescript',
    'airbnb/hooks',
  ],
  parserOptions: {
    project: './tsconfig.json',
    createDefaultProgram: true,
  },
  rules: {
    'linebreak-style': ['off', 'window'],
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-underscore-dangle': ['error', { allow: ['_children'] }],
    'react-hooks/exhaustive-deps': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    '@typescript-eslint/no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'react/destructuring-assignment': [0],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'property',
        format: ['strictCamelCase'],
        filter: {
          regex: '^(_children|_id)$',
          match: false,
        },
      },
    ],
    'react/react-in-jsx-scope': 0,
    'no-param-reassign': 0,
    '@typescript-eslint/space-infix-ops': 0,
    'react/no-this-in-sfc': 0,
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
    },
  ],
};
