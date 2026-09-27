import type { EnvironmentProvider } from '../contracts/EnvironmentProvider.js';

export class EnvironmentVariablesProvider implements EnvironmentProvider {
  baseUrl(): string { return this.require('BASE_URL'); }
  apiUrl(): string { return this.require('API_URL'); }

  private require(name: string): string {
    const value = process.env[name];
    if (value === undefined || value === '') throw new Error(`Environment variable ${name} is not set (see .env.example).`);
    return value;
  }
}
