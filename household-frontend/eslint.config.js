import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // The current codebase uses `any` in multiple places (API + charts).
      // Treat as warning to avoid blocking dev.
      '@typescript-eslint/no-explicit-any': 'warn',

      // Context files export both provider + hook; allow fast-refresh warning.
      'react-refresh/only-export-components': 'off',

      // Avoid blocking on unused vars during rapid iteration.
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
])
