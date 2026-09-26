import { readFileSync } from 'node:fs';

const TIPOS = ['feat', 'fix', 'docs', 'test', 'build', 'perf', 'style', 'refactor', 'chore', 'ci', 'raw', 'cleanup', 'remove'];
const EMOJI = /\p{Extended_Pictographic}|:[a-z0-9_+-]+:/u;

export function validar(primeiraLinha: string): string | undefined {
  if (/^(Merge|Revert|fixup!|squash!)/.test(primeiraLinha)) return undefined;
  const modelo = `Formato: <tipo>: <descricao ate 4 palavras>, sem emoji. Ex.: "test: Cenarios de login". Tipos: ${TIPOS.join(', ')}`;
  if (EMOJI.test(primeiraLinha)) return `Commits nao devem ter emoji nem :codigo:. ${modelo}`;
  const m = /^([a-z]+): (.+)$/.exec(primeiraLinha);
  if (!m) return `Mensagem fora do padrao. ${modelo}`;
  const [, tipo = '', descricao = ''] = m;
  if (!TIPOS.includes(tipo)) return `Tipo "${tipo}" invalido. ${modelo}`;
  const palavras = descricao.trim().split(/\s+/).length;
  if (palavras > 4) return `Descricao com ${palavras} palavras (max 4). Resuma e detalhe no corpo do commit.`;
  return undefined;
}

if (process.argv[1]?.endsWith('mensagem-de-commit.ts')) {
  const arquivo = process.argv[2];
  if (!arquivo) { console.error('uso: mensagem-de-commit.ts <arquivo>'); process.exit(2); }
  const linha = readFileSync(arquivo, 'utf8').split('\n')[0] ?? '';
  const erro = validar(linha);
  if (erro) { console.error(`[commit-msg] ${erro}\n  Recebido: "${linha}"`); process.exit(1); }
}
