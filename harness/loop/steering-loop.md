# Steering loop — when the same defect escapes twice

1. **Record**: in the DEF, note the level where it should have been caught and which control failed (guide, computational sensor, inferential sensor, human review).
2. **1st escape**: fix the defect; add a confirmation test with `@risk`; adjust the risk (probability ↑) in the plan.
3. **2nd escape of the same type** (same root cause or same missing coverage item): changing the harness itself, not just the test, is mandatory. Pick the cheapest, most deterministic action:
   - a technique/partition was missing → update the `/derive-test-cases` skill or the EG catalog;
   - a statically detectable pattern → a new computational sensor in `harness/sensors` (with HOW TO FIX) or a rule in `structural.ts`/ESLint;
   - judgment → a new criterion in `/review-test` or in the rubric at `harness/sensors/inferential/assertion-judge.md`;
   - integration/environment → move the scenario to a lower level of the pyramid.
4. **Prove it**: the new control must fail against the code/test that let the defect through (a test of the sensor) and pass after the fix.
5. **Record** the change in the commit (`chore: …`) and cite the DEF. Quarterly review: controls that never fire are candidates for removal.
