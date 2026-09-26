# LLM-as-judge: qualidade de asserção
Entrada: requisito, item de cobertura, código do teste. Saída em JSON `{nota:0-2, achados:[{linha, problema, comoCorrigir}]}` por critério. Use modelo diferente do que gerou o teste e temperatura baixa; amostre (não rode em todo commit).
Critérios: (1) o oráculo é derivado do requisito, não copiado da implementação; (2) o valor esperado é específico; (3) o teste falharia se o comportamento quebrasse (mutante mental); (4) o título descreve o comportamento; (5) os dados escolhidos exercitam o item de cobertura declarado.
Uso: `/revisar-teste` no PR; resultado é aviso, nunca bloqueio, e é auditado por amostragem humana.
