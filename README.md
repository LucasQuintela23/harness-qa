# harness-qa

Harness de qualidade para automação de testes com **Playwright + TypeScript**. Ele combina o modelo de *Harness Engineering* (guias que orientam antes, sensores que medem depois) com as técnicas e o vocabulário do syllabus **ISTQB CTFL v4.0**.

Ainda não há sistema sob teste. `src/exemplo`, `tests/componente/exemplo` e `docs/rastreabilidade/exemplo.json` formam um exemplo fictício e descartável: apague-os ao ligar o SUT real.

## Ideia central

Todo teste nasce de uma técnica formal (partição, valor limite, tabela de decisão, transição de estado...) e fica rastreável até o requisito e o risco:

```
requisito → risco → técnica → item de cobertura → caso de teste → execução
```

Um teste sem técnica, sem rastreio ou sem asserção real é barrado por sensores automáticos, e cada mensagem diz também **como corrigir**, para que um agente (ou pessoa) consiga agir sozinho.

## Arquitetura

O harness tem dois sentidos de controle, cada um com dois tipos de execução:

| | Computacional (determinístico) | Inferencial (LLM/humano) |
|---|---|---|
| **Guias** (antes) | scaffold, contratos, builders, `ProvedorDeAmbiente`, tsconfig/ESLint | `AGENTS.md`, skills, templates, catálogo de técnicas |
| **Sensores** (depois) | lint, tipos, sensores próprios, cobertura, mutation, flakiness, drift | `/revisar-teste`, `/revisar-plano-de-teste`, juiz de asserção |

Os controles atuam em três dimensões: manutenibilidade da suíte, fitness arquitetural da automação e comportamento do sistema sob teste (a mais fraca: a especificação é o guia e a suíte é o sensor).

### Fluxograma da arquitetura

Quem atua (agente ou QA) recebe orientação dos guias antes de agir e é medido pelos sensores depois. Toda mensagem de sensor diz o problema e como corrigir, então o agente fecha o ciclo sozinho. Quando o mesmo defeito escapa duas vezes, o loop de direção muda o próprio harness.

```mermaid
flowchart LR
    subgraph GUIAS["Guias: antes de agir (feedforward)"]
        G1["AGENTS.md e catálogo de técnicas CTFL"]
        G2["Skills inferenciais: derivar-casos-de-teste, revisar-plano-de-teste, conduzir-sessao-exploratoria"]
        G3["Templates, análise de risco e rastreabilidade em JSON"]
        G4["Scaffold, contratos, builders e fixtures"]
    end

    AGENTE(["Agente ou QA: escreve e revisa testes"])

    subgraph SENSORES["Sensores: depois de agir (feedback)"]
        S1["Computacionais: tsc, ESLint, rastreabilidade, assercoes, duplicados, estrutural"]
        S2["Computacionais: cobertura, mutation, flakiness, tempo de suíte"]
        S3["Inferenciais: revisar-teste, auditar-cobertura-de-risco, juiz de asserção"]
        S4["Drift agendado: flaky acumulado, testes mortos, risco x cobertura"]
    end

    G1 --> AGENTE
    G2 --> AGENTE
    G3 --> AGENTE
    G4 --> AGENTE
    AGENTE --> S1
    AGENTE --> S2
    AGENTE --> S3
    S1 -- "problema + como corrigir" --> AGENTE
    S2 -- "problema + como corrigir" --> AGENTE
    S3 -- "achados e sugestões" --> AGENTE
    S4 -- "alerta de degradação" --> LOOP
    S1 -- "defeito escapou 2 vezes" --> LOOP
    LOOP["Loop de direção: evolui guias e sensores"] --> GUIAS
    LOOP --> SENSORES
```

### Fluxograma de quando cada controle roda

