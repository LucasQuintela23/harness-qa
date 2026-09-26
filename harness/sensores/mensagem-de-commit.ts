import { readFileSync } from 'node:fs';

const TIPOS: Record<string, string> = {
  feat: ':sparkles:', fix: ':bug:', docs: ':books:', test: ':test_tube:', build: ':construction_worker:',
  perf: ':zap:', style: ':art:', refactor: ':recycle:', chore: ':wrench:', ci: ':bricks:',
  raw: ':card_file_box:', cleanup: ':broom:', remove: ':wastebasket:',
};

export function validar(primeiraLinha: string): string | undefined {
  if (/^(Merge|Revert|fixup!|squash!)/.test(primeiraLinha)) return undefined;
  const m = /^(:[a-z0-9_+-]+:) ([a-z]+): (.+)$/.exec(primeiraLinha);
  const modelo = 'Formato: <emoji> <tipo>: <descricao ate 4 palavras>. Ex.: ":test_tube: test: Cenarios de login". Tipos: ' +
    Object.entries(TIPOS).map(([t, e]) => `${e} ${t}`).join(', ');
  if (!m) return `Mensagem fora do padrao iuricode/padroes-de-commits. ${modelo}`;
  const [, emoji = '', tipo = '', descricao = ''] = m;
  const esperado = TIPOS[tipo];
  if (!esperado) return `Tipo "${tipo}" invalido. ${modelo}`;
  if (emoji !== esperado) return `Emoji ${emoji} nao corresponde ao tipo "${tipo}"; use ${esperado}.`;
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
