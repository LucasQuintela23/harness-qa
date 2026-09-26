import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { RAIZ } from '../../sensores/lib/politica.js';

const [nome] = process.argv.slice(2);
if (!nome || !/^[a-z][a-z0-9-]*$/.test(nome)) { console.error('uso: npm run novo-sistema -- <nome-em-kebab-case>'); process.exit(2); }

const base = join(RAIZ, 'sistemas', nome);
if (existsSync(base)) { console.error(`${base} ja existe; nao sobrescrevo.`); process.exit(1); }
for (const pasta of ['tests', 'support/contratos', 'support/clients', 'support/builders', 'support/fixtures', 'docs/charters']) mkdirSync(join(base, pasta), { recursive: true });

writeFileSync(join(base, 'docs/rastreabilidade.json'), `${JSON.stringify({ requisitos: [], riscos: [], itensDeCobertura: [] }, null, 2)}\n`);
copyFileSync(join(RAIZ, 'docs/templates/plano-de-teste.md'), join(base, 'docs/plano-de-teste.md'));
writeFileSync(join(base, 'README.md'), `# ${nome}

Sistema sob teste. Estrutura:

- \`tests/<nivel>/\`: specs por nivel (componente, contrato, integracao, e2e, acessibilidade). Performance (k6) em \`tests/performance\`.
- \`support/\`: contratos, clients, builders, fixtures e page objects **deste** sistema. O que for generico fica em \`support/\` na raiz (import via \`@compartilhado\`).
- \`docs/\`: plano de teste, \`rastreabilidade.json\` (requisitos, riscos, itens de cobertura), charters e a matriz gerada.

Um sistema nao importa outro (sensor E9). Comece pela skill /derivar-casos-de-teste.
`);
console.log(`Sistema criado em sistemas/${nome}. Proximo passo: preencher docs/rastreabilidade.json e docs/plano-de-teste.md.`);
