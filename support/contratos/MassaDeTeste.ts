export interface UsuarioDePartida { id: string; email: string; senha: string; token: string }
export interface ProdutoDePartida { id: string; nome: string }
export interface ItemDeCarrinho { idProduto: string; quantidade: number }
export type PerfilDeAcesso = 'nenhum' | 'invalido' | 'comum' | 'admin';

export interface MassaDeTeste {
  usuario(opcoes?: { administrador?: boolean }): Promise<UsuarioDePartida>;
  produto(admin: UsuarioDePartida, opcoes?: { quantidade?: number; preco?: number }): Promise<ProdutoDePartida>;
  carrinho(dono: UsuarioDePartida, itens: ItemDeCarrinho[]): Promise<string>;
  tokenDoPerfil(perfil: PerfilDeAcesso, admin: UsuarioDePartida): Promise<string | undefined>;
  adotarSeCriado(tipo: 'usuario' | 'produto', resposta: { corpo: unknown }, admin?: UsuarioDePartida): void;
}
