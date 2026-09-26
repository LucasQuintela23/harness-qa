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
