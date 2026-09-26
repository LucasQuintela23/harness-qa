import type { ProvedorDeAmbiente } from '../contratos/ProvedorDeAmbiente.js';

export class ProvedorDeAmbienteVariaveis implements ProvedorDeAmbiente {
  urlBase(): string { return this.exigir('BASE_URL'); }
  urlApi(): string { return this.exigir('API_URL'); }

  private exigir(nome: string): string {
    const valor = process.env[nome];
    if (valor === undefined || valor === '') throw new Error(`Variavel de ambiente ${nome} nao definida (veja .env.example).`);
    return valor;
  }
}
