# Loop de direção — quando o mesmo defeito escapa duas vezes

1. **Registrar**: no DEF, marque nível onde deveria ter sido pego e qual controle falhou (guia, sensor computacional, sensor inferencial, revisão humana).
2. **1ª escapada**: corrija o defeito; adicione teste de confirmação com `@risco`; ajuste o risco (probabilidade ↑) no plano.
3. **2ª escapada do mesmo tipo** (mesma causa-raiz ou mesmo item de cobertura ausente): obrigatório mudar o harness, não só o teste. Escolha a ação mais barata e mais determinística:
   - faltava técnica/partição → atualize a skill `/derivar-casos-de-teste` ou o catálogo EG;
   - padrão detectável estaticamente → novo sensor computacional em `harness/sensores` (com COMO CORRIGIR) ou regra em `estrutural.ts`/ESLint;
   - julgamento → critério novo em `/revisar-teste` ou rubrica em `harness/sensores/inferenciais/juiz-de-assercao.md`;
   - integração/ambiente → nível mais baixo da pirâmide para o cenário.
4. **Provar**: o novo controle precisa falhar contra o código/teste que deixou o defeito passar (teste do sensor) e passar após a correção.
5. **Registrar** a mudança no commit (`:wrench: chore: …`) e citar o DEF. Revisão trimestral: controles nunca disparados são candidatos a remoção.
