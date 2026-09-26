import { test as base } from '@playwright/test';
import { AutenticacaoHttp } from '../clients/AutenticacaoHttp.js';
import { CarrinhoHttp } from '../clients/CarrinhoHttp.js';
import { ProdutoHttp } from '../clients/ProdutoHttp.js';
import { UsuarioHttp } from '../clients/UsuarioHttp.js';
import { ProvedorDeAmbienteVariaveis } from '../ambiente/ProvedorDeAmbienteVariaveis.js';
import type { Autenticavel } from '../contratos/AutenticacaoClient.js';
import type { CarrinhoConsultavel, CarrinhoCriavel, CarrinhoFinalizavel } from '../contratos/CarrinhoClient.js';
import type { MassaDeTeste } from '../contratos/MassaDeTeste.js';
import type { ProdutoAlteravel, ProdutoConsultavel, ProdutoCriavel, ProdutoRemovivel } from '../contratos/ProdutoClient.js';
import type { ProvedorDeAmbiente } from '../contratos/ProvedorDeAmbiente.js';
import type { UsuarioAlteravel, UsuarioConsultavel, UsuarioCriavel, UsuarioRemovivel } from '../contratos/UsuarioClient.js';
import { MassaDeTesteServeRest } from '../massa/MassaDeTesteServeRest.js';

interface Fixtures {
  ambiente: ProvedorDeAmbiente;
  autenticacao: Autenticavel;
  usuarios: UsuarioCriavel & UsuarioConsultavel & UsuarioAlteravel & UsuarioRemovivel;
  produtos: ProdutoCriavel & ProdutoConsultavel & ProdutoAlteravel & ProdutoRemovivel;
  carrinhos: CarrinhoCriavel & CarrinhoConsultavel & CarrinhoFinalizavel;
  massa: MassaDeTeste;
}

export const test = base.extend<Fixtures>({
  ambiente: async ({}, use) => { await use(new ProvedorDeAmbienteVariaveis()); },
  autenticacao: async ({ request, ambiente }, use) => { await use(new AutenticacaoHttp(request, ambiente.urlApi())); },
  usuarios: async ({ request, ambiente }, use) => { await use(new UsuarioHttp(request, ambiente.urlApi())); },
  produtos: async ({ request, ambiente }, use) => { await use(new ProdutoHttp(request, ambiente.urlApi())); },
  carrinhos: async ({ request, ambiente }, use) => { await use(new CarrinhoHttp(request, ambiente.urlApi())); },
  massa: async ({ autenticacao, usuarios, produtos, carrinhos }, use) => {
    const massa = new MassaDeTesteServeRest({ autenticacao, usuarios, produtos, carrinhos });
    await use(massa);
    await massa.limpar();
  },
});

export { expect } from '@playwright/test';
export { idDe } from '../massa/resposta.js';
