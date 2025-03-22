/**
 * .eslint.js
 *
 * ESLint configuration file.
 */

import prettier from 'eslint-plugin-prettier';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,ts,mts,tsx}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  // Add TypeScript parsing for .ts files
  {
    files: ['**/*.{ts,mts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },

  {
    plugins: {
      prettier: prettier,
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          tabWidth: 2,
          singleQuote: true,
          htmlWhitespaceSensitivity: 'ignore',
          endOfLine: 'auto',
          printWidth: 120,
          singleAttributePerLine: false,
        },
      ],
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
      quotes: ['warn', 'single'],
      'no-trailing-spaces': ['error', { skipBlankLines: false }],
      indent: 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
];
