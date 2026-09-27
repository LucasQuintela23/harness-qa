# Incremental roadmap (implementation cost x defect prevented)

| When | Deliver | Why |
|---|---|---|
| Week 1 | tsc strict + ESLint; commit-msg/pre-commit hooks; AGENTS.md; `assertions` sensor; `traceability` sensor with 1 real requirement; CI stages 1–2 | Low cost, prevents the largest class of useless tests (no oracle, no traceability) |
| Week 1 | `/derive-test-cases` and plan template; replace `src/example` with the real SUT | Ensures technique and risk enter from the very first test |
| Month 1 | `structural` and `duplicates` sensors tuned to the SUT; c8 coverage as an exit criterion; `flakiness` and `suite-time` in CI; real contracts/clients/page objects; matrix generated on PR | Protects the test architecture and keeps the suite fast before it grows |
| Month 1 | Exploratory charters for high/critical risk; regression strategy by risk tag | Covers what automation doesn't see |
| Quarter | Mutation on PR (Stryker) with a break threshold; scheduled `drift` with persisted history; `/audit-risk-coverage` per release; sampled LLM-as-judge; formalized steering loop with escape metrics | Higher cost, and the payoff depends on a stable base |
