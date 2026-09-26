---
name: revisar-teste
description: Revisa um teste automatizado quanto a oráculo, técnica, rastreabilidade, isolamento e SOLID/Clean Code. Use antes de abrir PR.
---
# /revisar-teste <arquivo|diff>
Rode antes `npm run verificar`; revise apenas o que sensores não capturam. Para cada teste responda:
1. O oráculo vem do requisito (não da implementação)? O valor esperado é exato?
2. Falharia se o comportamento quebrasse? (aplique um mutante mental; consulte `reports/mutation.json` se existir)
3. Os dados exercitam o item de cobertura declarado? A técnica e a variante (BVA2/BVA3) batem com o plano?
4. Um comportamento por teste, título descreve comportamento, sem dependência de ordem, sem estado compartilhado?
5. Está no nível certo da pirâmide? Existe duplicação semântica com outro teste (mesmo item, dados equivalentes)?
6. DIP/ISP: depende de contrato injetado, sem URL/segredo/driver?
Saída: lista `arquivo:linha — problema — como corrigir`, e veredito (aprovar / ajustar / reprovar). Não reescreva o teste sem pedido.
