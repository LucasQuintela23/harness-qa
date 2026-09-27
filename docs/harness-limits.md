# What the harness does NOT catch (requires a human or exploratory testing)

- Whether the requirement itself is right: the suite only checks against the spec (absence-of-errors is a fallacy). Validate with the user/product.
- Wrong oracles that happen to match the implementation: mutation testing reduces this, it doesn't eliminate it; human review by sampling.
- Usability, aesthetics, perceived performance, content, accessibility beyond automatable rules (most of it requires manual evaluation).
- Defects emerging from unexpected interaction, real production data, concurrency, and rare infrastructure failures.
- Security: there is no security testing here; it requires specific tools and review (an extension outside CTFL core scope).
- Semantic duplication with different data, and "a test that passes for the wrong reason" (only the LLM-as-judge/a human would suspect this).
- Quality of the risk analysis and its probabilities: this is judgment; recalibrate after every escape.
- Coverage of derived items: the harness guarantees the planned item has a test, not that the right item was planned.
- Low-frequency flakiness and shared-environment effects that don't show up in the sampled runs.
- Ambiguous or implicit requirements: these depend on a conversation with the business and human static review.
