import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { RAIZ } from './lib/politica.js';
import { carregarDados } from './lib/rastreabilidade-dados.js';
import { lerRelatorio } from './lib/relatorio-playwright.js';
import { listarTestes } from './rastreabilidade.js';

const dados = carregarDados();
const testes = listarTestes();
const execucao = lerRelatorio();
const statusDe = (t: { arquivo: string; linha: number }): string => {
  const r = execucao?.testes.find((x) => `tests/${x.id}`.replace('tests/tests/', 'tests/') === `${t.arquivo}:${t.linha}`);
  return r ? r.status : 'nao executado';
};

const linhas = ['# Matriz de rastreabilidade (gerada, nao edite)', '', '| Requisito | Risco | Tecnica | Item de cobertura | Caso de teste | Execucao |', '|---|---|---|---|---|---|'];
for (const req of dados.requisitos) {
  const risco = dados.riscos.find((r) => r.id === req.risco);
  const rotuloRisco = risco ? `${risco.id} (${risco.nivel})` : `${req.risco} (?)`;
  for (const item of dados.itensDeCobertura.filter((i) => i.requisito === req.id)) {
    const casos = testes.filter((t) => t.tags.includes(`@cobertura:${item.id}`));
    if (casos.length === 0) linhas.push(`| ${req.id} | ${rotuloRisco} | ${item.tecnica} | ${item.id}: ${item.descricao} | ${item.manual === true ? '(manual)' : '**SEM TESTE**'} | - |`);
    for (const c of casos) linhas.push(`| ${req.id} | ${rotuloRisco} | ${item.tecnica} | ${item.id}: ${item.descricao} | ${c.arquivo}:${c.linha} ${c.titulo} | ${statusDe(c)} |`);
  }
}
writeFileSync(join(RAIZ, 'docs/rastreabilidade/MATRIZ.md'), `${linhas.join('\n')}\n`);
console.log(`Matriz escrita em docs/rastreabilidade/MATRIZ.md (${linhas.length - 4} linhas).`);
