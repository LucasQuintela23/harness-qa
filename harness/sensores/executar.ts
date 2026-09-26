import { emitir, type Violacao } from './lib/relatorio.js';
import * as assercoes from './assercoes.js';
import * as duplicados from './duplicados.js';
import * as estrutural from './estrutural.js';
import * as rastreabilidade from './rastreabilidade.js';
import * as tempo from './tempo-de-suite.js';
import * as flakiness from './flakiness.js';
import * as drift from './drift.js';

const grupos: Record<string, [string, () => Violacao[]][]> = {
  estaticos: [['assercoes', assercoes.executar], ['duplicados', duplicados.executar], ['estrutural', estrutural.executar], ['rastreabilidade', rastreabilidade.executar]],
  relatorio: [['flakiness', flakiness.executar], ['tempo-de-suite', tempo.executar]],
  drift: [['drift', drift.executar]],
};

const grupo = process.argv[2] ?? '';
const sensores = grupos[grupo];
if (!sensores) { console.error(`uso: executar.ts <${Object.keys(grupos).join('|')}>`); process.exit(2); }

let falhas = 0;
for (const [nome, rodar] of sensores) falhas += emitir(nome, rodar());
if (grupo === 'relatorio') drift.registrarExecucao();
process.exit(falhas > 0 ? 1 : 0);
