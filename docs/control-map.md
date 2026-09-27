# Control map

| Control | Direction | Type | Dimension | Moment | What it prevents |
|---|---|---|---|---|---|
| AGENTS.md + technique catalog | guide | inferential | maintainability / SUT behavior | before writing | test with no technique or off convention |
| Skill `/derive-test-cases` | guide | inferential | SUT behavior | before writing | forgotten partitions/boundaries/rules |
| Skill `/run-exploratory-session`, templates, charters | guide | inferential | SUT behavior | outside the cycle / release | risk with no automated coverage |
| Scaffold `new-test` | guide | computational | maintainability | before writing | missing metadata, off-pattern name |
| Contracts `support/contracts`, builders, `EnvironmentProvider` | guide | computational | architectural fitness | before writing | coupling to a driver/URL/credential |
| Risk analysis + matrix | guide | computational | SUT behavior | planning | a suite with no prioritization |
| tsc strict + ESLint (+ playwright plugin) | sensor | computational | maintainability | pre-commit | loose types, sleep, conditionals, skip/only |
| `traceability` sensor | sensor | computational | SUT behavior | pre-commit and CI | test with no technique/req/risk; coverage item with no test |
| `assertions` sensor | sensor | computational | maintainability | pre-commit and CI | test with no oracle, trivial/weak assertion |
| `duplicates` sensor | sensor | computational | maintainability | pre-commit and CI | literal duplication (pesticide) |
| `structural` sensor (E1–E8) | sensor | computational | architectural fitness | pre-commit and CI | violated layers, secret, URL, global state |
| commit-msg hook | sensor | computational | maintainability | commit | off-pattern message |
| c8 coverage (statements+branches) | sensor | computational | SUT behavior | pre-push and CI | component code not exercised (exit criterion) |
| Mutation (Stryker) | sensor | computational | SUT behavior | PR | an assertion that doesn't detect a defect |
| `flakiness` and `suite-time` | sensor | computational | architectural fitness | pre-push and CI | unstable test, slow suite |
| `drift` (accumulated flakiness, dead tests, risk x coverage, dependencies) | sensor | computational | maintainability / architecture | scheduled (outside the cycle) | silent degradation |
| `/review-test`, `/review-test-plan`, assertion judge | sensor | inferential | maintainability / SUT behavior | PR / before coding | weak oracle, semantic duplication, incoherent plan |
| `/audit-risk-coverage` | sensor | inferential | SUT behavior | per release | risk gap |
| Steering loop | guide + sensor | process | all | after the 2nd escape | recurrence of the same defect |
