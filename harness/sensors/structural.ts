import ts from 'typescript';
import { open, lineOf, walk } from './lib/ast.js';
import { listTs } from './lib/files.js';
import type { Violation } from './lib/report.js';

const SENSOR = 'structural';
const DRIVERS = new Set(['chromium', 'firefox', 'webkit', 'request', '_electron', '_android']);
const SECRET = /(password|secret|token|apikey|api_key)/i;

interface Rule { id: string; where: string; suffix?: string; check: (sf: ts.SourceFile, file: string) => Violation[] }

const v = (file: string, sf: ts.SourceFile, node: ts.Node, problem: string, howToFix: string): Violation => ({ sensor: SENSOR, file, line: lineOf(sf, node), problem, howToFix });

const imports = (sf: ts.SourceFile): ts.ImportDeclaration[] => sf.statements.filter(ts.isImportDeclaration);
const module_ = (i: ts.ImportDeclaration): string => (ts.isStringLiteral(i.moduleSpecifier) ? i.moduleSpecifier.text : '');

const RULES: Rule[] = [
  { id: 'E1', where: 'support/page-objects', check: (sf, a) => {
    const r: Violation[] = [];
    walk(sf, (n) => { if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === 'expect') r.push(v(a, sf, n, 'E1 page object contains an assertion (SRP).', 'A page object exposes state (e.g. async errorMessage(): Promise<string>); the assertion belongs in the test.')); });
    return r;
  } },
  { id: 'E2', where: 'support/builders', check: (sf, a) => imports(sf).filter((i) => /playwright|node:http|axios|undici/.test(module_(i))).map((i) => v(a, sf, i, `E2 builder imports transport (${module_(i)}).`, 'A builder only assembles data. Sending belongs to a client in support/clients behind a contract in support/contracts (DIP).')) },
  { id: 'E3', where: 'tests', suffix: '.spec.ts', check: (sf, a) => {
    const r: Violation[] = [];
    for (const i of imports(sf)) {
      const names = i.importClause?.namedBindings;
      if (module_(i) === '@playwright/test' && names && ts.isNamedImports(names)) for (const el of names.elements) if (DRIVERS.has(el.name.text)) r.push(v(a, sf, i, `E3 test imports a concrete driver "${el.name.text}".`, 'Use fixtures (page, request) or a support/contracts contract provided by a fixture.'));
      if (/\.spec(\.js)?$/.test(module_(i))) r.push(v(a, sf, i, 'E3 test imports another spec (dependency between tests).', 'Extract the shared code into support/ (builder/fixture). Tests must be independent.'));
      if (/support\/(page-objects|clients)\/[^/]*(Impl|Http|Playwright)/.test(module_(i))) r.push(v(a, sf, i, 'E3 test imports a concrete implementation.', 'Depend on the contract in support/contracts; the implementation is injected by a fixture.'));
    }
    return r;
  } },
  { id: 'E4', where: 'tests', suffix: '.spec.ts', check: (sf, a) => {
    const r: Violation[] = [];
    walk(sf, (n) => {
      if ((ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) && /^https?:\/\//.test(n.text)) r.push(v(a, sf, n, `E4 literal URL "${n.text}" in the test.`, 'Get it from EnvironmentProvider (support/environment) via a fixture; a URL comes from an environment variable.'));
      if (ts.isPropertyAccessExpression(n) && n.expression.getText(sf) === 'process.env') r.push(v(a, sf, n, 'E4 direct process.env access in the test.', 'Read the environment only in support/environment/EnvironmentProvider.ts.'));
    });
    return r;
  } },
  { id: 'E5', where: 'tests', suffix: '.spec.ts', check: (sf, a) => sf.statements.filter(ts.isVariableStatement)
    .filter((s) => !(s.declarationList.flags & ts.NodeFlags.Const))
    .map((s) => v(a, sf, s, 'E5 mutable state at module scope (let/var).', 'Use const, or create the state inside the test/fixture. Global state breaks parallelism and idempotency.')) },
  { id: 'E6', where: 'support/contracts', check: (sf, a) => {
    const r: Violation[] = [];
    for (const s of sf.statements) {
      if (ts.isInterfaceDeclaration(s) && s.members.length > 7) r.push(v(a, sf, s, `E6 interface ${s.name.text} has ${s.members.length} members (max 7, ISP).`, 'Split by capability (e.g. Authenticatable, Queryable).'));
      if (ts.isClassDeclaration(s) || ts.isFunctionDeclaration(s)) r.push(v(a, sf, s, 'E6 contract with implementation.', 'Contracts contain only interfaces/types. Move the implementation to support/clients or support/page-objects.'));
    }
    return r;
  } },
  { id: 'E7', where: 'src', check: (sf, a) => imports(sf).filter((i) => /\/(tests|support)\//.test(module_(i)) || /^\.\.?\/.*\b(tests|support)\b/.test(module_(i))).map((i) => v(a, sf, i, 'E7 product code imports test/support code.', 'Dependencies only point from tests to the product, never the other way around.')) },
  { id: 'E8', where: '.', check: (sf, a) => {
    const r: Violation[] = [];
    walk(sf, (n) => {
      if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && SECRET.test(n.name.text) && n.initializer && ts.isStringLiteralLike(n.initializer) && n.initializer.text.length > 0) r.push(v(a, sf, n, `E8 possible secret in a literal (${n.name.text}).`, 'Secrets come from an environment variable via EnvironmentProvider; use a local .env and CI secrets.'));
      if (ts.isPropertyAssignment(n) && SECRET.test(n.name.getText(sf)) && ts.isStringLiteralLike(n.initializer) && n.initializer.text.length > 0) r.push(v(a, sf, n, `E8 possible secret in a literal (${n.name.getText(sf)}).`, 'Secrets come from an environment variable via EnvironmentProvider; use a local .env and CI secrets.'));
    });
    return r;
  } },
];

export function run(): Violation[] {
  const result: Violation[] = [];
  for (const rule of RULES) {
    const targets = rule.where === '.' ? [...listTs('src'), ...listTs('support'), ...listTs('tests')] : listTs(rule.where, rule.suffix ?? '.ts');
    for (const file of targets) result.push(...rule.check(open(file), file));
  }
  return result;
}
