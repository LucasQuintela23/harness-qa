---
name: revisar-plano-de-teste
description: Revisão estática de um plano de teste (docs/templates/plano-de-teste.md) contra critérios CTFL. Use antes de implementar.
---
# /revisar-plano-de-teste <arquivo>
Checklist (cada falha vira achado com correção sugerida):
1. Escopo e itens de teste claros; fora de escopo declarado.
2. Riscos com P x I e nível; requisitos de risco alto/crítico têm profundidade compatível.
3. Seção de técnicas por nível e tipo: cada linha tem técnica, variante, item de cobertura e justificativa; nenhuma técnica fora do syllabus sem marca de extensão.
4. Alocação por pirâmide/quadrantes: há E2E onde componente resolveria?
5. Critérios de entrada/saída mensuráveis; DoR/DoD referenciados.
6. Matriz requisito → risco → técnica → item → caso → execução está completa (`npm run matriz`); itens sem teste têm justificativa manual.
7. Dados, ambientes, segredos (por nome), suspensão e retomada, regressão por risco.
8. Requisitos testáveis? Ambiguidades listadas como perguntas.
Saída: achados priorizados (bloqueante/importante/sugestão) e veredito.
