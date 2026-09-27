# LLM-as-judge: assertion quality
Input: requirement, coverage item, test code. Output as JSON `{score:0-2, findings:[{line, problem, howToFix}]}` per criterion. Use a different model from the one that generated the test, and low temperature; sample it (don't run on every commit).
Criteria: (1) the oracle is derived from the requirement, not copied from the implementation; (2) the expected value is specific; (3) the test would fail if the behavior broke (mental mutant); (4) the title describes the behavior; (5) the chosen data exercises the declared coverage item.
Usage: `/review-test` on the PR; the result is a warning, never a block, and it is audited by human sampling.
