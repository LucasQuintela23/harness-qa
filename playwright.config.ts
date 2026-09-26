import { defineConfig, devices } from '@playwright/test';

try { process.loadEnvFile(); } catch { /* sem .env: variaveis vem do ambiente */ }

const emCI = Boolean(process.env['CI']);

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
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
    { name: 'componente', testDir: './tests/componente' },
    { name: 'contrato', testDir: './tests/contrato' },
    { name: 'integracao', testDir: './tests/integracao' },
    { name: 'e2e', testDir: './tests/e2e', use: { ...devices['Desktop Chrome'] } },
    { name: 'acessibilidade', testDir: './tests/acessibilidade', use: { ...devices['Desktop Chrome'] } },
  ],
});
