# Mapa de controles

| Controle | Direção | Tipo | Dimensão | Momento | O que previne |
|---|---|---|---|---|---|
| AGENTS.md + catálogo de técnicas | guia | inferencial | manutenibilidade / comportamento do SUT | antes de escrever | teste sem técnica ou fora de convenção |
| Skill `/derivar-casos-de-teste` | guia | inferencial | comportamento do SUT | antes de escrever | partições/limites/regras esquecidos |
| Skill `/conduzir-sessao-exploratoria`, templates, charters | guia | inferencial | comportamento do SUT | fora do ciclo / release | risco sem cobertura automatizada |
| Scaffold `novo-teste` | guia | computacional | manutenibilidade | antes de escrever | metadado ausente, nome fora do padrão |
| Contratos por sistema, builders, `ProvedorDeAmbiente`, isolamento entre sistemas (E9) | guia | computacional | fitness arquitetural | antes de escrever | acoplamento a driver/URL/credencial |
| Análise de risco + matriz | guia | computacional | comportamento do SUT | planejamento | suíte sem priorização |
| tsc strict + ESLint (+ plugin playwright) | sensor | computacional | manutenibilidade | pré-commit | tipos frouxos, sleep, condicional, skip/only |
| Sensor `rastreabilidade` | sensor | computacional | comportamento do SUT | pré-commit e CI | teste sem técnica/req/risco; item de cobertura sem teste |
| Sensor `assercoes` | sensor | computacional | manutenibilidade | pré-commit e CI | teste sem oráculo, asserção trivial/fraca |
| Sensor `duplicados` | sensor | computacional | manutenibilidade | pré-commit e CI | duplicação literal (pesticida) |
| Sensor `estrutural` (E1–E8) | sensor | computacional | fitness arquitetural | pré-commit e CI | camadas violadas, segredo, URL, estado global |
| hook commit-msg | sensor | computacional | manutenibilidade | commit | mensagem fora do padrão |
| Cobertura c8 (comandos+ramos) | sensor | computacional | comportamento do SUT | pré-push e CI | código de componente não exercitado (critério de saída) |
| Mutation (Stryker) | sensor | computacional | comportamento do SUT | PR | asserção que não detecta defeito |
| `flakiness` e `tempo-de-suite` | sensor | computacional | fitness arquitetural | pré-push e CI | teste instável, suíte lenta |
| `drift` (flakiness acumulada, testes mortos, risco x cobertura, dependências) | sensor | computacional | manutenibilidade / arquitetura | agendado (fora do ciclo) | degradação silenciosa |
| `/revisar-teste`, `/revisar-plano-de-teste`, juiz de asserção | sensor | inferencial | manutenibilidade / comportamento do SUT | PR / antes de codar | oráculo fraco, duplicação semântica, plano incoerente |
| `/auditar-cobertura-de-risco` | sensor | inferencial | comportamento do SUT | por release | lacuna de risco |
| Loop de direção | guia + sensor | processo | todas | após 2ª escapada | reincidência do mesmo defeito |
