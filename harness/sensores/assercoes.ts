import ts from 'typescript';
import { abrir, encontrarTestes, linhaDe, percorrer, raizDaChamada } from './lib/ast.js';
import { listarTs } from './lib/arquivos.js';
import { carregarPolitica } from './lib/politica.js';
import type { Violacao } from './lib/relatorio.js';

const SENSOR = 'assercoes';
const MATCHERS_FRACOS = new Set(['toBeTruthy', 'toBeFalsy', 'toBeDefined', 'toBeUndefined', 'toBeNull']);
const ESPERAS_FIXAS = new Set(['waitForTimeout', 'sleep', 'delay']);

export function analisarArquivo(arquivo: string): Violacao[] {
  const v: Violacao[] = [];
  const sf = abrir(arquivo);
  const testes = encontrarTestes(sf);
  const max = carregarPolitica().maxTestesPorArquivo;
  if (testes.length > max) v.push({ sensor: SENSOR, arquivo, problema: `${testes.length} testes no arquivo (max ${max}).`, comoCorrigir: 'Divida por comportamento/requisito em arquivos menores (SRP).' });

  for (const t of testes) {
    const local = { sensor: SENSOR, arquivo, linha: linhaDe(sf, t.chamada) };
    if (!t.corpo) { v.push({ ...local, problema: `teste "${t.titulo}" sem corpo executavel.`, comoCorrigir: 'Implemente o teste ou remova-o. Nao use test.fixme sem defeito registrado.' }); continue; }

    let expects = 0;
    const matchers: string[] = [];
    percorrer(t.corpo, (n) => {
      if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === 'expect') {
        expects++;
        const [arg] = n.arguments;
        if (arg && (ts.isLiteralExpression(arg) || arg.kind === ts.SyntaxKind.TrueKeyword || arg.kind === ts.SyntaxKind.FalseKeyword)) {
          v.push({ ...local, linha: linhaDe(sf, n), problema: `asserção trivial: expect(${arg.getText(sf)}) compara um literal.`, comoCorrigir: 'Chame o comportamento sob teste, capture o resultado e asserte sobre ele com o valor esperado derivado da tecnica (partição/limite/regra).' });
        }
      }
      if (ts.isCallExpression(n) && ts.isPropertyAccessExpression(n.expression) && raizDaChamada(n.expression) === 'expect') matchers.push(n.expression.name.text);
      if (ts.isIfStatement(n) || ts.isConditionalExpression(n) || ts.isSwitchStatement(n) || ts.isForStatement(n) || ts.isForOfStatement(n) || ts.isWhileStatement(n)) {
        v.push({ ...local, linha: linhaDe(sf, n), problema: 'logica condicional/laco dentro do teste.', comoCorrigir: 'Um teste = um caminho. Mova variacoes para dados (array de casos gerando um test() por caso, fora do corpo).' });
      }
      if (ts.isCallExpression(n)) {
        const nome = ts.isPropertyAccessExpression(n.expression) ? n.expression.name.text : ts.isIdentifier(n.expression) ? n.expression.text : '';
        if (ESPERAS_FIXAS.has(nome) || (nome === 'setTimeout' && ts.isIdentifier(n.expression))) {
          v.push({ ...local, linha: linhaDe(sf, n), problema: `espera fixa (${nome}).`, comoCorrigir: 'Use espera por condicao: expect(locator).toBeVisible(), expect.poll(...) ou waitForResponse. Sleep fixo e fonte de flakiness.' });
        }
      }
    });
    if (expects === 0) v.push({ ...local, problema: `teste "${t.titulo}" sem asserção (expect).`, comoCorrigir: 'Adicione ao menos uma asserção especifica sobre o resultado observavel. Teste sem oraculo nao detecta defeito.' });
    else if (matchers.length > 0 && matchers.every((m) => MATCHERS_FRACOS.has(m))) v.push({ ...local, problema: `teste "${t.titulo}" so usa matchers fracos (${[...new Set(matchers)].join(', ')}).`, comoCorrigir: 'Troque por toBe/toEqual/toStrictEqual/toHaveText com o valor exato esperado; matcher fraco passa com resultado errado.' });
    if (expects > 3) v.push({ ...local, problema: `${expects} asserções no teste "${t.titulo}".`, comoCorrigir: 'Um teste verifica um comportamento. Divida em testes ou agrupe as asserções sobre um unico objeto com toEqual.' });
  }
  return v;
}

export function executar(): Violacao[] {
  return listarTs('tests', '.spec.ts').flatMap(analisarArquivo);
}
