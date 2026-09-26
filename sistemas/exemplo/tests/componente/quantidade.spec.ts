import { test, expect } from '@playwright/test';
import { quantidadeEhValida } from '../../src/pedido.js';

interface Caso { titulo: string; quantidade: number; esperado: boolean; tecnica: 'EP' | 'BVA3'; cobertura: string }

const casos: Caso[] = [
  { titulo: 'aceita inteiro dentro da faixa', quantidade: 5, esperado: true, tecnica: 'EP', cobertura: 'EX-EP-V' },
  { titulo: 'rejeita menor que o minimo', quantidade: -3, esperado: false, tecnica: 'EP', cobertura: 'EX-EP-I1' },
  { titulo: 'rejeita maior que o maximo', quantidade: 50, esperado: false, tecnica: 'EP', cobertura: 'EX-EP-I2' },
  { titulo: 'rejeita nao inteiro', quantidade: 2.5, esperado: false, tecnica: 'EP', cobertura: 'EX-EP-I3' },
  { titulo: 'rejeita 0 (abaixo do limite inferior)', quantidade: 0, esperado: false, tecnica: 'BVA3', cobertura: 'EX-BV-0' },
  { titulo: 'aceita 1 (limite inferior)', quantidade: 1, esperado: true, tecnica: 'BVA3', cobertura: 'EX-BV-1' },
  { titulo: 'aceita 2 (acima do limite inferior)', quantidade: 2, esperado: true, tecnica: 'BVA3', cobertura: 'EX-BV-2' },
  { titulo: 'aceita 9 (abaixo do limite superior)', quantidade: 9, esperado: true, tecnica: 'BVA3', cobertura: 'EX-BV-9' },
  { titulo: 'aceita 10 (limite superior)', quantidade: 10, esperado: true, tecnica: 'BVA3', cobertura: 'EX-BV-10' },
  { titulo: 'rejeita 11 (acima do limite superior)', quantidade: 11, esperado: false, tecnica: 'BVA3', cobertura: 'EX-BV-11' },
];

for (const caso of casos) {
  test(`quantidade: ${caso.titulo}`, {
    tag: [`@tecnica:${caso.tecnica}`, '@req:REQ-EX-001', '@risco:R-EX-001', `@cobertura:${caso.cobertura}`],
  }, () => {
    expect(quantidadeEhValida(caso.quantidade)).toBe(caso.esperado);
  });
}
