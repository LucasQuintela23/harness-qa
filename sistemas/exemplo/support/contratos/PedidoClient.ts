export interface PedidoCriavel<TEntrada, TSaida> {
  criar(entrada: TEntrada): Promise<TSaida>;
}

export interface PedidoConsultavel<TSaida> {
  consultar(id: string): Promise<TSaida>;
}
