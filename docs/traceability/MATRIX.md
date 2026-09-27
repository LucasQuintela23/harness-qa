# Traceability matrix (generated, do not edit)

| Requirement | Risk | Technique | Coverage item | Test case | Run |
|---|---|---|---|---|---|
| REQ-EX-001 | R-EX-001 (medium) | EP | EX-EP-V: valid partition: integer in 1..10 | tests/component/example/quantity.spec.ts:20 quantity: accepts an integer within range | expected |
| REQ-EX-001 | R-EX-001 (medium) | EP | EX-EP-I1: invalid partition: less than 1 | tests/component/example/quantity.spec.ts:20 quantity: rejects below the minimum | expected |
| REQ-EX-001 | R-EX-001 (medium) | EP | EX-EP-I2: invalid partition: greater than 10 | tests/component/example/quantity.spec.ts:20 quantity: rejects above the maximum | expected |
| REQ-EX-001 | R-EX-001 (medium) | EP | EX-EP-I3: invalid partition: not an integer | tests/component/example/quantity.spec.ts:20 quantity: rejects a non-integer | expected |
| REQ-EX-001 | R-EX-001 (medium) | BVA3 | EX-BV-0: boundary 0 (below the minimum) | tests/component/example/quantity.spec.ts:20 quantity: rejects 0 (below the lower boundary) | expected |
| REQ-EX-001 | R-EX-001 (medium) | BVA3 | EX-BV-1: boundary 1 (minimum) | tests/component/example/quantity.spec.ts:20 quantity: accepts 1 (lower boundary) | expected |
| REQ-EX-001 | R-EX-001 (medium) | BVA3 | EX-BV-2: boundary 2 (above the minimum) | tests/component/example/quantity.spec.ts:20 quantity: accepts 2 (above the lower boundary) | expected |
| REQ-EX-001 | R-EX-001 (medium) | BVA3 | EX-BV-9: boundary 9 (below the maximum) | tests/component/example/quantity.spec.ts:20 quantity: accepts 9 (below the upper boundary) | expected |
| REQ-EX-001 | R-EX-001 (medium) | BVA3 | EX-BV-10: boundary 10 (maximum) | tests/component/example/quantity.spec.ts:20 quantity: accepts 10 (upper boundary) | expected |
| REQ-EX-001 | R-EX-001 (medium) | BVA3 | EX-BV-11: boundary 11 (above the maximum) | tests/component/example/quantity.spec.ts:20 quantity: rejects 11 (above the upper boundary) | expected |
| REQ-EX-002 | R-EX-002 (high) | DT | EX-DT-R1: rule 1: volume<6, no loyalty, no coupon = 0% | tests/component/example/discount.spec.ts:14 discount: R1 no volume, loyalty, or coupon results in 0% | expected |
| REQ-EX-002 | R-EX-002 (high) | DT | EX-DT-R2: rule 2: volume>=6 only = 10% | tests/component/example/discount.spec.ts:14 discount: R2 volume only results in 10% | expected |
| REQ-EX-002 | R-EX-002 (high) | DT | EX-DT-R3: rule 3: loyalty only = 5% | tests/component/example/discount.spec.ts:14 discount: R3 loyalty only results in 5% | expected |
| REQ-EX-002 | R-EX-002 (high) | DT | EX-DT-R4: rule 4: coupon only = 5% | tests/component/example/discount.spec.ts:14 discount: R4 coupon only results in 5% | expected |
| REQ-EX-002 | R-EX-002 (high) | DT | EX-DT-R5: rule 5: volume + loyalty + coupon = 15% (ceiling) | tests/component/example/discount.spec.ts:14 discount: R5 all, capped at the ceiling results in 15% | expected |
| REQ-EX-003 | R-EX-003 (high) | ST | EX-ST-T1: valid transition CREATED -pay-> PAID | tests/component/example/order-lifecycle.spec.ts:20 order: CREATED + pay goes to PAID | expected |
| REQ-EX-003 | R-EX-003 (high) | ST | EX-ST-T2: valid transition PAID -ship-> SHIPPED | tests/component/example/order-lifecycle.spec.ts:20 order: PAID + ship goes to SHIPPED | expected |
| REQ-EX-003 | R-EX-003 (high) | ST | EX-ST-T3: valid transition SHIPPED -deliver-> DELIVERED | tests/component/example/order-lifecycle.spec.ts:20 order: SHIPPED + deliver goes to DELIVERED | expected |
| REQ-EX-003 | R-EX-003 (high) | ST | EX-ST-T4: valid transition CREATED -cancel-> CANCELED | tests/component/example/order-lifecycle.spec.ts:20 order: CREATED + cancel goes to CANCELED | expected |
| REQ-EX-003 | R-EX-003 (high) | ST | EX-ST-T5: valid transition PAID -cancel-> CANCELED | tests/component/example/order-lifecycle.spec.ts:20 order: PAID + cancel goes to CANCELED | expected |
| REQ-EX-003 | R-EX-003 (high) | ST | EX-ST-X1: invalid transition CREATED -ship-> rejected | tests/component/example/order-lifecycle.spec.ts:28 order: ship on CREATED is rejected | expected |
| REQ-EX-003 | R-EX-003 (high) | ST | EX-ST-X2: invalid transition SHIPPED -cancel-> rejected | tests/component/example/order-lifecycle.spec.ts:28 order: cancel on SHIPPED is rejected | expected |
| REQ-EX-003 | R-EX-003 (high) | ST | EX-ST-X3: invalid transition DELIVERED -pay-> rejected | tests/component/example/order-lifecycle.spec.ts:28 order: pay on DELIVERED is rejected | expected |
| REQ-EX-003 | R-EX-003 (high) | ST | EX-ST-X4: invalid transition CANCELED -pay-> rejected | tests/component/example/order-lifecycle.spec.ts:28 order: pay on CANCELED is rejected | expected |
