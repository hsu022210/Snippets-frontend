import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'
import parser from '@typescript-eslint/parser'
import tseslint from '@typescript-eslint/eslint-plugin'

export default [
  { ignores: ['dist', 'coverage', 'eslint.config.ts'] },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        React: 'readonly',
        NodeJS: 'readonly',
        node: true, // 👈 This tells ESLint that Node.js globals (like `process`) are allowed,
        process: true,
      },
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
        project: ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir: '.',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
      // "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      // "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      'react-refresh/only-export-components': [
        'off',
        { allowConstantExport: true },
      ],
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/react-in-jsx-scope': 'off',
    },
  },
] 