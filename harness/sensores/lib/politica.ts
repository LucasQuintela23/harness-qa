import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface Politica {
  tecnicasPermitidas: string[];
  niveis: string[];
  diretorioParaNivel: Record<string, string>;
  orcamentoDeTempoSegundos: Record<string, number>;
  maxTestesPorArquivo: number;
  rastreabilidade: { dir: string };
  drift: {
    diasSemExecucaoParaTesteMorto: number;
    flakinessMaximaPercentual: number;
    coberturaDeRiscoMinimaPorNivel: Record<string, number>;
  };
}

export const RAIZ = process.cwd();

export function carregarPolitica(): Politica {
  return JSON.parse(readFileSync(join(RAIZ, 'harness/config/politica.json'), 'utf8')) as Politica;
}
