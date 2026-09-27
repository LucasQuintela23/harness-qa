import ts from 'typescript';
import { open, findTests, lineOf, walk, callRoot } from './lib/ast.js';
import { listTs } from './lib/files.js';
import { loadPolicy } from './lib/policy.js';
import type { Violation } from './lib/report.js';

const SENSOR = 'assertions';
const WEAK_MATCHERS = new Set(['toBeTruthy', 'toBeFalsy', 'toBeDefined', 'toBeUndefined', 'toBeNull']);
const FIXED_WAITS = new Set(['waitForTimeout', 'sleep', 'delay']);

export function analyzeFile(file: string): Violation[] {
  const v: Violation[] = [];
  const sf = open(file);
  const tests = findTests(sf);
  const max = loadPolicy().maxTestsPerFile;
  if (tests.length > max) v.push({ sensor: SENSOR, file, problem: `${tests.length} tests in the file (max ${max}).`, howToFix: 'Split by behavior/requirement into smaller files (SRP).' });

  for (const t of tests) {
    const local = { sensor: SENSOR, file, line: lineOf(sf, t.call) };
    if (!t.body) { v.push({ ...local, problem: `test "${t.title}" has no executable body.`, howToFix: 'Implement the test or remove it. Do not use test.fixme without a registered defect.' }); continue; }

    let expects = 0;
    const matchers: string[] = [];
    walk(t.body, (n) => {
      if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === 'expect') {
        expects++;
        const [arg] = n.arguments;
        if (arg && (ts.isLiteralExpression(arg) || arg.kind === ts.SyntaxKind.TrueKeyword || arg.kind === ts.SyntaxKind.FalseKeyword)) {
          v.push({ ...local, line: lineOf(sf, n), problem: `trivial assertion: expect(${arg.getText(sf)}) compares a literal.`, howToFix: 'Call the behavior under test, capture the result, and assert on it with the expected value derived from the technique (partition/boundary/rule).' });
        }
      }
      if (ts.isCallExpression(n) && ts.isPropertyAccessExpression(n.expression) && callRoot(n.expression) === 'expect') matchers.push(n.expression.name.text);
      if (ts.isIfStatement(n) || ts.isConditionalExpression(n) || ts.isSwitchStatement(n) || ts.isForStatement(n) || ts.isForOfStatement(n) || ts.isWhileStatement(n)) {
        v.push({ ...local, line: lineOf(sf, n), problem: 'conditional logic/loop inside the test.', howToFix: 'One test = one path. Move variations into data (an array of cases generating one test() per case, outside the body).' });
      }
      if (ts.isCallExpression(n)) {
        const name = ts.isPropertyAccessExpression(n.expression) ? n.expression.name.text : ts.isIdentifier(n.expression) ? n.expression.text : '';
        if (FIXED_WAITS.has(name) || (name === 'setTimeout' && ts.isIdentifier(n.expression))) {
          v.push({ ...local, line: lineOf(sf, n), problem: `fixed wait (${name}).`, howToFix: 'Use a condition-based wait: expect(locator).toBeVisible(), expect.poll(...), or waitForResponse. A fixed sleep is a source of flakiness.' });
        }
      }
    });
    if (expects === 0) v.push({ ...local, problem: `test "${t.title}" has no assertion (expect).`, howToFix: 'Add at least one specific assertion on the observable result. A test without an oracle does not detect defects.' });
    else if (matchers.length > 0 && matchers.every((m) => WEAK_MATCHERS.has(m))) v.push({ ...local, problem: `test "${t.title}" only uses weak matchers (${[...new Set(matchers)].join(', ')}).`, howToFix: 'Use toBe/toEqual/toStrictEqual/toHaveText with the exact expected value; a weak matcher passes even with a wrong result.' });
    if (expects > 3) v.push({ ...local, problem: `${expects} assertions in test "${t.title}".`, howToFix: 'A test verifies one behavior. Split into multiple tests or group the assertions on a single object with toEqual.' });
  }
  return v;
}

export function run(): Violation[] {
  return listTs('tests', '.spec.ts').flatMap(analyzeFile);
}
