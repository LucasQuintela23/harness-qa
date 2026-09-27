---
name: derive-test-cases
description: Takes a requirement and returns test cases derived by CTFL technique (EP, BVA, DT, ST), with the table made explicit before the code. Use it whenever starting a new test.
---
# /derive-test-cases <requirement>

1. **Understand the requirement.** If it's ambiguous or untestable, stop and list the questions (static testing); don't invent rules.
2. **Risk and level.** Check `docs/traceability/*.json`/`docs/risk-analysis.md`; if missing, propose P, I, and a level. Pick the lowest test level able to detect the defect (pyramid).
3. **Choose the technique** and justify it:
   - numeric/range domain → EP + BVA (declare **BVA2 or BVA3**; high/critical risk → BVA3);
   - combinatorial rules → decision table (DT), reducing impossible columns with a justification;
   - lifecycle/states → ST: all states, all valid transitions, invalid transitions;
   - component code → supplement with STMT/BRANCH as a minimum criterion;
   - domain-specific suspicions → EG from the catalog; broad flows → CHK/EXPL.
4. **Emit the tables BEFORE any code**: partitions (valid/invalid), boundaries with values, DT columns, states x events.
5. **Assign coverage item IDs** and generate the JSON for `coverageItems` (`id, requirement, technique, description`).
6. **Cases**: one per item (or per justified combination), with the exact expected value. Write the test per `AGENTS.md`, with tags `@technique @req @risk @coverage`, scenarios driven by data (no `if` in the test).
7. **Run** `npm run verify` and fix issues per HOW TO FIX. If ATDD, write the Gherkin and note which black-box technique each scenario came from.
Output: (a) questions/assumptions, (b) tables, (c) items JSON, (d) code, (e) what needs a manual/exploratory test.
