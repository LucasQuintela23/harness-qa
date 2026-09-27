# Test strategy

## Principles (CTFL 4.0) and the decision each one justifies
| Principle | Decision in the harness |
|---|---|
| Testing shows presence, not absence, of defects | The report never says "no defects"; it says "coverage items executed and residual risk" |
| Exhaustive testing is impossible | Formal techniques narrow the space; prioritization by risk |
| Early testing saves | Guides and sensors at pre-commit; static review of the requirement/plan before coding |
| Defect clustering | Risk and regression prioritize modules with a history of defects |
| Pesticide paradox | `duplicates` sensor; quarterly review of the suites; exploratory testing refreshes the set |
| Testing is context dependent | Time and coverage budgets per level in `policy.json` |
| Absence-of-errors is a fallacy | Acceptance (ATDD) validates what the user needs, not just conformance to the spec |

## Levels and allocation (pyramid + quadrants)
| CTFL level | Folder | Typical techniques | Budget |
|---|---|---|---|
| Component | `tests/component` | EP, BVA, DT, ST, STMT, BRANCH | 30 s |
| Component integration | `tests/contract`, `tests/integration` | EP, DT, EG | 60–180 s |
| System | `tests/e2e`, `tests/accessibility` | ST, CHK, ATDD | 600 s |
| System integration / Acceptance | `tests/e2e` (ATDD tag), `tests/exploratory` | ATDD, EXPL | per release |
Allocation rule: a scenario goes to the lowest level able to detect the defect. E2E only for value flows and real integration. Types: functional, non-functional (k6 in `tests/performance`, accessibility), white-box (component), and change-related (confirmation + regression).

## Confirmation and regression
Defect fix → confirmation test (the reproduction becomes an automated test with `@risk`) + regression. The regression suite is selected by risk: `--grep "@risk:<high/critical-level ids>"` on every change; the full suite runs nightly. Justification recorded in the test plan.

## Risk
Probability x impact in `docs/risk-analysis.md`. The level sets the minimum requirement coverage (`drift.minRiskCoveragePerLevel`) and technique depth (critical/high: BVA3 + DT + ST; medium: EP + BVA2; low: EP/CHK).

## Criteria
- **Definition of Ready** for a requirement: testable (Gherkin acceptance criteria), risk assigned, statically reviewed (checklist in `/review-test-plan`).
- Level **entry**: build available, environment and data ready, static sensors green.
- Component **exit**: 100% of the plan's coverage items, statements and branches covered (`.c8rc.json`, a minimum criterion, not a target), mutation score ≥ 75 (break) / 90 (target). System/acceptance: high/critical-risk items executed, critical defects at zero, exploratory testing executed.
- **Definition of Done**: test with metadata, sensors green, matrix updated, review done.

## Static testing
Requirement and plan review before coding (`/review-test-plan`), lint, types, and structural sensors are the "quality left" control.

## Error guessing catalog (seed; extend per domain)
Null/empty/whitespace, wrong type, Unicode and extreme length, double submission, concurrency on the same entity, timezone and date rollover, monetary rounding, another user's permission, idempotent retry, partial timeout.

## Exploratory testing
Session-based, 60–90 min, versioned charters in `docs/charters` (template in `docs/templates`), the debrief produces defects and new EG/CHK items.

## Defect structure
Template in `docs/templates/defect-report.md` (CTFL fields: identifier, title, date, organization/author, context, description, expected/actual result, severity, priority, status, references).

## Open decisions
| Decision | Recommended | Alternative / criterion |
|---|---|---|
| Mutation runner | Stryker `commandRunner` over the `component` project (no native Playwright runner) | Migrate component to Vitest (native runner) if mutation time exceeds ~10 min |
| Coverage | c8 (V8), component only | E2E coverage is not a criterion; use risk coverage instead |
| Flakiness history | `reports/history.jsonl` in CI cache/artifact | A database/Grafana if more than one repository consumes it |