```mermaid
flowchart LR
    A["Escrita do teste"] --> B["Pré-commit: tsc, ESLint, sensores estáticos"]
    B -- "falhou" --> A
    B --> C["commit-msg: tipo: descrição"]
    C -- "fora do padrão" --> A
    C --> D["Pré-push: cobertura de comandos e ramos + sensores de relatório"]
    D -- "falhou" --> A
    D --> E["CI estágio 1: estático"]
    E --> F["CI estágio 2: componente + cobertura"]
    F --> G["CI estágio 3: mutation, só em PR"]
    G --> H["CI estágio 4: contrato e integração"]
    H --> I["CI estágio 5: E2E e acessibilidade, só em main, regressão por risco"]
    I --> J["Sensores de drift agendados"]
    J -- "degradação" --> K["Abrir defeito de automação e revisar o harness"]
```

### Fluxograma da criação de um teste, do início ao fim

```mermaid
flowchart TD
    START(["Novo requisito ou defeito a cobrir"]) --> R1{"Requisito e risco já cadastrados na rastreabilidade?"}
    R1 -- "não" --> R2["Cadastrar requisito, risco (probabilidade x impacto) e critérios de aceite"]
    R2 --> R3
    R1 -- "sim" --> R3["/revisar-plano-de-teste: revisão estática, o requisito é testável?"]
    R3 --> R4{"Requisito testável e sem ambiguidade?"}
    R4 -- "não" --> R5["Levantar perguntas ao negócio e ajustar o requisito"]
    R5 --> R3
    R4 -- "sim" --> D1["/derivar-casos-de-teste: escolhe a técnica (EP, BVA2/BVA3, DT, ST, EG, CHK) e emite as tabelas antes do código"]
    D1 --> D2["Registrar itens de cobertura na rastreabilidade (id, requisito, técnica, descrição)"]
    D2 --> N1["npm run novo-teste: gera o esqueleto com as tags @tecnica @req @risco @cobertura"]
    N1 --> I1["Implementar: builders, contratos, fixtures, um comportamento por teste, sem sleep e sem if"]
    I1 --> V1["npm run verificar: tipos, lint, sensores estáticos, testes"]
    V1 --> V2{"Sensores e testes verdes?"}
    V2 -- "não" --> V3["Corrigir seguindo a mensagem: problema + como corrigir"]
    V3 --> V1
    V2 -- "sim" --> Q1["npm run cobertura e npm run mutacao: o teste detectaria o defeito?"]
    Q1 --> Q2["/revisar-teste: oráculo, técnica, duplicação, nível da pirâmide"]
    Q2 --> Q3{"Aprovado na revisão?"}
    Q3 -- "não" --> V3
    Q3 -- "sim" --> C1["Commit: tipo: descrição, só quando solicitado"]
    C1 --> C2["Pull request e CI por estágios de custo"]
    C2 --> C3{"CI verde e sem flaky?"}
    C3 -- "não" --> V3
    C3 -- "sim" --> M1["Merge e atualização da matriz: npm run matriz"]
    M1 --> M2["Drift agendado acompanha flakiness, testes mortos e cobertura de risco"]
    M2 --> M3{"O mesmo defeito escapou pela segunda vez?"}
    M3 -- "sim" --> M4["Loop de direção: novo sensor, regra de lint, skill ou item de cobertura"]
    M4 --> START
    M3 -- "não" --> END(["Fim do ciclo"])
```

### Estrutura de diretórios

```
harness/
  config/           politica.json (técnicas, níveis, orçamentos) e stryker.config.json
  guias/skills/     skills inferenciais (também acessíveis em .claude/skills)
  guias/scaffold/   gerador de esqueleto de teste (npm run novo-teste)
  sensores/         sensores computacionais e lib/ (AST, relatório, política)
  sensores/inferenciais/  rubrica do LLM-as-judge
  loop/             loop de direção (o que fazer quando o mesmo defeito escapa duas vezes)
tests/              um diretório por nível: componente, contrato, integracao, e2e,
                    acessibilidade, performance (k6), exploratorio
support/            contratos (interfaces pequenas), ambiente, builders, clients, page-objects
src/exemplo/        código de exemplo descartável
docs/               estratégia, análise de risco, templates, rastreabilidade, planos, charters
.githooks/          commit-msg, pre-commit, pre-push
.github/workflows/  pipeline de CI por estágios de custo
```

### Regras de dependência

