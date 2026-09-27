import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';
import { ROOT } from './policy.js';

export function open(file: string): ts.SourceFile {
  return ts.createSourceFile(file, readFileSync(join(ROOT, file), 'utf8'), ts.ScriptTarget.Latest, true);
}

export function lineOf(sf: ts.SourceFile, node: ts.Node): number {
  return sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
}

export function callRoot(expr: ts.Expression): string | undefined {
  let current: ts.Expression = expr;
  for (;;) {
    if (ts.isCallExpression(current)) current = current.expression;
    else if (ts.isPropertyAccessExpression(current)) current = current.expression;
    else if (ts.isNonNullExpression(current) || ts.isParenthesizedExpression(current) || ts.isAwaitExpression(current)) current = current.expression;
    else break;
  }
  return ts.isIdentifier(current) ? current.text : undefined;
}

export function walk(node: ts.Node, visitor: (n: ts.Node) => void): void {
  visitor(node);
  ts.forEachChild(node, (child) => { walk(child, visitor); });
}

export interface TestCall { call: ts.CallExpression; title: string; body: ts.Node | undefined }

export function findTests(sf: ts.SourceFile): TestCall[] {
  const found: TestCall[] = [];
  walk(sf, (n) => {
    if (!ts.isCallExpression(n)) return;
    const f = n.expression;
    const isTest =
      (ts.isIdentifier(f) && (f.text === 'test' || f.text === 'it')) ||
      (ts.isPropertyAccessExpression(f) && ts.isIdentifier(f.expression) && f.expression.text === 'test' && ['only', 'skip', 'fixme', 'fail', 'slow'].includes(f.name.text));
    if (!isTest) return;
    const [first] = n.arguments;
    if (!first || !(ts.isStringLiteralLike(first) || ts.isTemplateExpression(first))) return;
    const last = n.arguments[n.arguments.length - 1];
    const body = last && (ts.isArrowFunction(last) || ts.isFunctionExpression(last)) ? last.body : undefined;
    found.push({ call: n, title: first.getText(sf).slice(1, -1), body });
  });
  return found;
}
