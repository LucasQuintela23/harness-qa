export interface Violacao {
  sensor: string;
  arquivo: string;
  linha?: number;
  problema: string;
  comoCorrigir: string;
}

export function formatar(v: Violacao): string {
  const local = v.linha === undefined ? v.arquivo : `${v.arquivo}:${v.linha}`;
  return `[${v.sensor}] ${local}\n  PROBLEMA: ${v.problema}\n  COMO CORRIGIR: ${v.comoCorrigir}`;
}

export function emitir(nome: string, violacoes: Violacao[]): number {
  if (violacoes.length === 0) {
    console.log(`OK   ${nome}`);
    return 0;
  }
  console.error(`FALHA ${nome}: ${violacoes.length} violacao(oes)\n`);
  for (const v of violacoes) console.error(`${formatar(v)}\n`);
  return violacoes.length;
}
