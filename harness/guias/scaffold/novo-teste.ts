import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { carregarPolitica, RAIZ } from '../../sensores/lib/politica.js';

const [nivel, nome, tecnica, req, risco, cobertura] = process.argv.slice(2);
const politica = carregarPolitica();
const diretorios = Object.keys(politica.diretorioParaNivel).map((d) => d.replace('tests/', ''));

if (!nivel || !nome || !tecnica || !req || !risco || !cobertura) {
  console.error(`uso: npm run novo-teste -- <${diretorios.join('|')}> <nome-kebab> <tecnica> <REQ-ID> <RISCO-ID> <ITEM-ID>`);
  process.exit(2);
}
if (!diretorios.includes(nivel)) { console.error(`nivel invalido "${nivel}". Use: ${diretorios.join(', ')}`); process.exit(2); }
if (!politica.tecnicasPermitidas.includes(tecnica)) { console.error(`tecnica invalida "${tecnica}". Use: ${politica.tecnicasPermitidas.join(', ')}`); process.exit(2); }

const destino = join(RAIZ, 'tests', nivel, `${nome}.spec.ts`);
if (existsSync(destino)) { console.error(`${destino} ja existe; nao sobrescrevo.`); process.exit(1); }
mkdirSync(dirname(destino), { recursive: true });
writeFileSync(destino, `import { test, expect } from '@playwright/test';

test('<comportamento esperado em linguagem de negocio>', {
  tag: ['@tecnica:${tecnica}', '@req:${req}', '@risco:${risco}', '@cobertura:${cobertura}'],
}, () => {
  // Arrange: dados via builder (support/builders). Act: um unico comportamento. Assert: valor exato derivado da tecnica.
  expect('<obtido>').toBe('<esperado>');
});
`);
console.log(`Criado ${destino}. Registre o item ${cobertura} em docs/rastreabilidade/*.json se ainda nao existir.`);
