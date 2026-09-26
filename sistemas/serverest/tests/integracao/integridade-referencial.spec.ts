import { expect, test } from '../../support/fixtures/serverest.js';

const tags = (cobertura: string): string[] => ['@tecnica:DT', '@req:REQ-SR-005', '@risco:R-SR-07', `@cobertura:${cobertura}`];
const EXCLUIDO = { message: 'Registro excluído com sucesso' };

test('nao exclui produto que faz parte de carrinho', { tag: tags('SR-INT-DT-R1') }, async ({ produtos, massa }) => {
  const admin = await massa.usuario({ administrador: true });
  const cliente = await massa.usuario();
  const produto = await massa.produto(admin);
  await massa.carrinho(cliente, [{ idProduto: produto.id, quantidade: 1 }]);
  const resposta = await produtos.remover(produto.id, admin.token);
  expect(resposta.status).toBe(400);
  expect(resposta.corpo).toMatchObject({ message: 'Não é permitido excluir produto que faz parte de carrinho' });
});

test('nao exclui usuario com carrinho cadastrado', { tag: tags('SR-INT-DT-R2') }, async ({ usuarios, massa }) => {
  const admin = await massa.usuario({ administrador: true });
  const cliente = await massa.usuario();
  const produto = await massa.produto(admin);
  await massa.carrinho(cliente, [{ idProduto: produto.id, quantidade: 1 }]);
  const resposta = await usuarios.remover(cliente.id);
  expect(resposta.status).toBe(400);
  expect(resposta.corpo).toMatchObject({ message: 'Não é permitido excluir usuário com carrinho cadastrado' });
});

test('exclui produto que nao esta em carrinho', { tag: tags('SR-INT-DT-R3') }, async ({ produtos, massa }) => {
  const admin = await massa.usuario({ administrador: true });
  const produto = await massa.produto(admin);
  const resposta = await produtos.remover(produto.id, admin.token);
  expect(resposta.status).toBe(200);
  expect(resposta.corpo).toStrictEqual(EXCLUIDO);
});

test('exclui usuario sem carrinho', { tag: tags('SR-INT-DT-R4') }, async ({ usuarios, massa }) => {
  const cliente = await massa.usuario();
  const resposta = await usuarios.remover(cliente.id);
  expect(resposta.status).toBe(200);
  expect(resposta.corpo).toStrictEqual(EXCLUIDO);
});
