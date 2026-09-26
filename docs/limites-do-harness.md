# O que o harness NÃO captura (exige humano ou exploratório)

- Se o requisito está certo: a suíte só verifica contra a especificação (ausência de erros é uma falácia). Validar com usuário/produto.
- Oráculos errados que coincidem com a implementação: mutation reduz, não elimina; revisão humana por amostragem.
- Usabilidade, estética, sensação de desempenho, conteúdo, acessibilidade além das regras automatizáveis (a maioria exige avaliação manual).
- Defeitos emergentes de interação inesperada, dados reais de produção, concorrência e falhas de infraestrutura raras.
- Segurança: não há teste de segurança aqui; requer ferramentas e revisão específicas (extensão fora do escopo CTFL core).
- Duplicação semântica com dados diferentes e "teste que passa pelo motivo errado" (só o LLM-as-judge/humano suspeitam).
- Qualidade da análise de risco e das probabilidades: é julgamento; recalibrar a cada escapada.
- Cobertura de itens derivados: o harness garante que o item planejado tem teste, não que o item certo foi planejado.
- Flakiness de baixa frequência e efeitos de ambiente compartilhado que não aparecem nas execuções amostradas.
- Requisitos ambíguos ou implícitos: dependem de conversa com o negócio e de revisão estática humana.
