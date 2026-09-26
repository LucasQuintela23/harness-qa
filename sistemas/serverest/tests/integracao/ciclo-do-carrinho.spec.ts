import { CarrinhoBuilder } from '../../support/builders/CarrinhoBuilder.js';
import { expect, idDe, test } from '../../support/fixtures/serverest.js';

const tags = (cobertura: string): string[] => ['@tecnica:ST', '@req:REQ-SR-007', '@risco:R-SR-06', `@cobertura:${cobertura}`];
const SEM_CARRINHO = { message: 'Não foi encontrado carrinho para esse usuário' };
const ESTOQUE = 5;
const NO_CARRINHO = 2;

test('SEM_CARRINHO + criar leva a COM_CARRINHO', { tag: tags('SR-CAR-ST-T1') }, async ({ carrinhos, massa }) => {
  const admin = await massa.usuario({ administrador: true });
  const cliente = await massa.usuario();
  const produto = await massa.produto(admin);
  const criado = await carrinhos.criar(new CarrinhoBuilder().item(produto.id).construir(), cliente.token);
  const consultado = await carrinhos.consultar(idDe(criado));
  expect(criado.status).toBe(201);
  expect(consultado.status).toBe(200);
});

test('COM_CARRINHO + concluir leva a SEM_CARRINHO', { tag: tags('SR-CAR-ST-T2') }, async ({ carrinhos, massa }) => {
  const admin = await massa.usuario({ administrador: true });
  const cliente = await massa.usuario();
  const produto = await massa.produto(admin);
  const idCarrinho = await massa.carrinho(cliente, [{ idProduto: produto.id, quantidade: 1 }]);
  const resposta = await carrinhos.concluir(cliente.token);
  const consultado = await carrinhos.consultar(idCarrinho);
  expect(resposta.corpo).toStrictEqual({ message: 'Registro excluído com sucesso' });
  expect(consultado.status).toBe(400);
});

test('COM_CARRINHO + cancelar leva a SEM_CARRINHO', { tag: tags('SR-CAR-ST-T3') }, async ({ carrinhos, massa }) => {
  const admin = await massa.usuario({ administrador: true });
  const cliente = await massa.usuario();
  const produto = await massa.produto(admin);
  const idCarrinho = await massa.carrinho(cliente, [{ idProduto: produto.id, quantidade: 1 }]);
  const resposta = await carrinhos.cancelar(cliente.token);
  const consultado = await carrinhos.consultar(idCarrinho);
  expect(resposta.corpo).toStrictEqual({ message: 'Registro excluído com sucesso. Estoque dos produtos reabastecido' });
  expect(consultado.status).toBe(400);
});

test('COM_CARRINHO + criar e rejeitado (um carrinho por usuario)', { tag: tags('SR-CAR-ST-X1') }, async ({ carrinhos, massa }) => {
  const admin = await massa.usuario({ administrador: true });
  const cliente = await massa.usuario();
  const produto = await massa.produto(admin);
  await massa.carrinho(cliente, [{ idProduto: produto.id, quantidade: 1 }]);
  const resposta = await carrinhos.criar(new CarrinhoBuilder().item(produto.id).construir(), cliente.token);
  expect(resposta.status).toBe(400);
  expect(resposta.corpo).toMatchObject({ message: 'Não é permitido ter mais de 1 carrinho' });
});

test('SEM_CARRINHO + concluir nao tem efeito', { tag: tags('SR-CAR-ST-X2') }, async ({ carrinhos, massa }) => {
  const cliente = await massa.usuario();
  const resposta = await carrinhos.concluir(cliente.token);
  expect(resposta.status).toBe(200);
  expect(resposta.corpo).toStrictEqual(SEM_CARRINHO);
});

test('SEM_CARRINHO + cancelar nao tem efeito', { tag: tags('SR-CAR-ST-X3') }, async ({ carrinhos, massa }) => {
  const cliente = await massa.usuario();
  const resposta = await carrinhos.cancelar(cliente.token);
  expect(resposta.status).toBe(200);
  expect(resposta.corpo).toStrictEqual(SEM_CARRINHO);
});

test('concluir mantem o estoque reduzido', { tag: tags('SR-CAR-ST-E1') }, async ({ carrinhos, produtos, massa }) => {
  const admin = await massa.usuario({ administrador: true });
  const cliente = await massa.usuario();
  const produto = await massa.produto(admin, { quantidade: ESTOQUE });
  await massa.carrinho(cliente, [{ idProduto: produto.id, quantidade: NO_CARRINHO }]);
  await carrinhos.concluir(cliente.token);
  const consultado = await produtos.consultar(produto.id);
  expect(consultado.corpo).toMatchObject({ quantidade: ESTOQUE - NO_CARRINHO });
});

test('cancelar repoe o estoque', { tag: tags('SR-CAR-ST-E2') }, async ({ carrinhos, produtos, massa }) => {
  const admin = await massa.usuario({ administrador: true });
  const cliente = await massa.usuario();
  const produto = await massa.produto(admin, { quantidade: ESTOQUE });
  await massa.carrinho(cliente, [{ idProduto: produto.id, quantidade: NO_CARRINHO }]);
  await carrinhos.cancelar(cliente.token);
  const consultado = await produtos.consultar(produto.id);
  expect(consultado.corpo).toMatchObject({ quantidade: ESTOQUE });
});
