import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default tseslint.config(
  { ignores: ['node_modules/**', 'coverage/**', 'reports/**', 'test-results/**', '.stryker-tmp/**'] },
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: { parserOptions: { projectService: { allowDefaultProject: ['*.js'] }, tsconfigRootDir: import.meta.dirname } },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    },
  },
  {
    files: ['**/*.js'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ['sistemas/**/tests/**/*.spec.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-conditional-in-test': 'error',
      'playwright/no-conditional-expect': 'error',
      'playwright/no-skipped-test': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/expect-expect': 'error',
      'playwright/max-expects': ['error', { max: 3 }],
      'playwright/no-useless-not': 'error',
      'playwright/prefer-strict-equal': 'error',
      'playwright/valid-title': 'error',
      // Tags montadas por helper/dados (testes orientados a dados): validadas em execucao pelo sensor `rastreabilidade`, que le as tags de `playwright test --list`.
      'playwright/valid-test-tags': 'off',
      'playwright/no-hooks': 'off',
    },
  },
  {
    files: ['sistemas/**/tests/**/*.spec.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{ group: ['**/page-objects/*Impl*', '**/clients/*Http*'], message: 'Testes dependem de contratos em support/contratos do sistema, nao de implementacoes. Injete via fixture.' }],
      }],
    },
  },
);
