---
name: auditar-cobertura-de-risco
description: Audita se a cobertura de testes acompanha o risco do produto; aponta lacunas e excessos. Use por release e após defeito escapado.
---
# /auditar-cobertura-de-risco
1. Rode `npm run matriz` e `npm run sensores:drift`; leia `sistemas/<sut>/docs/MATRIZ.md`.
2. Por nível de risco: % de requisitos com itens cobertos, profundidade de técnica versus `docs/analise-de-risco.md`.
3. Procure: requisitos críticos/altos só com EP; itens "manual" sem charter; excesso de testes em risco baixo; agrupamento de defeitos (módulos com DEF recorrente) sem reforço.
4. Compare defeitos escapados com itens de cobertura: faltou item (derivação) ou faltou execução?
5. Saída: tabela de lacunas ordenada por risco x custo, recomendações e, se houve escapada repetida, dispare `harness/loop/loop-de-direcao.md`.
