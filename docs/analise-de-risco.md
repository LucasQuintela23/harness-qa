# Análise de risco (produto)

Probabilidade (1–5) x Impacto (1–5) = severidade. Nível: **crítico** ≥ 20, **alto** 12–19, **médio** 6–11, **baixo** ≤ 5.

| P \ I | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| 5 | 5 baixo | 10 médio | 15 alto | 20 crítico | 25 crítico |
| 4 | 4 baixo | 8 médio | 12 alto | 16 alto | 20 crítico |
| 3 | 3 baixo | 6 médio | 9 médio | 12 alto | 15 alto |
| 2 | 2 baixo | 4 baixo | 6 médio | 8 médio | 10 médio |
| 1 | 1 baixo | 2 baixo | 3 baixo | 4 baixo | 5 baixo |

Profundidade mínima: crítico/alto → BVA3 + DT/ST + exploratório + regressão em toda mudança; médio → EP + BVA2 + regressão noturna; baixo → EP/CHK.
Registro: cada risco vive em `docs/rastreabilidade/*.json` (`id, descricao, probabilidade, impacto, nivel`) e é referenciado por requisito e teste (`@risco:`). Reavalie após cada defeito escapado e a cada release.

| Risco | Descrição | P | I | Nível | Requisitos |
|---|---|---|---|---|---|
| R-EX-002 (exemplo) | Desconto calculado errado causa perda financeira | 3 | 5 | alto | REQ-EX-002 |
