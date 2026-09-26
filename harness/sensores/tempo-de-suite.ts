import { carregarPolitica } from './lib/politica.js';
import { CAMINHO_RELATORIO, lerRelatorio } from './lib/relatorio-playwright.js';
import type { Violacao } from './lib/relatorio.js';

const SENSOR = 'tempo-de-suite';

export function executar(): Violacao[] {
  const rel = lerRelatorio();
  if (!rel) return [{ sensor: SENSOR, arquivo: CAMINHO_RELATORIO, problema: 'relatorio JSON do Playwright ausente.', comoCorrigir: 'Rode um projeto (npm run test:componente) antes deste sensor.' }];
  const orcamento = carregarPolitica().orcamentoDeTempoSegundos;
  const projetos = [...new Set(rel.testes.map((t) => t.projeto))];
  const limite = projetos.reduce((soma, p) => soma + (orcamento[p] ?? 0), 0);
  const v: Violacao[] = [];
  if (limite > 0 && rel.duracaoTotalMs / 1000 > limite) {
    const lentos = [...rel.testes].sort((a, b) => b.duracaoMs - a.duracaoMs).slice(0, 3).map((t) => `${t.titulo} (${Math.round(t.duracaoMs)}ms)`).join('; ');
    v.push({ sensor: SENSOR, arquivo: CAMINHO_RELATORIO, problema: `suite levou ${(rel.duracaoTotalMs / 1000).toFixed(1)}s; orcamento de ${projetos.join('+')} e ${limite}s. Mais lentos: ${lentos}.`, comoCorrigir: 'Desca o cenario lento para um nivel mais baixo da piramide (E2E -> integracao -> componente), aumente o paralelismo ou remova setup redundante. Nao aumente o orcamento sem decisao registrada em docs/estrategia-de-testes.md.' });
  }
  return v;
}
