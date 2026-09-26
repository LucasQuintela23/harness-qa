# Plano de teste: API ServeRest

Versão 1.0 · Escopo: `/login`, `/usuarios`, `/produtos`, `/carrinhos` · Revisão estática: feita (`/revisar-plano-de-teste` sobre o plano aprovado)

## 1. Escopo
API REST de e-commerce ServeRest. Dentro: regras de negócio e contrato das rotas acima. Fora: segurança, carga, UI. Itens de teste: ServeRest 3.x (`serverest@^3`, instância local) e, em execução manual, https://serverest.dev.

## 2. Riscos
Fonte única: `docs/rastreabilidade/serverest.json` (R-SR-01 a R-SR-08). Crítico: R-SR-05 (carrinho); altos: R-SR-02, 03, 06, 07; médios: R-SR-01, 04, 08.

## 3. Técnicas por nível e tipo
| Nível | Tipo | Requisito/risco | Técnica | Cobertura | Justificativa |
|---|---|---|---|---|---|
| Sistema | Funcional | REQ-SR-001 / R-SR-01 | DT, EP | 3 regras + 2 partições inválidas | Combinação e-mail x senha; entrada malformada |
| Sistema | Funcional | REQ-SR-002 / R-SR-03 | EP, DT, EG | 5 partições, 3 regras, 4 EG | Campos com domínio; unicidade; PUT que cria |
| Sistema | Funcional | REQ-SR-003 / R-SR-02 | DT | 10 regras (POST completa; PUT/DELETE reduzidas) | Tabela reduzida: a lógica de autenticação é a mesma nas 3 operações |
| Sistema | Funcional | REQ-SR-004 / R-SR-04 | BVA2, EP | limites de `preco` (0,1) e `quantidade` (-1,0); 6 partições | Risco médio: BVA2 |
| Sistema | Funcional | REQ-SR-005 / R-SR-07 | DT | 4 regras | Integridade referencial |
| Sistema | Funcional | REQ-SR-006 / R-SR-05 | BVA3, DT | 6 limites (0,1,2 e E-1,E,E+1 com E=5), 4 regras | Risco crítico: BVA3 |
| Sistema | Funcional | REQ-SR-007 / R-SR-06 | ST | 2 estados, 3 transições válidas, 3 inválidas, 2 efeitos no estoque | Ciclo do carrinho |
| Integração de componentes | Contrato | REQ-SR-008 / R-SR-08 | CHK | 4 formatos | Lista finita de campos e tipos |
| Sistema | Baseado em experiência | REQ-SR-003 / R-SR-02 | EG | token expirado | Item manual (ver §8) |

Decisão de modelagem: a regra "usuário já tem carrinho" da DT de REQ-SR-006 é coberta pelo item ST `SR-CAR-ST-X1` (mesmo comportamento), para não duplicar teste.

## 4. Critérios de entrada
Instância ServeRest respondendo (`GET /produtos` 200); `npm run verificar` verde.

## 5. Critérios de saída
63 itens automatizáveis com teste passando; requisitos de risco alto/crítico cobertos (`npm run sensores:drift`); 3 execuções seguidas sem flaky (`--repeat-each=3`); suíte dentro do orçamento (180 s).

## 6. Matriz de rastreabilidade
`docs/rastreabilidade/MATRIZ.md`, gerada por `npm run matriz`: requisito → risco → técnica → item de cobertura → caso de teste → execução.

## 7. Dados, ambientes e regressão
- Dados: cada teste cria seus usuários/produtos/carrinhos por `MassaDeTesteServeRest` (e-mails e nomes únicos por UUID; senha aleatória por usuário) e remove tudo no teardown. Sem estado compartilhado.
- Ambientes: `API_URL` em `.env` (padrão `http://localhost:3000`). O ambiente público bloqueia carga (HTTP 429): usar somente manualmente, com `--workers=1`.
- Regressão: por risco (`--grep "@risco:R-SR-05"`, etc.); suíte completa em cada PR (dura segundos localmente).

## 8. Itens não automatizados
- `SR-AUT-EG-EXP` (token expirado, 600 s): automatizável com uma instância local `serverest --timeout 2`; fica como evolução. Até lá, coberto pelo charter `docs/charters/EXPL-SR-01.md`.

## 9. Suspensão e retomada
Suspende se a instância não subir, ou se mais de 5% das falhas tiverem causa única de ambiente (ex.: 429). Retoma com `GET /produtos` estável.

## 10. Comportamentos confirmados contra a API real
(Verificados por chamadas diretas antes de virarem oráculo.)
- Login com e-mail malformado ou senha ausente retorna **400**, não 401. Credencial válida com senha errada ou e-mail inexistente retorna 401.
- `preco`: 0 → 400 "deve ser um número positivo"; decimal → "deve ser um inteiro"; texto → "deve ser um número". `quantidade`: -1 → 400; 0 é válido no produto.
- No carrinho, `quantidade` 0 é inválida (mínimo 1), ao contrário do produto (mínimo 0). O estoque é reduzido na **criação** do carrinho; `cancelar-compra` reabastece; `concluir-compra` mantém reduzido.
- `GET /usuarios/{id}` exige id de 16 caracteres alfanuméricos; id válido inexistente → 400 "Usuário não encontrado".
- O ambiente público responde 429 ("comportamento equivalente a teste de carga") quando a suíte roda em paralelo.
