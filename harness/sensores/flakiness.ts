import { CAMINHO_RELATORIO, lerRelatorio } from './lib/relatorio-playwright.js';
import type { Violacao } from './lib/relatorio.js';

const SENSOR = 'flakiness';

export function executar(): Violacao[] {
  const rel = lerRelatorio();
  if (!rel) return [{ sensor: SENSOR, arquivo: CAMINHO_RELATORIO, problema: 'relatorio JSON do Playwright ausente.', comoCorrigir: 'Rode um projeto de teste antes deste sensor.' }];
  return rel.testes.filter((t) => t.status === 'flaky').map((t) => ({
    sensor: SENSOR, arquivo: t.id, problema: `teste "${t.titulo}" passou somente apos retry (flaky).`,
    comoCorrigir: 'Nao aumente retries. Abra o trace (test-results), identifique a causa (espera implicita, dado compartilhado, ordem, relogio) e corrija na origem. Se nao for corrigivel agora, registre defeito e quarentene com test.fixme referenciando o ID.',
  }));
}
