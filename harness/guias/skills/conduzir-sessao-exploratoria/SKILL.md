---
name: conduzir-sessao-exploratoria
description: Gera e apoia um charter exploratório (session-based) para riscos que a suíte automatizada não cobre.
---
# /conduzir-sessao-exploratoria <área ou risco>
1. Escolha riscos sem cobertura automatizada ou itens `manual` na matriz.
2. Preencha `docs/templates/charter-exploratorio.md` em `sistemas/<sut>/docs/charters/EXPL-<id>.md` (missão, heurísticas, catálogo EG, duração 60–90 min).
3. Durante a sessão registre notas e defeitos (`docs/templates/relatorio-de-defeito.md`).
4. Débrief: converta descobertas em itens EG/CHK em `sistemas/<sut>/docs/rastreabilidade.json` e novos testes; atualize o catálogo EG.
O agente propõe charters e organiza notas; a exploração em si e o julgamento são humanos.
