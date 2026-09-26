import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';
import { RAIZ } from './politica.js';

export function abrir(arquivo: string): ts.SourceFile {
  return ts.createSourceFile(arquivo, readFileSync(join(RAIZ, arquivo), 'utf8'), ts.ScriptTarget.Latest, true);
}

export function linhaDe(sf: ts.SourceFile, no: ts.Node): number {
  return sf.getLineAndCharacterOfPosition(no.getStart(sf)).line + 1;
}

export function raizDaChamada(expr: ts.Expression): string | undefined {
  let atual: ts.Expression = expr;
  for (;;) {
    if (ts.isCallExpression(atual)) atual = atual.expression;
    else if (ts.isPropertyAccessExpression(atual)) atual = atual.expression;
    else if (ts.isNonNullExpression(atual) || ts.isParenthesizedExpression(atual) || ts.isAwaitExpression(atual)) atual = atual.expression;
    else break;
  }
  return ts.isIdentifier(atual) ? atual.text : undefined;
}

export function percorrer(no: ts.Node, visitante: (n: ts.Node) => void): void {
  visitante(no);
  ts.forEachChild(no, (filho) => { percorrer(filho, visitante); });
}

export interface ChamadaDeTeste { chamada: ts.CallExpression; titulo: string; corpo: ts.Node | undefined }

export function encontrarTestes(sf: ts.SourceFile): ChamadaDeTeste[] {
  const achados: ChamadaDeTeste[] = [];
  percorrer(sf, (n) => {
    if (!ts.isCallExpression(n)) return;
    const f = n.expression;
    const ehTeste =
      (ts.isIdentifier(f) && (f.text === 'test' || f.text === 'it')) ||
      (ts.isPropertyAccessExpression(f) && ts.isIdentifier(f.expression) && f.expression.text === 'test' && ['only', 'skip', 'fixme', 'fail', 'slow'].includes(f.name.text));
    if (!ehTeste) return;
    const [primeiro] = n.arguments;
    if (!primeiro || !(ts.isStringLiteralLike(primeiro) || ts.isTemplateExpression(primeiro))) return;
    const ultimo = n.arguments[n.arguments.length - 1];
    const corpo = ultimo && (ts.isArrowFunction(ultimo) || ts.isFunctionExpression(ultimo)) ? ultimo.body : undefined;
    achados.push({ chamada: n, titulo: primeiro.getText(sf).slice(1, -1), corpo });
  });
  return achados;
}
