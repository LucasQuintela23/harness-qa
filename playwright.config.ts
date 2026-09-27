import { defineConfig, devices } from '@playwright/test';

const inCI = Boolean(process.env['CI']);

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: inCI,
  retries: inCI ? 1 : 0,
  ...(inCI ? { workers: 4 } : {}),
  reporter: [['list'], ['json', { outputFile: 'reports/playwright.json' }]],
  use: {
    baseURL: process.env['BASE_URL'],
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'component', testDir: './tests/component' },
    { name: 'contract', testDir: './tests/contract' },
    { name: 'integration', testDir: './tests/integration' },
    { name: 'e2e', testDir: './tests/e2e', use: { ...devices['Desktop Chrome'] } },
    { name: 'accessibility', testDir: './tests/accessibility', use: { ...devices['Desktop Chrome'] } },
  ],
});
