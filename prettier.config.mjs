/** @type {import('prettier').Config} */
const prettierConfig = {
  semi: true,
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'always',
  plugins: ['@ianvs/prettier-plugin-sort-imports'],

  // Import order: React → 3rd party → internal layers (coarse → fine)
  importOrder: [
    '^(react/(.*)$)|^(react$)',      // 1. React core
    '<THIRD_PARTY_MODULES>',          // 2. npm packages (ag-grid, axios, @mui, zod…)
    '',
    '^@/i18n(.*)$',                  // 3. i18n (foundation, used everywhere)
    '^@/shared/(.*)$',               // 4. Shared components, hooks, utils
    '^@/features/(.*)$',             // 5. Feature modules
    '^@/layouts/(.*)$',              // 6. Layouts
    '^@/pages/(.*)$',                // 7. Pages
    '^@/providers/(.*)$',            // 8. Providers
    '^@/router/(.*)$',               // 9. Router
    '^@/config/(.*)$',               // 10. Config
    '^@/constants/(.*)$',            // 11. Constants
    '',
    '^[./]',                         // 12. Relative imports
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.0.0',
};

export default prettierConfig;
