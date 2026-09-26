import { randomUUID } from 'node:crypto';
import { UsuarioBuilder } from '../../../support/builders/UsuarioBuilder.js';
import { expect, idDe, test } from '../../../support/fixtures/serverest.js';

const tags = (tecnica: string, cobertura: string): string[] => [`@tecnica:${tecnica}`, '@req:REQ-SR-002', '@risco:R-SR-03', `@cobertura:${cobertura}`];
const MENSAGEM_CADASTRO = 'Cadastro realizado com sucesso';
const idInexistente = (): string => randomUUID().replaceAll('-', '').slice(0, 16);

test('cadastra usuario com todos os campos validos e retorna 201', { tag: tags('EP', 'SR-USR-EP-V') }, async ({ usuarios, massa }) => {
  const resposta = await usuarios.criar(new UsuarioBuilder().construir());
  massa.adotarSeCriado('usuario', resposta);
  expect(resposta.status).toBe(201);
  expect(resposta.corpo).toMatchObject({ message: MENSAGEM_CADASTRO, _id: expect.any(String) });
});

const invalidos = [
  { cobertura: 'SR-USR-EP-I-NOME', campo: 'nome', valor: '', mensagem: 'nome não pode ficar em branco' },
  { cobertura: 'SR-USR-EP-I-EMAIL', campo: 'email', valor: 'sem-arroba', mensagem: 'email deve ser um email válido' },
  { cobertura: 'SR-USR-EP-I-SENHA', campo: 'password', valor: '', mensagem: 'password não pode ficar em branco' },
  { cobertura: 'SR-USR-EP-I-ADM', campo: 'administrador', valor: 'talvez', mensagem: "administrador deve ser 'true' ou 'false'" },
];
for (const caso of invalidos) {
  test(`rejeita cadastro com ${caso.campo} invalido com 400`, { tag: tags('EP', caso.cobertura) }, async ({ usuarios }) => {
    const resposta = await usuarios.criar(new UsuarioBuilder().com(caso.campo, caso.valor).construir());
    expect(resposta.status).toBe(400);
    expect(resposta.corpo).toStrictEqual({ [caso.campo]: caso.mensagem });
  });
}

const perfis = [
  { cobertura: 'SR-USR-DT-R1', administrador: 'true' },
  { cobertura: 'SR-USR-DT-R2', administrador: 'false' },
];
for (const perfil of perfis) {
  test(`cadastra email novo com administrador ${perfil.administrador} e persiste o perfil`, { tag: tags('DT', perfil.cobertura) }, async ({ usuarios, massa }) => {
    const criado = await usuarios.criar(new UsuarioBuilder().com('administrador', perfil.administrador).construir());
    massa.adotarSeCriado('usuario', criado);
    const consultado = await usuarios.consultar(idDe(criado));
    expect(criado.status).toBe(201);
    expect(consultado.corpo).toMatchObject({ administrador: perfil.administrador });
  });
}

test('rejeita cadastro com email ja utilizado com 400', { tag: tags('DT', 'SR-USR-DT-R3') }, async ({ usuarios, massa }) => {
  const existente = await massa.usuario();
  const resposta = await usuarios.criar(new UsuarioBuilder().com('email', existente.email).construir());
  expect(resposta.status).toBe(400);
  expect(resposta.corpo).toStrictEqual({ message: 'Este email já está sendo usado' });
});

test('PUT com id inexistente cadastra novo usuario e retorna 201', { tag: tags('EG', 'SR-USR-EG-PUT-NOVO') }, async ({ usuarios, massa }) => {
  const resposta = await usuarios.alterar(idInexistente(), new UsuarioBuilder().construir());
  massa.adotarSeCriado('usuario', resposta);
  expect(resposta.status).toBe(201);
  expect(resposta.corpo).toMatchObject({ message: MENSAGEM_CADASTRO });
});

test('PUT com email de outro usuario retorna 400', { tag: tags('EG', 'SR-USR-EG-PUT-DUP') }, async ({ usuarios, massa }) => {
  const dono = await massa.usuario();
  const outro = await massa.usuario();
  const resposta = await usuarios.alterar(dono.id, new UsuarioBuilder().com('email', outro.email).construir());
  expect(resposta.status).toBe(400);
  expect(resposta.corpo).toStrictEqual({ message: 'Este email já está sendo usado' });
});

test('consulta de usuario com id valido inexistente retorna 400', { tag: tags('EG', 'SR-USR-EG-GET-INEX') }, async ({ usuarios }) => {
  const resposta = await usuarios.consultar(idInexistente());
  expect(resposta.status).toBe(400);
  expect(resposta.corpo).toStrictEqual({ message: 'Usuário não encontrado' });
});

test('consulta de usuario com id fora do formato retorna 400', { tag: tags('EG', 'SR-USR-EG-ID-MALFORMADO') }, async ({ usuarios }) => {
  const resposta = await usuarios.consultar('curto');
  expect(resposta.status).toBe(400);
  expect(resposta.corpo).toStrictEqual({ id: 'id deve ter exatamente 16 caracteres alfanuméricos' });
});
