import ts from 'typescript';
import { abrir, linhaDe, percorrer } from './lib/ast.js';
import { listarTs } from './lib/arquivos.js';
import type { Violacao } from './lib/relatorio.js';

const SENSOR = 'estrutural';
const DRIVERS = new Set(['chromium', 'firefox', 'webkit', 'request', '_electron', '_android']);
const SEGREDO = /(password|senha|token|secret|apikey|api_key)/i;

interface Regra { id: string; onde: string; sufixo?: string; verificar: (sf: ts.SourceFile, arquivo: string) => Violacao[] }

const v = (arquivo: string, sf: ts.SourceFile, no: ts.Node, problema: string, comoCorrigir: string): Violacao => ({ sensor: SENSOR, arquivo, linha: linhaDe(sf, no), problema, comoCorrigir });

const importacoes = (sf: ts.SourceFile): ts.ImportDeclaration[] => sf.statements.filter(ts.isImportDeclaration);
const modulo = (i: ts.ImportDeclaration): string => (ts.isStringLiteral(i.moduleSpecifier) ? i.moduleSpecifier.text : '');

const REGRAS: Regra[] = [
  { id: 'E1', onde: 'support/page-objects', verificar: (sf, a) => {
    const r: Violacao[] = [];
    percorrer(sf, (n) => { if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === 'expect') r.push(v(a, sf, n, 'E1 page object contem asserção (SRP).', 'Page object expoe estado (ex.: async mensagemDeErro(): Promise<string>); a asserção fica no teste.')); });
    return r;
  } },
  { id: 'E2', onde: 'support/builders', verificar: (sf, a) => importacoes(sf).filter((i) => /playwright|node:http|axios|undici/.test(modulo(i))).map((i) => v(a, sf, i, `E2 builder importa transporte (${modulo(i)}).`, 'Builder so monta dados. Envio pertence a um client em support/clients atras de um contrato em support/contratos (DIP).')) },
  { id: 'E3', onde: 'tests', sufixo: '.spec.ts', verificar: (sf, a) => {
    const r: Violacao[] = [];
    for (const i of importacoes(sf)) {
      const nomes = i.importClause?.namedBindings;
      if (modulo(i) === '@playwright/test' && nomes && ts.isNamedImports(nomes)) for (const el of nomes.elements) if (DRIVERS.has(el.name.text)) r.push(v(a, sf, i, `E3 teste importa driver concreto "${el.name.text}".`, 'Use as fixtures (page, request) ou um contrato de support/contratos fornecido por fixture.'));
      if (/\.spec(\.js)?$/.test(modulo(i))) r.push(v(a, sf, i, 'E3 teste importa outro spec (dependencia entre testes).', 'Extraia o compartilhado para support/ (builder/fixture). Testes devem ser independentes.'));
      if (/support\/(page-objects|clients)\/[^/]*(Impl|Http|Playwright)/.test(modulo(i))) r.push(v(a, sf, i, 'E3 teste importa implementacao concreta.', 'Dependa do contrato em support/contratos; a implementacao e injetada por fixture.'));
    }
    return r;
  } },
  { id: 'E4', onde: 'tests', sufixo: '.spec.ts', verificar: (sf, a) => {
    const r: Violacao[] = [];
    percorrer(sf, (n) => {
      if ((ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) && /^https?:\/\//.test(n.text)) r.push(v(a, sf, n, `E4 URL literal "${n.text}" no teste.`, 'Obtenha de ProvedorDeAmbiente (support/ambiente) via fixture; URL vem de variavel de ambiente.'));
      if (ts.isPropertyAccessExpression(n) && n.expression.getText(sf) === 'process.env') r.push(v(a, sf, n, 'E4 acesso direto a process.env no teste.', 'Leia ambiente somente em support/ambiente/ProvedorDeAmbiente.ts.'));
    });
    return r;
  } },
  { id: 'E5', onde: 'tests', sufixo: '.spec.ts', verificar: (sf, a) => sf.statements.filter(ts.isVariableStatement)
    .filter((s) => !(s.declarationList.flags & ts.NodeFlags.Const))
    .map((s) => v(a, sf, s, 'E5 estado mutavel no escopo do modulo (let/var).', 'Use const, ou crie o estado dentro do teste/fixture. Estado global quebra paralelismo e idempotencia.')) },
  { id: 'E6', onde: 'support/contratos', verificar: (sf, a) => {
    const r: Violacao[] = [];
    for (const s of sf.statements) {
      if (ts.isInterfaceDeclaration(s) && s.members.length > 7) r.push(v(a, sf, s, `E6 interface ${s.name.text} com ${s.members.length} membros (max 7, ISP).`, 'Divida por capacidade (ex.: Autenticavel, Consultavel).'));
      if (ts.isClassDeclaration(s) || ts.isFunctionDeclaration(s)) r.push(v(a, sf, s, 'E6 contrato com implementacao.', 'Contratos contem so interface/type. Mova a implementacao para support/clients ou support/page-objects.'));
    }
    return r;
  } },
  { id: 'E7', onde: 'src', verificar: (sf, a) => importacoes(sf).filter((i) => /\/(tests|support)\//.test(modulo(i)) || /^\.\.?\/.*\b(tests|support)\b/.test(modulo(i))).map((i) => v(a, sf, i, 'E7 codigo de produto importa teste/suporte.', 'Dependencia so aponta de testes para o produto, nunca o inverso.')) },
  { id: 'E8', onde: '.', verificar: (sf, a) => {
    const r: Violacao[] = [];
    percorrer(sf, (n) => {
      if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && SEGREDO.test(n.name.text) && n.initializer && ts.isStringLiteralLike(n.initializer) && n.initializer.text.length > 0) r.push(v(a, sf, n, `E8 possivel segredo em literal (${n.name.text}).`, 'Segredos vem de variavel de ambiente via ProvedorDeAmbiente; use .env local e secrets do CI.'));
      if (ts.isPropertyAssignment(n) && SEGREDO.test(n.name.getText(sf)) && ts.isStringLiteralLike(n.initializer) && n.initializer.text.length > 0) r.push(v(a, sf, n, `E8 possivel segredo em literal (${n.name.getText(sf)}).`, 'Segredos vem de variavel de ambiente via ProvedorDeAmbiente; use .env local e secrets do CI.'));
    });
    return r;
  } },
];

export function executar(): Violacao[] {
  const resultado: Violacao[] = [];
  for (const regra of REGRAS) {
    const alvo = regra.onde === '.' ? [...listarTs('src'), ...listarTs('support'), ...listarTs('tests')] : listarTs(regra.onde, regra.sufixo ?? '.ts');
    for (const arquivo of alvo) resultado.push(...regra.verificar(abrir(arquivo), arquivo));
  }
  return resultado;
}
