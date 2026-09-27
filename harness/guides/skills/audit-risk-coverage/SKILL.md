---
name: audit-risk-coverage
description: Audits whether test coverage tracks product risk; flags gaps and excesses. Use per release and after an escaped defect.
---
# /audit-risk-coverage
1. Run `npm run matrix` and `npm run sensors:drift`; read `docs/traceability/MATRIX.md`.
2. Per risk level: % of requirements with covered items, technique depth against `docs/risk-analysis.md`.
3. Look for: critical/high requirements covered only with EP; "manual" items with no charter; excess tests on low risk; defect clustering (modules with recurring DEF) with no reinforcement.
4. Compare escaped defects against coverage items: was an item missing (derivation) or was it just not executed?
5. Output: a gap table ranked by risk x cost, recommendations, and, if a defect escaped repeatedly, trigger `harness/loop/steering-loop.md`.
