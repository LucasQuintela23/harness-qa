# Matriz de rastreabilidade (gerada, nao edite)

| Requisito | Risco | Tecnica | Item de cobertura | Caso de teste | Execucao |
|---|---|---|---|---|---|
| REQ-EX-001 | R-EX-001 (medio) | EP | EX-EP-V: particao valida: inteiro em 1..10 | tests/componente/exemplo/quantidade.spec.ts:20 quantidade: aceita inteiro dentro da faixa | expected |
| REQ-EX-001 | R-EX-001 (medio) | EP | EX-EP-I1: particao invalida: menor que 1 | tests/componente/exemplo/quantidade.spec.ts:20 quantidade: rejeita menor que o minimo | expected |
| REQ-EX-001 | R-EX-001 (medio) | EP | EX-EP-I2: particao invalida: maior que 10 | tests/componente/exemplo/quantidade.spec.ts:20 quantidade: rejeita maior que o maximo | expected |
| REQ-EX-001 | R-EX-001 (medio) | EP | EX-EP-I3: particao invalida: nao inteiro | tests/componente/exemplo/quantidade.spec.ts:20 quantidade: rejeita nao inteiro | expected |
| REQ-EX-001 | R-EX-001 (medio) | BVA3 | EX-BV-0: limite 0 (abaixo do minimo) | tests/componente/exemplo/quantidade.spec.ts:20 quantidade: rejeita 0 (abaixo do limite inferior) | expected |
| REQ-EX-001 | R-EX-001 (medio) | BVA3 | EX-BV-1: limite 1 (minimo) | tests/componente/exemplo/quantidade.spec.ts:20 quantidade: aceita 1 (limite inferior) | expected |
| REQ-EX-001 | R-EX-001 (medio) | BVA3 | EX-BV-2: limite 2 (acima do minimo) | tests/componente/exemplo/quantidade.spec.ts:20 quantidade: aceita 2 (acima do limite inferior) | expected |
| REQ-EX-001 | R-EX-001 (medio) | BVA3 | EX-BV-9: limite 9 (abaixo do maximo) | tests/componente/exemplo/quantidade.spec.ts:20 quantidade: aceita 9 (abaixo do limite superior) | expected |
| REQ-EX-001 | R-EX-001 (medio) | BVA3 | EX-BV-10: limite 10 (maximo) | tests/componente/exemplo/quantidade.spec.ts:20 quantidade: aceita 10 (limite superior) | expected |
| REQ-EX-001 | R-EX-001 (medio) | BVA3 | EX-BV-11: limite 11 (acima do maximo) | tests/componente/exemplo/quantidade.spec.ts:20 quantidade: rejeita 11 (acima do limite superior) | expected |
| REQ-EX-002 | R-EX-002 (alto) | DT | EX-DT-R1: regra 1: volume<6, sem fidelidade, sem cupom = 0% | tests/componente/exemplo/desconto.spec.ts:14 desconto: R1 sem volume, fidelidade nem cupom resulta em 0% | expected |
| REQ-EX-002 | R-EX-002 (alto) | DT | EX-DT-R2: regra 2: volume>=6 apenas = 10% | tests/componente/exemplo/desconto.spec.ts:14 desconto: R2 somente volume resulta em 10% | expected |
| REQ-EX-002 | R-EX-002 (alto) | DT | EX-DT-R3: regra 3: fidelidade apenas = 5% | tests/componente/exemplo/desconto.spec.ts:14 desconto: R3 somente fidelidade resulta em 5% | expected |
| REQ-EX-002 | R-EX-002 (alto) | DT | EX-DT-R4: regra 4: cupom apenas = 5% | tests/componente/exemplo/desconto.spec.ts:14 desconto: R4 somente cupom resulta em 5% | expected |
| REQ-EX-002 | R-EX-002 (alto) | DT | EX-DT-R5: regra 5: volume + fidelidade + cupom = 15% (teto) | tests/componente/exemplo/desconto.spec.ts:14 desconto: R5 todos, limitado ao teto resulta em 15% | expected |
| REQ-EX-003 | R-EX-003 (alto) | ST | EX-ST-T1: transicao valida CRIADO -pagar-> PAGO | tests/componente/exemplo/ciclo-do-pedido.spec.ts:20 pedido: CRIADO + pagar vai para PAGO | expected |
| REQ-EX-003 | R-EX-003 (alto) | ST | EX-ST-T2: transicao valida PAGO -enviar-> ENVIADO | tests/componente/exemplo/ciclo-do-pedido.spec.ts:20 pedido: PAGO + enviar vai para ENVIADO | expected |
| REQ-EX-003 | R-EX-003 (alto) | ST | EX-ST-T3: transicao valida ENVIADO -entregar-> ENTREGUE | tests/componente/exemplo/ciclo-do-pedido.spec.ts:20 pedido: ENVIADO + entregar vai para ENTREGUE | expected |
| REQ-EX-003 | R-EX-003 (alto) | ST | EX-ST-T4: transicao valida CRIADO -cancelar-> CANCELADO | tests/componente/exemplo/ciclo-do-pedido.spec.ts:20 pedido: CRIADO + cancelar vai para CANCELADO | expected |
| REQ-EX-003 | R-EX-003 (alto) | ST | EX-ST-T5: transicao valida PAGO -cancelar-> CANCELADO | tests/componente/exemplo/ciclo-do-pedido.spec.ts:20 pedido: PAGO + cancelar vai para CANCELADO | expected |
| REQ-EX-003 | R-EX-003 (alto) | ST | EX-ST-X1: transicao invalida CRIADO -enviar-> rejeitada | tests/componente/exemplo/ciclo-do-pedido.spec.ts:28 pedido: enviar em CRIADO e rejeitado | expected |
| REQ-EX-003 | R-EX-003 (alto) | ST | EX-ST-X2: transicao invalida ENVIADO -cancelar-> rejeitada | tests/componente/exemplo/ciclo-do-pedido.spec.ts:28 pedido: cancelar em ENVIADO e rejeitado | expected |
| REQ-EX-003 | R-EX-003 (alto) | ST | EX-ST-X3: transicao invalida ENTREGUE -pagar-> rejeitada | tests/componente/exemplo/ciclo-do-pedido.spec.ts:28 pedido: pagar em ENTREGUE e rejeitado | expected |
| REQ-EX-003 | R-EX-003 (alto) | ST | EX-ST-X4: transicao invalida CANCELADO -pagar-> rejeitada | tests/componente/exemplo/ciclo-do-pedido.spec.ts:28 pedido: pagar em CANCELADO e rejeitado | expected |
| REQ-SR-001 | R-SR-01 (medio) | DT | SR-LOG-DT-R1: email cadastrado + senha correta = 200 e token | tests/integracao/serverest/login.spec.ts:7 login com email cadastrado e senha correta retorna 200 e token Bearer | nao executado |
| REQ-SR-001 | R-SR-01 (medio) | DT | SR-LOG-DT-R2: email cadastrado + senha errada = 401 | tests/integracao/serverest/login.spec.ts:14 login com email cadastrado e senha errada retorna 401 | nao executado |
| REQ-SR-001 | R-SR-01 (medio) | DT | SR-LOG-DT-R3: email nao cadastrado = 401 | tests/integracao/serverest/login.spec.ts:21 login com email nao cadastrado retorna 401 | nao executado |
| REQ-SR-001 | R-SR-01 (medio) | EP | SR-LOG-EP-I-EMAIL: particao invalida: email sem formato valido = 400 | tests/integracao/serverest/login.spec.ts:27 login com email sem formato valido retorna 400 | nao executado |
| REQ-SR-001 | R-SR-01 (medio) | EP | SR-LOG-EP-I-SENHA: particao invalida: senha ausente = 400 | tests/integracao/serverest/login.spec.ts:33 login sem senha retorna 400 | nao executado |
| REQ-SR-002 | R-SR-03 (alto) | EP | SR-USR-EP-V: particao valida: todos os campos validos = 201 | tests/integracao/serverest/usuarios.spec.ts:9 cadastra usuario com todos os campos validos e retorna 201 | nao executado |
| REQ-SR-002 | R-SR-03 (alto) | EP | SR-USR-EP-I-NOME: particao invalida: nome vazio | tests/integracao/serverest/usuarios.spec.ts:23 rejeita cadastro com nome invalido com 400 | nao executado |
| REQ-SR-002 | R-SR-03 (alto) | EP | SR-USR-EP-I-EMAIL: particao invalida: email sem formato valido | tests/integracao/serverest/usuarios.spec.ts:23 rejeita cadastro com email invalido com 400 | nao executado |
| REQ-SR-002 | R-SR-03 (alto) | EP | SR-USR-EP-I-SENHA: particao invalida: password vazio | tests/integracao/serverest/usuarios.spec.ts:23 rejeita cadastro com password invalido com 400 | nao executado |
| REQ-SR-002 | R-SR-03 (alto) | EP | SR-USR-EP-I-ADM: particao invalida: administrador fora de true/false | tests/integracao/serverest/usuarios.spec.ts:23 rejeita cadastro com administrador invalido com 400 | nao executado |
| REQ-SR-002 | R-SR-03 (alto) | DT | SR-USR-DT-R1: email novo + administrador true = 201 admin | tests/integracao/serverest/usuarios.spec.ts:35 cadastra email novo com administrador true e persiste o perfil | nao executado |
| REQ-SR-002 | R-SR-03 (alto) | DT | SR-USR-DT-R2: email novo + administrador false = 201 comum | tests/integracao/serverest/usuarios.spec.ts:35 cadastra email novo com administrador false e persiste o perfil | nao executado |
| REQ-SR-002 | R-SR-03 (alto) | DT | SR-USR-DT-R3: email duplicado = 400 | tests/integracao/serverest/usuarios.spec.ts:44 rejeita cadastro com email ja utilizado com 400 | nao executado |
| REQ-SR-002 | R-SR-03 (alto) | EG | SR-USR-EG-PUT-NOVO: PUT com id inexistente cria usuario (201) | tests/integracao/serverest/usuarios.spec.ts:51 PUT com id inexistente cadastra novo usuario e retorna 201 | nao executado |
| REQ-SR-002 | R-SR-03 (alto) | EG | SR-USR-EG-PUT-DUP: PUT com email de outro usuario = 400 | tests/integracao/serverest/usuarios.spec.ts:58 PUT com email de outro usuario retorna 400 | nao executado |
| REQ-SR-002 | R-SR-03 (alto) | EG | SR-USR-EG-GET-INEX: GET com id valido inexistente = 400 | tests/integracao/serverest/usuarios.spec.ts:66 consulta de usuario com id valido inexistente retorna 400 | nao executado |
| REQ-SR-002 | R-SR-03 (alto) | EG | SR-USR-EG-ID-MALFORMADO: GET com id fora do formato de 16 caracteres = 400 | tests/integracao/serverest/usuarios.spec.ts:72 consulta de usuario com id fora do formato retorna 400 | nao executado |
| REQ-SR-003 | R-SR-02 (alto) | DT | SR-AUT-DT-POST-R1: criar produto: sem token = 401 | tests/integracao/serverest/autorizacao-de-produtos.spec.ts:33 criar produto com perfil nenhum retorna 401 | nao executado |
| REQ-SR-003 | R-SR-02 (alto) | DT | SR-AUT-DT-POST-R2: criar produto: token invalido = 401 | tests/integracao/serverest/autorizacao-de-produtos.spec.ts:33 criar produto com perfil invalido retorna 401 | nao executado |
| REQ-SR-003 | R-SR-02 (alto) | DT | SR-AUT-DT-POST-R3: criar produto: usuario nao admin = 403 | tests/integracao/serverest/autorizacao-de-produtos.spec.ts:33 criar produto com perfil comum retorna 403 | nao executado |
| REQ-SR-003 | R-SR-02 (alto) | DT | SR-AUT-DT-POST-R4: criar produto: admin = sucesso | tests/integracao/serverest/autorizacao-de-produtos.spec.ts:33 criar produto com perfil admin retorna 201 | nao executado |
| REQ-SR-003 | R-SR-02 (alto) | DT | SR-AUT-DT-PUT-R1: alterar produto: sem token = 401 | tests/integracao/serverest/autorizacao-de-produtos.spec.ts:33 alterar produto com perfil nenhum retorna 401 | nao executado |
| REQ-SR-003 | R-SR-02 (alto) | DT | SR-AUT-DT-PUT-R3: alterar produto: usuario nao admin = 403 | tests/integracao/serverest/autorizacao-de-produtos.spec.ts:33 alterar produto com perfil comum retorna 403 | nao executado |
| REQ-SR-003 | R-SR-02 (alto) | DT | SR-AUT-DT-PUT-R4: alterar produto: admin = sucesso | tests/integracao/serverest/autorizacao-de-produtos.spec.ts:33 alterar produto com perfil admin retorna 200 | nao executado |
| REQ-SR-003 | R-SR-02 (alto) | DT | SR-AUT-DT-DEL-R1: excluir produto: sem token = 401 | tests/integracao/serverest/autorizacao-de-produtos.spec.ts:33 excluir produto com perfil nenhum retorna 401 | nao executado |
| REQ-SR-003 | R-SR-02 (alto) | DT | SR-AUT-DT-DEL-R3: excluir produto: usuario nao admin = 403 | tests/integracao/serverest/autorizacao-de-produtos.spec.ts:33 excluir produto com perfil comum retorna 403 | nao executado |
| REQ-SR-003 | R-SR-02 (alto) | DT | SR-AUT-DT-DEL-R4: excluir produto: admin = sucesso | tests/integracao/serverest/autorizacao-de-produtos.spec.ts:33 excluir produto com perfil admin retorna 200 | nao executado |
| REQ-SR-003 | R-SR-02 (alto) | EG | SR-AUT-EG-EXP: token expirado (600 s) = 401; nao automatizado (custo de espera), coberto por charter | (manual) | - |
| REQ-SR-004 | R-SR-04 (medio) | EP | SR-PRD-EP-V: particao valida: produto com todos os campos validos = 201 | tests/integracao/serverest/produtos.spec.ts:22 cadastro de produto com todos os campos validos retorna 201 | nao executado |
| REQ-SR-004 | R-SR-04 (medio) | BVA2 | SR-PRD-BV-P0: preco 0 (abaixo do minimo 1) = 400 | tests/integracao/serverest/produtos.spec.ts:22 cadastro de preco 0 (abaixo do minimo) retorna 400 | nao executado |
| REQ-SR-004 | R-SR-04 (medio) | BVA2 | SR-PRD-BV-P1: preco 1 (minimo) = 201 | tests/integracao/serverest/produtos.spec.ts:22 cadastro de preco 1 (minimo) retorna 201 | nao executado |
| REQ-SR-004 | R-SR-04 (medio) | BVA2 | SR-PRD-BV-Q-1: quantidade -1 (abaixo do minimo 0) = 400 | tests/integracao/serverest/produtos.spec.ts:22 cadastro de quantidade -1 (abaixo do minimo) retorna 400 | nao executado |
| REQ-SR-004 | R-SR-04 (medio) | BVA2 | SR-PRD-BV-Q0: quantidade 0 (minimo) = 201 | tests/integracao/serverest/produtos.spec.ts:22 cadastro de quantidade 0 (minimo) retorna 201 | nao executado |
| REQ-SR-004 | R-SR-04 (medio) | EP | SR-PRD-EP-PRECO-DEC: particao invalida: preco decimal | tests/integracao/serverest/produtos.spec.ts:22 cadastro de preco decimal retorna 400 | nao executado |
| REQ-SR-004 | R-SR-04 (medio) | EP | SR-PRD-EP-PRECO-TXT: particao invalida: preco texto | tests/integracao/serverest/produtos.spec.ts:22 cadastro de preco texto retorna 400 | nao executado |
| REQ-SR-004 | R-SR-04 (medio) | EP | SR-PRD-EP-NOME-VAZIO: particao invalida: nome vazio | tests/integracao/serverest/produtos.spec.ts:22 cadastro de nome vazio retorna 400 | nao executado |
| REQ-SR-004 | R-SR-04 (medio) | EP | SR-PRD-EP-DESC-VAZIA: particao invalida: descricao vazia | tests/integracao/serverest/produtos.spec.ts:22 cadastro de descricao vazia retorna 400 | nao executado |
| REQ-SR-004 | R-SR-04 (medio) | EP | SR-PRD-EP-NOME-DUP: particao invalida: nome duplicado = 400 | tests/integracao/serverest/produtos.spec.ts:33 rejeita cadastro de produto com nome ja existente com 400 | nao executado |
| REQ-SR-005 | R-SR-07 (alto) | DT | SR-INT-DT-R1: produto em carrinho: exclusao = 400 | tests/integracao/serverest/integridade-referencial.spec.ts:6 nao exclui produto que faz parte de carrinho | nao executado |
| REQ-SR-005 | R-SR-07 (alto) | DT | SR-INT-DT-R2: usuario com carrinho: exclusao = 400 | tests/integracao/serverest/integridade-referencial.spec.ts:16 nao exclui usuario com carrinho cadastrado | nao executado |
| REQ-SR-005 | R-SR-07 (alto) | DT | SR-INT-DT-R3: produto sem carrinho: exclusao = 200 | tests/integracao/serverest/integridade-referencial.spec.ts:26 exclui produto que nao esta em carrinho | nao executado |
| REQ-SR-005 | R-SR-07 (alto) | DT | SR-INT-DT-R4: usuario sem carrinho: exclusao = 200 | tests/integracao/serverest/integridade-referencial.spec.ts:34 exclui usuario sem carrinho | nao executado |
| REQ-SR-006 | R-SR-05 (critico) | BVA3 | SR-CAR-BV-0: quantidade 0 (abaixo do minimo 1) = 400 | tests/integracao/serverest/carrinhos.spec.ts:20 carrinho com quantidade 0 para estoque 5 retorna 400 | nao executado |
| REQ-SR-006 | R-SR-05 (critico) | BVA3 | SR-CAR-BV-1: quantidade 1 (minimo) = 201 | tests/integracao/serverest/carrinhos.spec.ts:20 carrinho com quantidade 1 para estoque 5 retorna 201 | nao executado |
| REQ-SR-006 | R-SR-05 (critico) | BVA3 | SR-CAR-BV-2: quantidade 2 (acima do minimo) = 201 | tests/integracao/serverest/carrinhos.spec.ts:20 carrinho com quantidade 2 para estoque 5 retorna 201 | nao executado |
| REQ-SR-006 | R-SR-05 (critico) | BVA3 | SR-CAR-BV-E4: quantidade 4 com estoque 5 (E-1) = 201 | tests/integracao/serverest/carrinhos.spec.ts:20 carrinho com quantidade 4 para estoque 5 retorna 201 | nao executado |
| REQ-SR-006 | R-SR-05 (critico) | BVA3 | SR-CAR-BV-E5: quantidade 5 com estoque 5 (E) = 201 | tests/integracao/serverest/carrinhos.spec.ts:20 carrinho com quantidade 5 para estoque 5 retorna 201 | nao executado |
| REQ-SR-006 | R-SR-05 (critico) | BVA3 | SR-CAR-BV-E6: quantidade 6 com estoque 5 (E+1) = 400 | tests/integracao/serverest/carrinhos.spec.ts:20 carrinho com quantidade 6 para estoque 5 retorna 400 | nao executado |
| REQ-SR-006 | R-SR-05 (critico) | DT | SR-CAR-DT-R1: token valido + produtos existentes distintos = 201 | tests/integracao/serverest/carrinhos.spec.ts:34 carrinho com token valido e produtos distintos existentes retorna 201 | nao executado |
| REQ-SR-006 | R-SR-05 (critico) | DT | SR-CAR-DT-R2: sem token = 401 | tests/integracao/serverest/carrinhos.spec.ts:44 carrinho sem token retorna 401 | nao executado |
| REQ-SR-006 | R-SR-05 (critico) | DT | SR-CAR-DT-R3: produto inexistente = 400 | tests/integracao/serverest/carrinhos.spec.ts:52 carrinho com produto inexistente retorna 400 | nao executado |
| REQ-SR-006 | R-SR-05 (critico) | DT | SR-CAR-DT-R4: produto duplicado no corpo = 400 | tests/integracao/serverest/carrinhos.spec.ts:59 carrinho com produto duplicado no corpo retorna 400 | nao executado |
| REQ-SR-007 | R-SR-06 (alto) | ST | SR-CAR-ST-T1: transicao valida SEM_CARRINHO -criar-> COM_CARRINHO | tests/integracao/serverest/ciclo-do-carrinho.spec.ts:9 SEM_CARRINHO + criar leva a COM_CARRINHO | nao executado |
| REQ-SR-007 | R-SR-06 (alto) | ST | SR-CAR-ST-T2: transicao valida COM_CARRINHO -concluir-> SEM_CARRINHO | tests/integracao/serverest/ciclo-do-carrinho.spec.ts:19 COM_CARRINHO + concluir leva a SEM_CARRINHO | nao executado |
| REQ-SR-007 | R-SR-06 (alto) | ST | SR-CAR-ST-T3: transicao valida COM_CARRINHO -cancelar-> SEM_CARRINHO | tests/integracao/serverest/ciclo-do-carrinho.spec.ts:30 COM_CARRINHO + cancelar leva a SEM_CARRINHO | nao executado |
| REQ-SR-007 | R-SR-06 (alto) | ST | SR-CAR-ST-X1: transicao invalida COM_CARRINHO -criar-> rejeitada (400); cobre a regra 'mais de 1 carrinho' | tests/integracao/serverest/ciclo-do-carrinho.spec.ts:41 COM_CARRINHO + criar e rejeitado (um carrinho por usuario) | nao executado |
| REQ-SR-007 | R-SR-06 (alto) | ST | SR-CAR-ST-X2: transicao invalida SEM_CARRINHO -concluir-> sem efeito | tests/integracao/serverest/ciclo-do-carrinho.spec.ts:51 SEM_CARRINHO + concluir nao tem efeito | nao executado |
| REQ-SR-007 | R-SR-06 (alto) | ST | SR-CAR-ST-X3: transicao invalida SEM_CARRINHO -cancelar-> sem efeito | tests/integracao/serverest/ciclo-do-carrinho.spec.ts:58 SEM_CARRINHO + cancelar nao tem efeito | nao executado |
| REQ-SR-007 | R-SR-06 (alto) | ST | SR-CAR-ST-E1: concluir mantem o estoque reduzido | tests/integracao/serverest/ciclo-do-carrinho.spec.ts:65 concluir mantem o estoque reduzido | nao executado |
| REQ-SR-007 | R-SR-06 (alto) | ST | SR-CAR-ST-E2: cancelar repoe o estoque | tests/integracao/serverest/ciclo-do-carrinho.spec.ts:75 cancelar repoe o estoque | nao executado |
| REQ-SR-008 | R-SR-08 (medio) | CHK | SR-CTR-CHK-USR: formato de GET /usuarios/{id} | tests/contrato/serverest/formato-de-resposta.spec.ts:8 usuario consultado tem os campos e tipos do contrato | nao executado |
| REQ-SR-008 | R-SR-08 (medio) | CHK | SR-CTR-CHK-PRD: formato de GET /produtos/{id} | tests/contrato/serverest/formato-de-resposta.spec.ts:14 produto consultado tem os campos e tipos do contrato | nao executado |
| REQ-SR-008 | R-SR-08 (medio) | CHK | SR-CTR-CHK-CAR: formato de GET /carrinhos/{id} | tests/contrato/serverest/formato-de-resposta.spec.ts:21 carrinho consultado tem os campos e tipos do contrato | nao executado |
| REQ-SR-008 | R-SR-08 (medio) | CHK | SR-CTR-CHK-ERR: formato de resposta de erro (message) | tests/contrato/serverest/formato-de-resposta.spec.ts:30 resposta de erro tem apenas o campo message | nao executado |
