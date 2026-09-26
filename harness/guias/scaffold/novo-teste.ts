import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { listarSistemas } from '../../sensores/lib/arquivos.js';
import { carregarPolitica, RAIZ } from '../../sensores/lib/politica.js';

const [sistema, nivel, nome, tecnica, req, risco, cobertura] = process.argv.slice(2);
const politica = carregarPolitica();
const niveis = Object.keys(politica.pastasPorNivel);
const sistemas = listarSistemas();

if (!sistema || !nivel || !nome || !tecnica || !req || !risco || !cobertura) {
  console.error(`uso: npm run novo-teste -- <${sistemas.join('|')}> <${niveis.join('|')}> <nome-kebab> <tecnica> <REQ-ID> <RISCO-ID> <ITEM-ID>`);
  process.exit(2);
}
if (!sistemas.includes(sistema)) { console.error(`sistema invalido "${sistema}". Existentes: ${sistemas.join(', ')}. Crie com: npm run novo-sistema -- <nome>`); process.exit(2); }
if (!niveis.includes(nivel)) { console.error(`nivel invalido "${nivel}". Use: ${niveis.join(', ')}`); process.exit(2); }
if (!politica.tecnicasPermitidas.includes(tecnica)) { console.error(`tecnica invalida "${tecnica}". Use: ${politica.tecnicasPermitidas.join(', ')}`); process.exit(2); }

const destino = join(RAIZ, 'sistemas', sistema, 'tests', nivel, `${nome}.spec.ts`);
if (existsSync(destino)) { console.error(`${destino} ja existe; nao sobrescrevo.`); process.exit(1); }
mkdirSync(dirname(destino), { recursive: true });
writeFileSync(destino, `import { test, expect } from '@playwright/test';

test('<comportamento esperado em linguagem de negocio>', {
  tag: ['@tecnica:${tecnica}', '@req:${req}', '@risco:${risco}', '@cobertura:${cobertura}'],
}, () => {
  // Arrange: dados via builder (sistemas/${sistema}/support/builders). Act: um unico comportamento. Assert: valor exato derivado da tecnica.
  expect('<obtido>').toBe('<esperado>');
});
`);
console.log(`Criado ${destino}. Registre o item ${cobertura} em sistemas/${sistema}/docs/rastreabilidade.json se ainda nao existir.`);
