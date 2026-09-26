import { CarrinhoBuilder } from '../builders/CarrinhoBuilder.js';
import { ProdutoBuilder } from '../builders/ProdutoBuilder.js';
import { UsuarioBuilder } from '../builders/UsuarioBuilder.js';
import type { Autenticavel } from '../contratos/AutenticacaoClient.js';
import type { CarrinhoCriavel, CarrinhoFinalizavel } from '../contratos/CarrinhoClient.js';
import type { ItemDeCarrinho, MassaDeTeste, PerfilDeAcesso, ProdutoDePartida, UsuarioDePartida } from '../contratos/MassaDeTeste.js';
import type { ProdutoCriavel, ProdutoRemovivel } from '../contratos/ProdutoClient.js';
import type { UsuarioCriavel, UsuarioRemovivel } from '../contratos/UsuarioClient.js';
import { exigirStatus, idDe } from './resposta.js';

export interface Dependencias {
  autenticacao: Autenticavel;
  usuarios: UsuarioCriavel & UsuarioRemovivel;
  produtos: ProdutoCriavel & ProdutoRemovivel;
  carrinhos: CarrinhoCriavel & CarrinhoFinalizavel;
}

export class MassaDeTesteServeRest implements MassaDeTeste {
  private readonly donos: UsuarioDePartida[] = [];
  private readonly usuariosAdotados: string[] = [];
  private readonly produtos: { id: string; admin: UsuarioDePartida }[] = [];

  constructor(private readonly deps: Dependencias) {}

  async usuario(opcoes: { administrador?: boolean } = {}): Promise<UsuarioDePartida> {
    const corpo = new UsuarioBuilder().administrador(opcoes.administrador ?? false).construir();
    const criado = await this.deps.usuarios.criar(corpo);
    exigirStatus(criado, 201, 'criar usuario');
    const login = await this.deps.autenticacao.autenticar({ email: corpo['email'], password: corpo['password'] });
    exigirStatus(login, 200, 'login');
    const usuario = { id: idDe(criado), email: String(corpo['email']), senha: String(corpo['password']), token: (login.corpo as { authorization: string }).authorization };
    this.donos.push(usuario);
    return usuario;
  }

  async produto(admin: UsuarioDePartida, opcoes: { quantidade?: number; preco?: number } = {}): Promise<ProdutoDePartida> {
    const corpo = new ProdutoBuilder().comAjustes({ ...(opcoes.quantidade === undefined ? {} : { quantidade: opcoes.quantidade }), ...(opcoes.preco === undefined ? {} : { preco: opcoes.preco }) }).construir();
    const criado = await this.deps.produtos.criar(corpo, admin.token);
    exigirStatus(criado, 201, 'criar produto');
    const id = idDe(criado);
    this.produtos.push({ id, admin });
    return { id, nome: String(corpo['nome']) };
  }

  async carrinho(dono: UsuarioDePartida, itens: ItemDeCarrinho[]): Promise<string> {
    const builder = itens.reduce((b, i) => b.item(i.idProduto, i.quantidade), new CarrinhoBuilder());
    const criado = await this.deps.carrinhos.criar(builder.construir(), dono.token);
    exigirStatus(criado, 201, 'criar carrinho');
    return idDe(criado);
  }

  tokenDoPerfil(perfil: PerfilDeAcesso, admin: UsuarioDePartida): Promise<string | undefined> {
    const porPerfil: Record<PerfilDeAcesso, () => Promise<string | undefined>> = {
      nenhum: () => Promise.resolve(undefined),
      invalido: () => Promise.resolve('Bearer token-invalido'),
      admin: () => Promise.resolve(admin.token),
      comum: async () => (await this.usuario()).token,
    };
    return porPerfil[perfil]();
  }

  adotarSeCriado(tipo: 'usuario' | 'produto', resposta: { corpo: unknown }, admin?: UsuarioDePartida): void {
    const id = (resposta.corpo as { _id?: unknown })._id;
    if (typeof id !== 'string') return;
    if (tipo === 'usuario') this.usuariosAdotados.push(id);
    else if (admin) this.produtos.push({ id, admin });
  }

  async limpar(): Promise<void> {
    await Promise.allSettled(this.donos.map((u) => this.deps.carrinhos.cancelar(u.token)));
    await Promise.allSettled(this.produtos.map((p) => this.deps.produtos.remover(p.id, p.admin.token)));
    await Promise.allSettled([...this.donos.map((u) => u.id), ...this.usuariosAdotados].map((id) => this.deps.usuarios.remover(id)));
  }
}
