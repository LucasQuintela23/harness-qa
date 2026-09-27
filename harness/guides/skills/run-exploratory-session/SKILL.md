---
name: run-exploratory-session
description: Generates and supports an exploratory (session-based) charter for risks the automated suite doesn't cover.
---
# /run-exploratory-session <area or risk>
1. Pick risks with no automated coverage or `manual` items in the matrix.
2. Fill in `docs/templates/exploratory-charter.md` at `docs/charters/EXPL-<id>.md` (mission, heuristics, EG catalog, 60–90 min duration).
3. During the session, record notes and defects (`docs/templates/defect-report.md`).
4. Debrief: turn findings into EG/CHK items in `docs/traceability` and new tests; update the EG catalog.
The agent proposes charters and organizes notes; the exploration itself and the judgment are human.
