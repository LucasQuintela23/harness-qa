import { ProdutoBuilder } from '../../support/builders/ProdutoBuilder.js';
import type { Corpo } from '@compartilhado/contratos/RespostaHttp.js';
import { expect, test } from '../../support/fixtures/serverest.js';

const CRIADO = { message: 'Cadastro realizado com sucesso' };

interface Caso { cobertura: string; tecnica: 'EP' | 'BVA2'; titulo: string; ajuste: Corpo; status: number; corpo: Corpo }

const casos: Caso[] = [
  { cobertura: 'SR-PRD-EP-V', tecnica: 'EP', titulo: 'produto com todos os campos validos', ajuste: {}, status: 201, corpo: CRIADO },
  { cobertura: 'SR-PRD-BV-P0', tecnica: 'BVA2', titulo: 'preco 0 (abaixo do minimo)', ajuste: { preco: 0 }, status: 400, corpo: { preco: 'preco deve ser um número positivo' } },
  { cobertura: 'SR-PRD-BV-P1', tecnica: 'BVA2', titulo: 'preco 1 (minimo)', ajuste: { preco: 1 }, status: 201, corpo: CRIADO },
  { cobertura: 'SR-PRD-BV-Q-1', tecnica: 'BVA2', titulo: 'quantidade -1 (abaixo do minimo)', ajuste: { quantidade: -1 }, status: 400, corpo: { quantidade: 'quantidade deve ser maior ou igual a 0' } },
  { cobertura: 'SR-PRD-BV-Q0', tecnica: 'BVA2', titulo: 'quantidade 0 (minimo)', ajuste: { quantidade: 0 }, status: 201, corpo: CRIADO },
  { cobertura: 'SR-PRD-EP-PRECO-DEC', tecnica: 'EP', titulo: 'preco decimal', ajuste: { preco: 1.5 }, status: 400, corpo: { preco: 'preco deve ser um inteiro' } },
  { cobertura: 'SR-PRD-EP-PRECO-TXT', tecnica: 'EP', titulo: 'preco texto', ajuste: { preco: 'abc' }, status: 400, corpo: { preco: 'preco deve ser um número' } },
  { cobertura: 'SR-PRD-EP-NOME-VAZIO', tecnica: 'EP', titulo: 'nome vazio', ajuste: { nome: '' }, status: 400, corpo: { nome: 'nome não pode ficar em branco' } },
  { cobertura: 'SR-PRD-EP-DESC-VAZIA', tecnica: 'EP', titulo: 'descricao vazia', ajuste: { descricao: '' }, status: 400, corpo: { descricao: 'descricao não pode ficar em branco' } },
];

for (const caso of casos) {
  test(`cadastro de ${caso.titulo} retorna ${caso.status}`, {
    tag: [`@tecnica:${caso.tecnica}`, '@req:REQ-SR-004', '@risco:R-SR-04', `@cobertura:${caso.cobertura}`],
  }, async ({ produtos, massa }) => {
    const admin = await massa.usuario({ administrador: true });
    const resposta = await produtos.criar(new ProdutoBuilder().comAjustes(caso.ajuste).construir(), admin.token);
    massa.adotarSeCriado('produto', resposta, admin);
    expect(resposta.status).toBe(caso.status);
    expect(resposta.corpo).toMatchObject(caso.corpo);
  });
}

test('rejeita cadastro de produto com nome ja existente com 400', {
  tag: ['@tecnica:EP', '@req:REQ-SR-004', '@risco:R-SR-04', '@cobertura:SR-PRD-EP-NOME-DUP'],
}, async ({ produtos, massa }) => {
  const admin = await massa.usuario({ administrador: true });
  const existente = await massa.produto(admin);
  const resposta = await produtos.criar(new ProdutoBuilder().com('nome', existente.nome).construir(), admin.token);
  expect(resposta.status).toBe(400);
  expect(resposta.corpo).toStrictEqual({ message: 'Já existe produto com esse nome' });
});
