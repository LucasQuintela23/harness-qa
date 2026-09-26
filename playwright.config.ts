import { defineConfig, devices } from '@playwright/test';

try { process.loadEnvFile(); } catch { /* sem .env: variaveis vem do ambiente */ }

const emCI = Boolean(process.env['CI']);

export default defineConfig({
  testDir: './sistemas',
  testMatch: '**/tests/**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: emCI,
  retries: emCI ? 1 : 0,
  ...(emCI ? { workers: 4 } : {}),
  reporter: [['list'], ['json', { outputFile: 'reports/playwright.json' }]],
  use: {
    baseURL: process.env['BASE_URL'],
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'componente', testMatch: '**/tests/componente/**/*.spec.ts' },
    { name: 'contrato', testMatch: '**/tests/contrato/**/*.spec.ts' },
    { name: 'integracao', testMatch: '**/tests/integracao/**/*.spec.ts' },
    { name: 'e2e', testMatch: '**/tests/e2e/**/*.spec.ts', use: { ...devices['Desktop Chrome'] } },
    { name: 'acessibilidade', testMatch: '**/tests/acessibilidade/**/*.spec.ts', use: { ...devices['Desktop Chrome'] } },
  ],
});
