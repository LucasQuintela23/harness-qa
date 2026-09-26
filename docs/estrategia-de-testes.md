# Estratégia de testes

## Princípios (CTFL 4.0) e a decisão que cada um justifica
| Princípio | Decisão no harness |
|---|---|
| Teste mostra presença, não ausência de defeitos | Relatório nunca diz "sem defeitos"; diz "itens de cobertura executados e risco residual" |
| Teste exaustivo é impossível | Técnicas formais reduzem o espaço; priorização por risco |
| Teste antecipado economiza | Guias e sensores no pré-commit; revisão estática de requisito/plano antes de codar |
| Agrupamento de defeitos | Risco e regressão priorizam módulos com histórico de defeitos |
| Paradoxo do pesticida | Sensor `duplicados`; revisão trimestral das suítes; exploratório renova o conjunto |
| Teste depende do contexto | Orçamentos de tempo e cobertura por nível em `politica.json` |
| Ausência de erros é uma falácia | Aceite (ATDD) valida o que o usuário precisa, não só conformidade com a especificação |

## Níveis e alocação (pirâmide + quadrantes)
| Nível CTFL | Pasta | Técnicas típicas | Orçamento |
|---|---|---|---|
| Componente | `sistemas/<sut>/tests/componente` | EP, BVA, DT, ST, STMT, BRANCH | 30 s |
| Integração de componentes | `.../tests/contrato`, `.../tests/integracao` | EP, DT, EG | 60–180 s |
| Sistema | `.../tests/e2e`, `.../tests/acessibilidade` | ST, CHK, ATDD | 600 s |
| Integração de sistemas / Aceite | `.../tests/e2e` (tag ATDD), charters em `sistemas/<sut>/docs/charters` | ATDD, EXPL | por release |
Regra de alocação: cenário vai para o nível mais baixo capaz de detectar o defeito. E2E só para fluxos de valor e integração real. Tipos: funcional, não funcional (k6 em `sistemas/<sut>/tests/performance`, cada script declarando requisito não funcional e risco, acessibilidade), caixa-branca (componente) e relacionado a mudança (confirmação + regressão).

## Confirmação e regressão
Correção de defeito → teste de confirmação (reprodução vira teste automatizado com `@risco`) + regressão. A suíte de regressão é selecionada por risco: `--grep "@risco:<ids de nivel alto/critico>"` em cada mudança; suíte completa noturna. Justificativa registrada no plano de teste.

## Risco
Probabilidade x impacto em `docs/analise-de-risco.md`. Nível define cobertura mínima de requisitos (`drift.coberturaDeRiscoMinimaPorNivel`) e profundidade de técnica (crítico/alto: BVA3 + DT + ST; médio: EP + BVA2; baixo: EP/CHK).

## Critérios
- **Definition of Ready** do requisito: testável (critérios de aceite Gherkin), risco atribuído, revisado estaticamente (checklist em `/revisar-plano-de-teste`).
- **Entrada** de nível: build no ar, ambiente e dados disponíveis, sensores estáticos verdes.
- **Saída** de componente: 100% dos itens de cobertura do plano, comandos e ramos cobertos (`.c8rc.json`, critério mínimo e não meta), mutation score ≥ 75 (quebra) / 90 (alvo). Sistema/aceite: itens de risco alto/crítico executados, defeitos críticos zerados, exploratório executado.
- **Definition of Done**: teste com metadado, sensores verdes, matriz atualizada, revisão feita.

## Teste estático
Revisão de requisito e de plano antes de codar (`/revisar-plano-de-teste`), lint, tipos e sensores estruturais são o controle "quality left".

## Catálogo de error guessing (semente; estenda por domínio)
Nulo/vazio/espaços, tipo errado, Unicode e tamanho extremo, dupla submissão, concorrência na mesma entidade, fuso e virada de data, arredondamento monetário, permissão de outro usuário, retry idempotente, timeout parcial.

## Exploratório
Session-based, 60–90 min, charters versionados em `sistemas/<sut>/docs/charters` (template em `docs/templates`), débrief gera defeitos e novos itens EG/CHK.

## Estrutura de defeito
Template em `docs/templates/relatorio-de-defeito.md` (campos CTFL: identificador, título, data, organização/autor, contexto, descrição, resultado esperado/real, severidade, prioridade, status, referências).

## Decisões em aberto
| Decisão | Recomendada | Alternativa / critério |
|---|---|---|
| Runner de mutation | Stryker `commandRunner` sobre o projeto `componente` (não há runner nativo Playwright) | Migrar componente para Vitest (runner nativo) se o tempo de mutation passar de ~10 min |
| Cobertura | c8 (V8) só em componente | Cobertura de E2E não é critério; use cobertura de risco |
| Histórico de flakiness | `reports/historico.jsonl` em cache/artefato do CI | Banco/Grafana se mais de um repositório consumir |
