import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { carregarPolitica, RAIZ } from './lib/politica.js';
import { carregarDados } from './lib/rastreabilidade-dados.js';
import { lerRelatorio } from './lib/relatorio-playwright.js';
import { listarTestes } from './rastreabilidade.js';
import type { Violacao } from './lib/relatorio.js';

const SENSOR = 'drift';
const HISTORICO = 'reports/historico.jsonl';

interface Registro { data: string; testes: { id: string; status: string }[] }

export function registrarExecucao(): void {
  const rel = lerRelatorio();
  if (!rel) return;
  mkdirSync(join(RAIZ, 'reports'), { recursive: true });
  const registro: Registro = { data: new Date().toISOString(), testes: rel.testes.map((t) => ({ id: t.id, status: t.status })) };
  appendFileSync(join(RAIZ, HISTORICO), `${JSON.stringify(registro)}\n`);
}

const lerHistorico = (): Registro[] => {
  const caminho = join(RAIZ, HISTORICO);
  if (!existsSync(caminho)) return [];
  return readFileSync(caminho, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l) as Registro);
};

export function executar(): Violacao[] {
  const p = carregarPolitica();
  const v: Violacao[] = [];
  const historico = lerHistorico();

  const porTeste = new Map<string, { total: number; flaky: number; ultimo: string; sempreSkipped: boolean }>();
  for (const r of historico) for (const t of r.testes) {
    const a = porTeste.get(t.id) ?? { total: 0, flaky: 0, ultimo: r.data, sempreSkipped: true };
    a.total++; a.ultimo = r.data;
    if (t.status === 'flaky') a.flaky++;
    if (t.status !== 'skipped') a.sempreSkipped = false;
    porTeste.set(t.id, a);
  }
  const limiteMs = p.drift.diasSemExecucaoParaTesteMorto * 86_400_000;
  for (const [id, a] of porTeste) {
    const taxa = (a.flaky / a.total) * 100;
    if (a.total >= 5 && taxa > p.drift.flakinessMaximaPercentual) v.push({ sensor: SENSOR, arquivo: id, problema: `flakiness acumulada de ${taxa.toFixed(1)}% em ${a.total} execucoes (limite ${p.drift.flakinessMaximaPercentual}%).`, comoCorrigir: 'Abra defeito de automacao, analise os traces dos retries e corrija a causa; nao suba o limite.' });
    if (Date.now() - Date.parse(a.ultimo) > limiteMs) v.push({ sensor: SENSOR, arquivo: id, problema: `teste sem execucao ha mais de ${p.drift.diasSemExecucaoParaTesteMorto} dias (possivel teste morto).`, comoCorrigir: 'Confirme se ainda esta em algum projeto/tag executado no CI; se o requisito morreu, remova o teste e o item de cobertura.' });
    if (a.sempreSkipped && a.total >= 5) v.push({ sensor: SENSOR, arquivo: id, problema: 'teste ignorado em todas as execucoes.', comoCorrigir: 'Corrija e reative, ou remova. Skip permanente e teste morto.' });
  }

  const dados = carregarDados();
  const testes = listarTestes();
  const nivelDoRisco = new Map(dados.riscos.map((r) => [r.id, r.nivel]));
  for (const nivel of Object.keys(p.drift.coberturaDeRiscoMinimaPorNivel)) {
    const minimo = p.drift.coberturaDeRiscoMinimaPorNivel[nivel] ?? 0;
    const reqs = dados.requisitos.filter((r) => nivelDoRisco.get(r.risco) === nivel);
    if (reqs.length === 0) continue;
    const cobertos = reqs.filter((r) => testes.some((t) => t.tags.includes(`@req:${r.id}`))).length;
    const pct = (cobertos / reqs.length) * 100;
    if (pct < minimo) v.push({ sensor: SENSOR, arquivo: 'sistemas/*/docs/rastreabilidade.json', problema: `cobertura de requisitos de risco ${nivel}: ${pct.toFixed(0)}% (minimo ${minimo}%).`, comoCorrigir: `Priorize casos para os requisitos de risco ${nivel} sem teste (npm run matriz mostra quais).` });
  }

  try {
    execFileSync('npm', ['outdated', '--json'], { cwd: RAIZ, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch (e) {
    const saida = (e as { stdout?: string }).stdout ?? '';
    const desatualizadas = saida ? Object.keys(JSON.parse(saida) as object).length : 0;
    if (desatualizadas > 0) console.warn(`AVISO ${SENSOR}: ${desatualizadas} dependencia(s) desatualizada(s) (npm outdated). Nao bloqueante; trate via PR de atualizacao.`);
  }
  return v;
}
