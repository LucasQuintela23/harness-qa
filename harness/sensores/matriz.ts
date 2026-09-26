import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { RAIZ } from './lib/politica.js';
import { carregarDadosPorSistema } from './lib/rastreabilidade-dados.js';
import { lerRelatorio } from './lib/relatorio-playwright.js';
import { listarTestes } from './rastreabilidade.js';

const testes = listarTestes();
const execucao = lerRelatorio();
const statusDe = (t: { arquivo: string; linha: number }): string => {
  const r = execucao?.testes.find((x) => `sistemas/${x.id}` === `${t.arquivo}:${t.linha}`);
  return r ? r.status : 'nao executado';
};

for (const [sistema, dados] of Object.entries(carregarDadosPorSistema())) {
  const doSistema = testes.filter((t) => t.arquivo.startsWith(`sistemas/${sistema}/`));
  const linhas = [`# Matriz de rastreabilidade: ${sistema} (gerada, nao edite)`, '', '| Requisito | Risco | Tecnica | Item de cobertura | Caso de teste | Execucao |', '|---|---|---|---|---|---|'];
  for (const req of dados.requisitos) {
    const risco = dados.riscos.find((r) => r.id === req.risco);
    const rotuloRisco = risco ? `${risco.id} (${risco.nivel})` : `${req.risco} (?)`;
    for (const item of dados.itensDeCobertura.filter((i) => i.requisito === req.id)) {
      const casos = doSistema.filter((t) => t.tags.includes(`@cobertura:${item.id}`));
      if (casos.length === 0) linhas.push(`| ${req.id} | ${rotuloRisco} | ${item.tecnica} | ${item.id}: ${item.descricao} | ${item.manual === true ? '(manual)' : '**SEM TESTE**'} | - |`);
      for (const c of casos) linhas.push(`| ${req.id} | ${rotuloRisco} | ${item.tecnica} | ${item.id}: ${item.descricao} | ${c.arquivo}:${c.linha} ${c.titulo} | ${statusDe(c)} |`);
    }
  }
  const destino = `sistemas/${sistema}/docs/MATRIZ.md`;
  writeFileSync(join(RAIZ, destino), `${linhas.join('\n')}\n`);
  console.log(`Matriz escrita em ${destino} (${linhas.length - 4} linhas).`);
}
