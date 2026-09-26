import { execFileSync } from 'node:child_process';
import { carregarPolitica, RAIZ } from './lib/politica.js';
import { carregarDados, type DadosDeRastreabilidade } from './lib/rastreabilidade-dados.js';
import type { Violacao } from './lib/relatorio.js';

const SENSOR = 'rastreabilidade';

export interface TesteListado { id: string; arquivo: string; linha: number; titulo: string; tags: string[]; projeto: string }

interface EspecJson { title: string; file: string; line: number; tags?: string[]; tests?: { projectName: string }[] }
interface SuiteJson { specs?: EspecJson[]; suites?: SuiteJson[] }

export function listarTestes(): TesteListado[] {
  const saida = execFileSync('npx', ['playwright', 'test', '--list', '--reporter=json'], {
    cwd: RAIZ, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'],
  });
  const relatorio = JSON.parse(saida) as { suites?: SuiteJson[] };
  const testes: TesteListado[] = [];
  const visitar = (s: SuiteJson): void => {
    for (const e of s.specs ?? []) {
      const projeto = e.tests?.[0]?.projectName ?? '';
      testes.push({ id: `${e.file}:${e.line}`, arquivo: `sistemas/${e.file}`, linha: e.line, titulo: e.title, tags: (e.tags ?? []).map(comArroba), projeto });
    }
    (s.suites ?? []).forEach(visitar);
  };
  (relatorio.suites ?? []).forEach(visitar);
  return testes;
}

const comArroba = (t: string): string => (t.startsWith('@') ? t : `@${t}`);

const valores = (tags: string[], chave: string): string[] =>
  tags.filter((t) => t.startsWith(`@${chave}:`)).map((t) => t.slice(chave.length + 2));

export function analisar(testes: TesteListado[], dados: DadosDeRastreabilidade, tecnicasPermitidas: string[]): Violacao[] {
  const v: Violacao[] = [];
  const reqs = new Map(dados.requisitos.map((r) => [r.id, r]));
  const riscos = new Set(dados.riscos.map((r) => r.id));
  const itens = new Map(dados.itensDeCobertura.map((i) => [i.id, i]));
  const cobertos = new Set<string>();

  for (const t of testes) {
    const base = { sensor: SENSOR, arquivo: t.arquivo, linha: t.linha };
    const tecnicas = valores(t.tags, 'tecnica');
    const reqIds = valores(t.tags, 'req');
    const riscoIds = valores(t.tags, 'risco');
    const coberturas = valores(t.tags, 'cobertura');
    const exemplo = `test('${t.titulo}', { tag: ['@tecnica:BVA2', '@req:REQ-001', '@risco:R-001', '@cobertura:ITEM-001'] }, ...)`;

    if (tecnicas.length !== 1) v.push({ ...base, problema: `teste "${t.titulo}" declara ${tecnicas.length} tecnicas (esperado exatamente 1).`, comoCorrigir: `Adicione uma unica tag @tecnica:<codigo> em { tag: [...] }. Codigos: ${tecnicasPermitidas.join(', ')}. Ex.: ${exemplo}` });
    else if (!tecnicasPermitidas.includes(tecnicas[0] ?? '')) v.push({ ...base, problema: `tecnica "${tecnicas[0]}" nao consta em harness/config/politica.json.`, comoCorrigir: `Use um dos codigos CTFL: ${tecnicasPermitidas.join(', ')}. Tecnica fora do syllabus deve ser registrada como extensao na politica.` });

    if (reqIds.length === 0) v.push({ ...base, problema: `teste "${t.titulo}" sem @req.`, comoCorrigir: `Adicione @req:<ID> apontando para um requisito em sistemas/<sut>/docs/rastreabilidade.json. ${exemplo}` });
    for (const id of reqIds) if (!reqs.has(id)) v.push({ ...base, problema: `@req:${id} nao existe em sistemas/<sut>/docs/rastreabilidade.json.`, comoCorrigir: `Cadastre o requisito ${id} em "requisitos" ou corrija a tag.` });

    if (riscoIds.length === 0) v.push({ ...base, problema: `teste "${t.titulo}" sem @risco.`, comoCorrigir: `Adicione @risco:<ID> (docs/analise-de-risco.md). Sem risco nao ha como priorizar a regressao.` });
    for (const id of riscoIds) if (!riscos.has(id)) v.push({ ...base, problema: `@risco:${id} nao existe em sistemas/<sut>/docs/rastreabilidade.json.`, comoCorrigir: `Cadastre o risco ${id} em "riscos" ou corrija a tag.` });

    if (coberturas.length === 0) v.push({ ...base, problema: `teste "${t.titulo}" sem @cobertura.`, comoCorrigir: `Adicione @cobertura:<ID do item de cobertura> (particao, limite, regra da tabela de decisao, transicao ou ramo). Se o teste nao satisfaz item algum, ele e candidato a remocao.` });
    for (const id of coberturas) {
      const item = itens.get(id);
      if (!item) { v.push({ ...base, problema: `@cobertura:${id} nao existe no plano.`, comoCorrigir: `Derive o item primeiro (skill /derivar-casos-de-teste) e registre em "itensDeCobertura".` }); continue; }
      cobertos.add(id);
      if (tecnicas[0] && item.tecnica !== tecnicas[0]) v.push({ ...base, problema: `item ${id} foi derivado por ${item.tecnica}, mas o teste declara ${tecnicas[0]}.`, comoCorrigir: `Alinhe a tag @tecnica com a tecnica do item, ou corrija o item no plano.` });
      if (reqIds.length > 0 && !reqIds.includes(item.requisito)) v.push({ ...base, problema: `item ${id} pertence a ${item.requisito}, mas o teste declara @req:${reqIds.join(',')}.`, comoCorrigir: `Use @req:${item.requisito}.` });
    }
  }

  for (const item of dados.itensDeCobertura) {
    if (item.manual === true || cobertos.has(item.id)) continue;
    v.push({ sensor: SENSOR, arquivo: 'sistemas/*/docs/rastreabilidade.json', problema: `item de cobertura ${item.id} (${item.tecnica}: ${item.descricao}) do requisito ${item.requisito} nao tem teste automatizado.`, comoCorrigir: `Crie um teste com { tag: ['@cobertura:${item.id}', '@tecnica:${item.tecnica}', '@req:${item.requisito}', '@risco:<ID>'] } (use "npm run novo-teste"), ou marque "manual": true com justificativa em docs/planos.` });
  }
  for (const r of dados.requisitos) if (!riscos.has(r.risco)) v.push({ sensor: SENSOR, arquivo: 'sistemas/*/docs/rastreabilidade.json', problema: `requisito ${r.id} aponta para risco inexistente ${r.risco}.`, comoCorrigir: `Cadastre o risco ou corrija a referencia.` });
  return v;
}

export function executar(): Violacao[] {
  return analisar(listarTestes(), carregarDados(), carregarPolitica().tecnicasPermitidas);
}
