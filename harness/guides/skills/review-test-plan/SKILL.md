---
name: review-test-plan
description: Static review of a test plan (docs/templates/test-plan.md) against CTFL criteria. Use before implementing.
---
# /review-test-plan <file>
Checklist (each failure becomes a finding with a suggested fix):
1. Scope and test items clear; out of scope stated.
2. Risks with P x I and a level; high/critical-risk requirements have matching depth.
3. Technique section per level and type: each row has a technique, variant, coverage item, and justification; no technique outside the syllabus without an extension marker.
4. Allocation by pyramid/quadrants: is there E2E where component testing would do?
5. Measurable entry/exit criteria; DoR/DoD referenced.
6. The requirement → risk → technique → item → case → run matrix is complete (`npm run matrix`); items with no test have a manual justification.
7. Data, environments, secrets (by name), suspension and resumption, regression by risk.
8. Are the requirements testable? Ambiguities listed as questions.
Output: prioritized findings (blocking/important/suggestion) and a verdict.
