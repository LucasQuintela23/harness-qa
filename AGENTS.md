# AGENTS.md — quality harness conventions

This repository is a test harness (Playwright + TypeScript). The agent writes and reviews tests; the harness guides beforehand (feedforward) and measures afterward (feedback). Read this before making any change.

## Required flow for a new test
1. Do the requirement and risk exist in `docs/traceability/*.json`? If not, register them (risk: `docs/risk-analysis.md`).
2. Run the `/derive-test-cases` skill: it returns the partition/boundary/decision/state table **before** the code, along with the coverage items.
3. Register the items under `coverageItems`. Generate the skeleton: `npm run new-test -- <level> <name> <TECHNIQUE> <REQ> <RISK> <ITEM>`.
4. Implement it. Validate: `npm run verify`. Fix issues following the HOW TO FIX field of the sensor messages.
5. Commit using the pattern below. Before the PR: `/review-test`.

## Required metadata (`traceability` sensor)
```ts
test('rejects 11 (above the upper boundary)', {
  tag: ['@technique:BVA3', '@req:REQ-EX-001', '@risk:R-EX-001', '@coverage:EX-BV-11'],
}, () => { ... });
```
One `@technique`, at least one `@req`, `@risk`, and `@coverage`. Every coverage item in the plan needs a test (or a justified `"manual": true`).

## Technique catalog (CTFL v4.0) and codes
| Code | Technique | Coverage item |
|---|---|---|
| EP | Equivalence partitioning | each valid and invalid partition |
| BVA2 / BVA3 | Boundary value analysis, 2 or 3 values (declare the variant in the plan) | each boundary value |
| DT | Decision table | each column (rule) |
| ST | State transition | all states, valid transitions, invalid attempts |
| STMT / BRANCH | Statement / branch coverage (white-box, component level) | statements / branches executed |
| EG | Error guessing (catalog in `docs/test-strategy.md`) | defect from the catalog |
| CHK | Checklist-based | checklist item |
| ATDD | Gherkin acceptance criterion (traced back to the originating black-box technique) | acceptance criterion |
| EXPL | Exploratory with a charter (`docs/charters`) | charter executed |
A technique outside the syllabus only enters `harness/config/policy.json` marked as an **extension**.

## Code rules
- SRP: one test, one behavior, at most 3 `expect` calls. Page objects hold no assertions. Builders know nothing about transport.
- OCP: a new scenario means a new data row, not editing a helper.
- LSP/ISP: small contracts in `support/contracts` (≤ 7 members, no implementation); no giant `BasePage`.
- DIP: a test depends on a contract injected via a fixture; never on a concrete driver, URL, or credential (`process.env` only in `support/environment`).
- No `waitForTimeout`/sleep, no `if`/loop inside a test body, no mutable module-level state, no dependency between specs, no `test.only`/`skip` without a registered defect.
- Isolated and deterministic data; secrets only via environment variables (a local `.env` is git-ignored).
- Layer allocation: ask "would the component level catch this?" before writing an E2E test (pyramid/quadrants in `docs/test-strategy.md`).

## Commands
`npm run verify` (fast) · `npm run coverage` (statements/branches: component exit criterion, not a target) · `npm run mutation` · `npm run matrix` · `npm run sensors:{static,report,drift}`.

## Commits (Conventional Commits, no emoji)
`<type>: <description, max. 4 words>`. Types: feat, fix, docs, test, build, perf, style, refactor, chore, ci, raw, cleanup, remove. E.g.: `test: Login scenarios`. The `commit-msg` hook blocks messages with emoji or `:code:` and anything outside this format. No `Co-Authored-By` line. Commit and push only when the user asks.

## Skills (`harness/guides/skills`, also under `.claude/skills`)
`/derive-test-cases` · `/review-test` · `/review-test-plan` · `/audit-risk-coverage` · `/run-exploratory-session`.

## Example data
`src/example`, `tests/component/example`, and `docs/traceability/example.json` are a disposable, fictional example. Delete them once the real SUT is wired up.
