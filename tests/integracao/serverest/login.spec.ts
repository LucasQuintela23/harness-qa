import { UsuarioBuilder } from '../../../support/builders/UsuarioBuilder.js';
import { expect, test } from '../../../support/fixtures/serverest.js';

const tags = (tecnica: string, cobertura: string): string[] => [`@tecnica:${tecnica}`, '@req:REQ-SR-001', '@risco:R-SR-01', `@cobertura:${cobertura}`];
const MENSAGEM_INVALIDO = { message: 'Email e/ou senha inválidos' };

test('login com email cadastrado e senha correta retorna 200 e token Bearer', { tag: tags('DT', 'SR-LOG-DT-R1') }, async ({ autenticacao, massa }) => {
  const usuario = await massa.usuario();
  const resposta = await autenticacao.autenticar({ email: usuario.email, password: usuario.senha });
  expect(resposta.status).toBe(200);
  expect(resposta.corpo).toMatchObject({ message: 'Login realizado com sucesso', authorization: expect.stringMatching(/^Bearer .+/) });
});

test('login com email cadastrado e senha errada retorna 401', { tag: tags('DT', 'SR-LOG-DT-R2') }, async ({ autenticacao, massa }) => {
  const usuario = await massa.usuario();
  const resposta = await autenticacao.autenticar({ email: usuario.email, password: UsuarioBuilder.senhaUnica() });
  expect(resposta.status).toBe(401);
  expect(resposta.corpo).toStrictEqual(MENSAGEM_INVALIDO);
});

test('login com email nao cadastrado retorna 401', { tag: tags('DT', 'SR-LOG-DT-R3') }, async ({ autenticacao }) => {
  const resposta = await autenticacao.autenticar({ email: UsuarioBuilder.emailUnico(), password: UsuarioBuilder.senhaUnica() });
  expect(resposta.status).toBe(401);
  expect(resposta.corpo).toStrictEqual(MENSAGEM_INVALIDO);
});

test('login com email sem formato valido retorna 400', { tag: tags('EP', 'SR-LOG-EP-I-EMAIL') }, async ({ autenticacao }) => {
  const resposta = await autenticacao.autenticar({ email: 'sem-arroba', password: 'x' });
  expect(resposta.status).toBe(400);
  expect(resposta.corpo).toStrictEqual({ email: 'email deve ser um email válido' });
});

test('login sem senha retorna 400', { tag: tags('EP', 'SR-LOG-EP-I-SENHA') }, async ({ autenticacao }) => {
  const resposta = await autenticacao.autenticar({ email: UsuarioBuilder.emailUnico() });
  expect(resposta.status).toBe(400);
  expect(resposta.corpo).toStrictEqual({ password: 'password é obrigatório' });
});
