---
name: derivar-casos-de-teste
description: Recebe um requisito e devolve casos de teste derivados por técnica CTFL (EP, BVA, DT, ST), com a tabela explícita antes do código. Use ao iniciar qualquer teste novo.
---
# /derivar-casos-de-teste <requisito>

1. **Entenda o requisito.** Se ambíguo ou não testável, pare e liste as perguntas (teste estático); não invente regras.
2. **Risco e nível.** Consulte `sistemas/<sut>/docs/rastreabilidade.json`/`docs/analise-de-risco.md`; se ausentes, proponha P, I e nível. Escolha o nível de teste mais baixo capaz de detectar o defeito (pirâmide).
3. **Escolha a técnica** e justifique:
   - domínio numérico/faixa → EP + BVA (declare **BVA2 ou BVA3**; risco alto/crítico → BVA3);
   - regras combinatórias → tabela de decisão (DT), reduzindo colunas impossíveis com justificativa;
   - ciclo de vida/estados → ST: todos os estados, todas as transições válidas, transições inválidas;
   - código de componente → complemente com STMT/BRANCH como critério mínimo;
   - suspeitas do domínio → EG do catálogo; fluxos amplos → CHK/EXPL.
4. **Emita as tabelas ANTES de qualquer código**: partições (válidas/inválidas), limites com valores, colunas da DT, estados x eventos.
5. **Atribua IDs de item de cobertura** e gere o JSON para `itensDeCobertura` (`id, requisito, tecnica, descricao`).
6. **Casos**: um por item (ou por combinação justificada), com valor exato esperado. Escreva o teste conforme `AGENTS.md`, com tags `@tecnica @req @risco @cobertura`, cenários em dados (sem `if` no teste).
7. **Rode** `npm run verificar` e corrija conforme COMO CORRIGIR. Se ATDD, escreva o Gherkin e anote de qual técnica caixa-preta cada cenário veio.
Saída: (a) perguntas/premissas, (b) tabelas, (c) JSON de itens, (d) código, (e) o que precisa de teste manual/exploratório.
