import { randomUUID } from 'node:crypto';
import type { Corpo } from '../contratos/RespostaHttp.js';

export class UsuarioBuilder {
  private dados: Corpo = { nome: 'Usuario QA', email: UsuarioBuilder.emailUnico(), password: UsuarioBuilder.senhaUnica(), administrador: 'false' };

  static emailUnico(): string { return `qa.${randomUUID()}@example.com`; }

  static senhaUnica(): string { return `Pw-${randomUUID()}`; }

  administrador(valor = true): this { return this.com('administrador', String(valor)); }
  com(campo: string, valor: unknown): this { this.dados = { ...this.dados, [campo]: valor }; return this; }
  construir(): Corpo { return { ...this.dados }; }
}
