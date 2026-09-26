# Plano de teste — <escopo/release>
Versão · Autor · Data · Revisores (revisão estática feita: sim/não)

## 1. Escopo
Dentro / fora de escopo. Itens de teste (funcionalidades, versões).

## 2. Riscos de produto e de projeto
| ID | Descrição | P | I | Nível | Mitigação |
|---|---|---|---|---|---|

## 3. Técnicas aplicadas por nível e por tipo de teste
| Nível | Tipo | Requisito/risco | Técnica (código) | Variante/critério de cobertura | Justificativa |
|---|---|---|---|---|---|
Ex.: componente · funcional · REQ-001/R-001 · BVA3 · 6 valores de limite · risco médio, faixa numérica.
Regra: nenhum caso sem técnica declarada.

## 4. Critérios de entrada
## 5. Critérios de saída (componente: comandos+ramos, mutation; sistema: itens de risco alto/crítico, defeitos)
## 6. Matriz de rastreabilidade
requisito → risco → técnica → item de cobertura → caso de teste → execução (gerada por `npm run matriz`).
## 7. Estratégia de dados
Massa sintética, builders, isolamento por teste, limpeza, dados sensíveis mascarados.
## 8. Ambientes
Ambiente por nível, provedores (`ProvedorDeAmbiente`), variáveis e segredos (nomes, não valores).
## 9. Regressão
Seleção por risco (tags), suíte noturna, justificativa.
## 10. Critérios de suspensão e retomada
Suspende se: build não sobe, ambiente indisponível, >X% falhas por causa única. Retoma quando: causa corrigida e smoke verde.
## 11. Cronograma, papéis, métricas, itens manuais/exploratórios (charters)
