---
name: review-test
description: Reviews an automated test for oracle quality, technique, traceability, isolation, and SOLID/Clean Code. Use before opening a PR.
---
# /review-test <file|diff>
Run `npm run verify` first; only review what the sensors don't catch. For each test, answer:
1. Does the oracle come from the requirement (not the implementation)? Is the expected value exact?
2. Would it fail if the behavior broke? (apply a mental mutant; check `reports/mutation.json` if it exists)
3. Does the data exercise the declared coverage item? Do the technique and variant (BVA2/BVA3) match the plan?
4. One behavior per test, title describes the behavior, no order dependency, no shared state?
5. Is it at the right pyramid level? Is there semantic duplication with another test (same item, equivalent data)?
6. DIP/ISP: does it depend on an injected contract, with no URL/secret/driver?
Output: a list `file:line — problem — how to fix`, and a verdict (approve / adjust / reject). Don't rewrite the test unless asked.