- `tests` depende de contratos em `support/contratos`, nunca de driver, URL ou credencial concretos (DIP). A implementação entra por fixture.
- Page objects não contêm asserção. Builders não conhecem transporte. Contratos têm no máximo 7 membros e nenhuma implementação.
- `src` nunca importa de `tests` nem de `support`.
- Specs não importam outros specs e não têm estado mutável de módulo.

O sensor `estrutural` (regras E1 a E8) verifica isso automaticamente.

## Sensores computacionais

| Sensor | O que detecta |
|---|---|
| `rastreabilidade` | teste sem `@tecnica`, `@req`, `@risco` ou `@cobertura`; item de cobertura do plano sem teste; inconsistência entre teste, item e requisito |
| `assercoes` | teste sem `expect`, asserção trivial ou só com matchers fracos, `if`/laço no teste, espera fixa, mais de 3 asserções |
| `duplicados` | testes com corpo idêntico |
| `estrutural` | violações de camada, URL literal, `process.env` em teste, segredo em literal, estado global |
| `flakiness` e `tempo-de-suite` | testes que só passam com retry e suítes acima do orçamento por nível |
| `drift` | flakiness acumulada, testes mortos ou sempre ignorados, cobertura de requisitos por nível de risco, dependências desatualizadas |
| `mensagem-de-commit` | commit fora do padrão `<tipo>: <até 4 palavras>` |

## Metadado de teste

```ts
test('rejeita 11 (acima do limite superior)', {
  tag: ['@tecnica:BVA3', '@req:REQ-EX-001', '@risco:R-EX-001', '@cobertura:EX-BV-11'],
}, () => {
  expect(quantidadeEhValida(11)).toBe(false);
});
```

Técnicas aceitas (códigos em `harness/config/politica.json`): `EP`, `BVA2`, `BVA3`, `DT`, `ST`, `STMT`, `BRANCH`, `EG`, `CHK`, `ATDD`, `EXPL`. Requisitos, riscos e itens de cobertura vivem em `docs/rastreabilidade/*.json`.

## Quando cada controle roda

| Momento | Controles |
|---|---|
| Pré-commit | tsc, ESLint, sensores estáticos |
| Commit | validação da mensagem |
| Pré-push | cobertura de comandos e ramos (critério de saída de componente, não meta) e sensores de relatório |
| CI (por custo) | estático, componente, mutation (só em PR), contrato e integração, E2E e acessibilidade (só em main, regressão selecionada por risco) |
| Agendado | `drift`, fora do ciclo da mudança |

## Como usar

```bash
npm install                 # instala dependências e ativa os hooks
npm run verificar           # typecheck + lint + sensores estáticos + testes de componente
npm run cobertura           # comandos e ramos (c8)
npm run mutacao             # mutation testing (Stryker)
npm run matriz              # gera docs/rastreabilidade/MATRIZ.md
npm run novo-teste -- <nivel> <nome> <TECNICA> <REQ> <RISCO> <ITEM>
```

Fluxo para um teste novo: cadastre requisito e risco, rode a skill `/derivar-casos-de-teste` (as tabelas vêm antes do código), registre os itens de cobertura, gere o esqueleto, implemente e valide com `npm run verificar`.

Commits seguem Conventional Commits, por exemplo `test: Cenários de login`. Segredos vêm só de variáveis de ambiente (veja `.env.example`).

## Onde ler mais

- [AGENTS.md](AGENTS.md): convenções, catálogo de técnicas e regras de código
- [docs/estrategia-de-testes.md](docs/estrategia-de-testes.md): princípios, níveis, critérios de entrada e saída, decisões em aberto
- [docs/analise-de-risco.md](docs/analise-de-risco.md): matriz probabilidade x impacto
- [docs/mapa-de-controles.md](docs/mapa-de-controles.md): tabela de todos os controles
- [docs/limites-do-harness.md](docs/limites-do-harness.md): o que exige revisão humana ou teste exploratório
- [docs/roadmap.md](docs/roadmap.md): o que implementar na semana 1, no mês 1 e no trimestre
- [harness/loop/loop-de-direcao.md](harness/loop/loop-de-direcao.md): como evoluir o harness quando um defeito escapa duas vezes
