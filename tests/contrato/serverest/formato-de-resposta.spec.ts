import { UsuarioBuilder } from '../../../support/builders/UsuarioBuilder.js';
import { expect, test } from '../../../support/fixtures/serverest.js';

const tags = (cobertura: string): string[] => ['@tecnica:CHK', '@req:REQ-SR-008', '@risco:R-SR-08', `@cobertura:${cobertura}`];
const texto = expect.any(String) as unknown;
const numero = expect.any(Number) as unknown;

test('usuario consultado tem os campos e tipos do contrato', { tag: tags('SR-CTR-CHK-USR') }, async ({ usuarios, massa }) => {
  const usuario = await massa.usuario();
  const resposta = await usuarios.consultar(usuario.id);
  expect(resposta.corpo).toStrictEqual({ nome: texto, email: texto, password: texto, administrador: expect.stringMatching(/^(true|false)$/) as unknown, _id: texto });
});

test('produto consultado tem os campos e tipos do contrato', { tag: tags('SR-CTR-CHK-PRD') }, async ({ produtos, massa }) => {
  const admin = await massa.usuario({ administrador: true });
  const produto = await massa.produto(admin);
  const resposta = await produtos.consultar(produto.id);
  expect(resposta.corpo).toStrictEqual({ nome: texto, preco: numero, descricao: texto, quantidade: numero, _id: texto });
});

test('carrinho consultado tem os campos e tipos do contrato', { tag: tags('SR-CTR-CHK-CAR') }, async ({ carrinhos, massa }) => {
  const admin = await massa.usuario({ administrador: true });
  const cliente = await massa.usuario();
  const produto = await massa.produto(admin);
  const idCarrinho = await massa.carrinho(cliente, [{ idProduto: produto.id, quantidade: 1 }]);
  const resposta = await carrinhos.consultar(idCarrinho);
  expect(resposta.corpo).toStrictEqual({ produtos: [{ idProduto: texto, quantidade: numero, precoUnitario: numero }], precoTotal: numero, quantidadeTotal: numero, idUsuario: texto, _id: texto });
});

test('resposta de erro tem apenas o campo message', { tag: tags('SR-CTR-CHK-ERR') }, async ({ autenticacao }) => {
  const resposta = await autenticacao.autenticar({ email: UsuarioBuilder.emailUnico(), password: 'x' });
  expect(resposta.corpo).toStrictEqual({ message: texto });
});
