# Charter EXPL-SR-01
Explorar o carrinho e o token de acesso do ServeRest com chamadas concorrentes e tokens expirados para descobrir inconsistências de estoque e falhas de autorização.
- Risco/requisito: R-SR-05, R-SR-06, R-SR-02 / REQ-SR-006, REQ-SR-007, REQ-SR-003 · Duração: 60 min · Ambiente: instância local (`serverest --timeout 5` para expirar o token)
- Heurísticas/EG: concorrência na mesma entidade, dupla submissão, retry idempotente, timeout parcial.
## Ideias
- Criar o mesmo e-mail em duas chamadas simultâneas; criar dois carrinhos do mesmo usuário em paralelo.
- Excluir o produto (admin) enquanto outro usuário cria carrinho com ele.
- Concluir e cancelar a compra ao mesmo tempo; conferir estoque final.
- Usar token expirado em POST/PUT/DELETE de `/produtos` e em `/carrinhos` (item manual `SR-AUT-EG-EXP`).
## Notas da sessão (tarefa / investigação / configuração — %)
## Defeitos (DEF-…) · Dúvidas · Novas ideias de teste
## Débrief
