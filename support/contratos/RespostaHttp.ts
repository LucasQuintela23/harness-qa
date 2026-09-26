export interface RespostaHttp {
  status: number;
  corpo: unknown;
}

export type Corpo = Record<string, unknown>;
