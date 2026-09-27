# Risk analysis (product)

Probability (1–5) x Impact (1–5) = severity. Level: **critical** ≥ 20, **high** 12–19, **medium** 6–11, **low** ≤ 5.

| P \ I | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| 5 | 5 low | 10 medium | 15 high | 20 critical | 25 critical |
| 4 | 4 low | 8 medium | 12 high | 16 high | 20 critical |
| 3 | 3 low | 6 medium | 9 medium | 12 high | 15 high |
| 2 | 2 low | 4 low | 6 medium | 8 medium | 10 medium |
| 1 | 1 low | 2 low | 3 low | 4 low | 5 low |

Minimum depth: critical/high → BVA3 + DT/ST + exploratory + regression on every change; medium → EP + BVA2 + nightly regression; low → EP/CHK.
Record: each risk lives in `docs/traceability/*.json` (`id, description, probability, impact, level`) and is referenced by requirement and test (`@risk:`). Reassess after every escaped defect and on every release.

| Risk | Description | P | I | Level | Requirements |
|---|---|---|---|---|---|
| R-EX-002 (example) | A miscalculated discount causes financial loss | 3 | 5 | high | REQ-EX-002 |
