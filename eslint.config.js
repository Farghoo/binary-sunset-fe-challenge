// @ts-check
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';

// =============================================================================
// ESLint Flat Config — Vite + React + TypeScript
//
// Rule categories:
//  1. Code quality   — bugs, bad patterns
//  2. TypeScript     — strict typing, no any, consistent imports
//  3. React          — hooks rules, JSX patterns
//  4. Accessibility  — WCAG AA via jsx-a11y
//  5. SPA guards     — forbid process.env, Node.js globals
//  6. Architecture   — import boundary enforcement (SOLID)
//  7. Style          — delegated to Prettier
// =============================================================================

/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [
  // ── Base recommended ─────────────────────────────────────────────────────
  js.configs.recommended,

  // ── Global ignores ───────────────────────────────────────────────────────
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      'cypress/videos/**',
      'cypress/screenshots/**',
      '*.config.js',       // vite.config, jest.config — Node context
      '*.config.ts',
      '*.config.mjs',
      'commitlint.config.js',
    ],
  },

  // ── Main app config (src/**) ─────────────────────────────────────────────
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,    // window, document, fetch, etc.
        // NO globals.node — process is not available in Vite SPA runtime
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react':              reactPlugin,
      'react-hooks':        reactHooksPlugin,
      'jsx-a11y':           jsxA11y,
      'prettier':           prettierPlugin,
      '@stylistic':         stylistic,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // ── 1. Code quality ────────────────────────────────────────────────
      'no-console':           'error',
      'eqeqeq':               ['error', 'always'],
      'no-var':               'error',
      'prefer-const':         'error',
      'no-duplicate-imports': 'error',
      'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],

      // ── 2. TypeScript ──────────────────────────────────────────────────
      ...tsPlugin.configs['recommended'].rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any':          'error',
      '@typescript-eslint/no-non-null-assertion':    'warn',
      '@typescript-eslint/consistent-type-imports':  [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',

      // ── 3. React ───────────────────────────────────────────────────────
      'react/react-in-jsx-scope':     'off', // React 17+ JSX transform
      'react/prop-types':             'off', // TypeScript handles this
      'react/self-closing-comp':      ['error', { component: true, html: true }],
      'react/jsx-no-useless-fragment': 'warn',
      'react-hooks/rules-of-hooks':   'error',
      'react-hooks/exhaustive-deps':  'warn',

      // ── 4. Accessibility ───────────────────────────────────────────────
      ...jsxA11y.configs.recommended.rules,

      // ── 5. SPA guards — forbid Node.js globals ─────────────────────────
      // process.env does not exist in browser runtime.
      // Vite replaces it statically, but that's fragile & conceptually wrong.
      // Use import.meta.env.DEV / import.meta.env.PROD instead.
      'no-restricted-syntax': [
        'error',
        {
          selector: 'MemberExpression[object.name="process"][property.name="env"]',
          message:
            'Do not use process.env in Vite SPA — use import.meta.env instead (e.g. import.meta.env.DEV).',
        },
        {
          selector: 'Identifier[name="process"]',
          message:
            '"process" is a Node.js global unavailable in the browser. Use import.meta.env for environment checks.',
        },
      ],

      // ── 6. Architecture — import boundaries ───────────────────────────
      // Prevents accidental coupling between layers.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            // Direct deep imports from feature internals → must go through barrel
            {
              group: ['@/features/*/context/*', '@/features/*/hooks/*'],
              message:
                'Import from the feature barrel (e.g. @/features/orders) instead of deep paths.',
            },
          ],
        },
      ],

      // ── 7. Prettier (must be last) ─────────────────────────────────────
      'prettier/prettier': 'error',
    },
  },

  // ── shared/ boundary — must not import from features/ ────────────────────
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*', '../features/*', '../../features/*', '../../../features/*'],
              message:
                'Shared components must not import from features — keep shared/ domain-agnostic (DIP).',
            },
          ],
        },
      ],
    },
  },

  // ── i18n locale files — allow any string values ───────────────────────────
  {
    files: ['src/i18n/locales/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  // ── Test files ────────────────────────────────────────────────────────────
  {
    files: ['src/__tests__/**/*.{ts,tsx}', '**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
    },
    rules: {
      'no-console':                        'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-restricted-syntax':              'off',
    },
  },

  // ── Cypress E2E ───────────────────────────────────────────────────────────
  {
    files: ['cypress/**/*.{ts,js}'],
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      'no-console':           'off',
      'no-restricted-syntax': 'off',
    },
  },
];

export default config;
