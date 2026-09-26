# AGENTS.md — convenções do harness de qualidade

Este repositório é um harness de testes (Playwright + TypeScript). O agente escreve e revisa testes; o harness guia antes (feedforward) e mede depois (feedback). Leia isto antes de qualquer alteração.

## Fluxo obrigatório para um teste novo
1. Requisito e risco existem em `docs/rastreabilidade/*.json`? Se não, cadastre (risco: `docs/analise-de-risco.md`).
2. Rode a skill `/derivar-casos-de-teste`: ela devolve a tabela de partições/limites/decisão/estados **antes** do código e os itens de cobertura.
3. Registre os itens em `itensDeCobertura`. Gere o esqueleto: `npm run novo-teste -- <nivel> <nome> <TECNICA> <REQ> <RISCO> <ITEM>`.
4. Implemente. Valide: `npm run verificar`. Corrija seguindo o campo COMO CORRIGIR das mensagens dos sensores.
5. Commit no padrão abaixo. Antes do PR: `/revisar-teste`.

## Metadado obrigatório (sensor `rastreabilidade`)
```ts
test('rejeita 11 (acima do limite superior)', {
  tag: ['@tecnica:BVA3', '@req:REQ-EX-001', '@risco:R-EX-001', '@cobertura:EX-BV-11'],
}, () => { ... });
```
Uma `@tecnica`, ao menos um `@req`, `@risco` e `@cobertura`. Todo item de cobertura do plano precisa de teste (ou `"manual": true` justificado).

## Catálogo de técnicas (CTFL v4.0) e códigos
| Código | Técnica | Item de cobertura |
|---|---|---|
| EP | Particionamento de equivalência | cada partição válida e inválida |
| BVA2 / BVA3 | Valor limite 2 ou 3 valores (declare a variante no plano) | cada valor de limite |
| DT | Tabela de decisão | cada coluna (regra) |
| ST | Transição de estado | todos os estados, transições válidas, tentativas inválidas |
| STMT / BRANCH | Comandos / ramos (caixa-branca, nível componente) | comandos / ramos executados |
| EG | Error guessing (catálogo em `docs/estrategia-de-testes.md`) | defeito do catálogo |
| CHK | Baseado em checklist | item do checklist |
| ATDD | Critério de aceite Gherkin (rastrear até a técnica caixa-preta de origem) | critério de aceite |
| EXPL | Exploratório com charter (`docs/charters`) | charter executado |
Técnica fora do syllabus só entra em `harness/config/politica.json` marcada como **extensão**.

## Regras de código
- SRP: um teste, um comportamento, no máximo 3 `expect`. Page object sem asserção. Builder não conhece transporte.
- OCP: novo cenário = nova linha de dados, não edição de helper.
- LSP/ISP: contratos pequenos em `support/contratos` (≤ 7 membros, sem implementação); sem `BasePage` gigante.
- DIP: teste depende de contrato injetado por fixture; nunca de driver, URL ou credencial (`process.env` só em `support/ambiente`).
- Sem `waitForTimeout`/sleep, sem `if`/laço no corpo do teste, sem estado mutável de módulo, sem dependência entre specs, sem `test.only`/`skip` sem defeito registrado.
- Dados isolados e determinísticos; segredos só por variável de ambiente (`.env` local ignorado).
- Alocação por camada: pergunte "o componente resolve?" antes de escrever E2E (pirâmide/quadrantes em `docs/estrategia-de-testes.md`).

## Comandos
`npm run verificar` (rápido) · `npm run cobertura` (comandos/ramos: critério de saída de componente, não meta) · `npm run mutacao` · `npm run matriz` · `npm run sensores:{estaticos,relatorio,drift}`.

## Commits (iuricode/padroes-de-commits)
`<emoji> <tipo>: <descrição, máx. 4 palavras>` — feat :sparkles:, fix :bug:, docs :books:, test :test_tube:, build :construction_worker:, perf :zap:, style :art:, refactor :recycle:, chore :wrench:, ci :bricks:, raw :card_file_box:, cleanup :broom:, remove :wastebasket:. Ex.: `:test_tube: test: Cenários de login`. O hook `commit-msg` bloqueia o restante.

## Skills (`harness/guias/skills`, também em `.claude/skills`)
`/derivar-casos-de-teste` · `/revisar-teste` · `/revisar-plano-de-teste` · `/auditar-cobertura-de-risco` · `/conduzir-sessao-exploratoria`.

## Dados de exemplo
`src/exemplo`, `tests/componente/exemplo` e `docs/rastreabilidade/exemplo.json` são um exemplo descartável e fictício. Apague ao ligar o SUT real.
