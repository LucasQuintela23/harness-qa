# Roadmap incremental (custo de implementação x defeito evitado)

| Quando | Entregar | Por quê |
|---|---|---|
| Semana 1 | tsc strict + ESLint; hooks commit-msg/pre-commit; AGENTS.md; sensor `assercoes`; sensor `rastreabilidade` com 1 requisito real; CI estágios 1–2 | Custo baixo, evita a maior classe de testes inúteis (sem oráculo, sem rastreio) |
| Semana 1 | `/derivar-casos-de-teste` e template de plano; substituir `src/exemplo` pelo SUT real | Garante que técnica e risco entrem desde o primeiro teste |
| Mês 1 | Sensores `estrutural` e `duplicados` ajustados ao SUT; cobertura c8 como critério de saída; `flakiness` e `tempo-de-suite` no CI; contratos/clients/page objects reais; matriz gerada em PR | Protege arquitetura de testes e mantém a suíte rápida antes que cresça |
| Mês 1 | Charters exploratórios para risco alto/crítico; estratégia de regressão por tag de risco | Cobre o que a automação não vê |
| Trimestre | Mutation em PR (Stryker) com break threshold; `drift` agendado com histórico persistido; `/auditar-cobertura-de-risco` por release; LLM-as-judge por amostragem; loop de direção formalizado com métricas de escapadas | Custo maior e retorno depende de base estável |
