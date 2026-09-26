import { ProdutoBuilder } from '../../../support/builders/ProdutoBuilder.js';
import type { ProdutoAlteravel, ProdutoCriavel, ProdutoRemovivel } from '../../../support/contratos/ProdutoClient.js';
import type { PerfilDeAcesso } from '../../../support/contratos/MassaDeTeste.js';
import type { RespostaHttp } from '../../../support/contratos/RespostaHttp.js';
import { expect, test } from '../../../support/fixtures/serverest.js';

interface Contexto { produtos: ProdutoCriavel & ProdutoAlteravel & ProdutoRemovivel; token: string | undefined; produtoId: string }
type Operacao = (c: Contexto) => Promise<RespostaHttp>;

const criar: Operacao = ({ produtos, token }) => produtos.criar(new ProdutoBuilder().construir(), token);
const alterar: Operacao = ({ produtos, token, produtoId }) => produtos.alterar(produtoId, new ProdutoBuilder().construir(), token);
const excluir: Operacao = ({ produtos, token, produtoId }) => produtos.remover(produtoId, token);

const SEM_TOKEN = 'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais';
const SO_ADMIN = 'Rota exclusiva para administradores';

interface Caso { cobertura: string; operacaoDescrita: string; operacao: Operacao; perfil: PerfilDeAcesso; status: number; mensagem: string }

const casos: Caso[] = [
  { cobertura: 'SR-AUT-DT-POST-R1', operacaoDescrita: 'criar', operacao: criar, perfil: 'nenhum', status: 401, mensagem: SEM_TOKEN },
  { cobertura: 'SR-AUT-DT-POST-R2', operacaoDescrita: 'criar', operacao: criar, perfil: 'invalido', status: 401, mensagem: SEM_TOKEN },
  { cobertura: 'SR-AUT-DT-POST-R3', operacaoDescrita: 'criar', operacao: criar, perfil: 'comum', status: 403, mensagem: SO_ADMIN },
  { cobertura: 'SR-AUT-DT-POST-R4', operacaoDescrita: 'criar', operacao: criar, perfil: 'admin', status: 201, mensagem: 'Cadastro realizado com sucesso' },
  { cobertura: 'SR-AUT-DT-PUT-R1', operacaoDescrita: 'alterar', operacao: alterar, perfil: 'nenhum', status: 401, mensagem: SEM_TOKEN },
  { cobertura: 'SR-AUT-DT-PUT-R3', operacaoDescrita: 'alterar', operacao: alterar, perfil: 'comum', status: 403, mensagem: SO_ADMIN },
  { cobertura: 'SR-AUT-DT-PUT-R4', operacaoDescrita: 'alterar', operacao: alterar, perfil: 'admin', status: 200, mensagem: 'Registro alterado com sucesso' },
  { cobertura: 'SR-AUT-DT-DEL-R1', operacaoDescrita: 'excluir', operacao: excluir, perfil: 'nenhum', status: 401, mensagem: SEM_TOKEN },
  { cobertura: 'SR-AUT-DT-DEL-R3', operacaoDescrita: 'excluir', operacao: excluir, perfil: 'comum', status: 403, mensagem: SO_ADMIN },
  { cobertura: 'SR-AUT-DT-DEL-R4', operacaoDescrita: 'excluir', operacao: excluir, perfil: 'admin', status: 200, mensagem: 'Registro excluído com sucesso' },
];

for (const caso of casos) {
  test(`${caso.operacaoDescrita} produto com perfil ${caso.perfil} retorna ${caso.status}`, {
    tag: ['@tecnica:DT', '@req:REQ-SR-003', '@risco:R-SR-02', `@cobertura:${caso.cobertura}`],
  }, async ({ produtos, massa }) => {
    const admin = await massa.usuario({ administrador: true });
    const produto = await massa.produto(admin);
    const token = await massa.tokenDoPerfil(caso.perfil, admin);
    const resposta = await caso.operacao({ produtos, token, produtoId: produto.id });
    massa.adotarSeCriado('produto', resposta, admin);
    expect(resposta.status).toBe(caso.status);
    expect(resposta.corpo).toMatchObject({ message: caso.mensagem });
  });
}
