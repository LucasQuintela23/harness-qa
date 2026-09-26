import { CarrinhoBuilder } from '../../support/builders/CarrinhoBuilder.js';
import type { Corpo } from '@compartilhado/contratos/RespostaHttp.js';
import { expect, test } from '../../support/fixtures/serverest.js';

const ESTOQUE = 5;
const CRIADO = { message: 'Cadastro realizado com sucesso' };

interface Caso { cobertura: string; quantidade: number; status: number; corpo: Corpo }

const limites: Caso[] = [
  { cobertura: 'SR-CAR-BV-0', quantidade: 0, status: 400, corpo: { 'produtos[0].quantidade': 'produtos[0].quantidade deve ser um número positivo' } },
  { cobertura: 'SR-CAR-BV-1', quantidade: 1, status: 201, corpo: CRIADO },
  { cobertura: 'SR-CAR-BV-2', quantidade: 2, status: 201, corpo: CRIADO },
  { cobertura: 'SR-CAR-BV-E4', quantidade: ESTOQUE - 1, status: 201, corpo: CRIADO },
  { cobertura: 'SR-CAR-BV-E5', quantidade: ESTOQUE, status: 201, corpo: CRIADO },
  { cobertura: 'SR-CAR-BV-E6', quantidade: ESTOQUE + 1, status: 400, corpo: { message: 'Produto não possui quantidade suficiente' } },
];

for (const caso of limites) {
  test(`carrinho com quantidade ${caso.quantidade} para estoque ${ESTOQUE} retorna ${caso.status}`, {
    tag: ['@tecnica:BVA3', '@req:REQ-SR-006', '@risco:R-SR-05', `@cobertura:${caso.cobertura}`],
  }, async ({ carrinhos, massa }) => {
    const admin = await massa.usuario({ administrador: true });
    const cliente = await massa.usuario();
    const produto = await massa.produto(admin, { quantidade: ESTOQUE });
    const resposta = await carrinhos.criar(new CarrinhoBuilder().item(produto.id, caso.quantidade).construir(), cliente.token);
    expect(resposta.status).toBe(caso.status);
    expect(resposta.corpo).toMatchObject(caso.corpo);
  });
}

const tagsDt = (cobertura: string): string[] => ['@tecnica:DT', '@req:REQ-SR-006', '@risco:R-SR-05', `@cobertura:${cobertura}`];

test('carrinho com token valido e produtos distintos existentes retorna 201', { tag: tagsDt('SR-CAR-DT-R1') }, async ({ carrinhos, massa }) => {
  const admin = await massa.usuario({ administrador: true });
  const cliente = await massa.usuario();
  const primeiro = await massa.produto(admin);
  const segundo = await massa.produto(admin);
  const resposta = await carrinhos.criar(new CarrinhoBuilder().item(primeiro.id).item(segundo.id).construir(), cliente.token);
  expect(resposta.status).toBe(201);
  expect(resposta.corpo).toMatchObject(CRIADO);
});

test('carrinho sem token retorna 401', { tag: tagsDt('SR-CAR-DT-R2') }, async ({ carrinhos, massa }) => {
  const admin = await massa.usuario({ administrador: true });
  const produto = await massa.produto(admin);
  const resposta = await carrinhos.criar(new CarrinhoBuilder().item(produto.id).construir());
  expect(resposta.status).toBe(401);
  expect(resposta.corpo).toMatchObject({ message: 'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais' });
});

test('carrinho com produto inexistente retorna 400', { tag: tagsDt('SR-CAR-DT-R3') }, async ({ carrinhos, massa }) => {
  const cliente = await massa.usuario();
  const resposta = await carrinhos.criar(new CarrinhoBuilder().item('abcdefghij123456').construir(), cliente.token);
  expect(resposta.status).toBe(400);
  expect(resposta.corpo).toMatchObject({ message: 'Produto não encontrado' });
});

test('carrinho com produto duplicado no corpo retorna 400', { tag: tagsDt('SR-CAR-DT-R4') }, async ({ carrinhos, massa }) => {
  const admin = await massa.usuario({ administrador: true });
  const cliente = await massa.usuario();
  const produto = await massa.produto(admin);
  const resposta = await carrinhos.criar(new CarrinhoBuilder().item(produto.id).item(produto.id).construir(), cliente.token);
  expect(resposta.status).toBe(400);
  expect(resposta.corpo).toMatchObject({ message: 'Não é permitido possuir produto duplicado' });
});
