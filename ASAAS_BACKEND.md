# Backend Asaas — miniSonhos

Integração com a API do [Asaas](https://docs.asaas.com) para processar pagamentos via **PIX**, **boleto** e **cartão de crédito** dentro do projeto Next.js.

---

## Estrutura de arquivos

lib/

  asaas.ts                          ← cliente base \+ tipos TypeScript

app/api/

  customers/

    route.ts                        ← POST /api/customers  (criar cliente)

                                      GET  /api/customers  (buscar clientes)

  payments/

    route.ts                        ← POST /api/payments   (criar cobrança)

                                      GET  /api/payments   (listar cobranças)

    \[id\]/

      route.ts                      ← GET    /api/payments/:id  (buscar)

                                      DELETE /api/payments/:id  (cancelar)

      pix/

        route.ts                    ← GET /api/payments/:id/pix  (QR Code PIX)

    webhook/

      route.ts                      ← POST /api/payments/webhook  (eventos Asaas)

---

## Setup

### 1\. Instalar dependências

Não há dependência nova — a integração usa apenas `fetch` nativo do Node.js 18+.

### 2\. Variáveis de ambiente

Copie `.env.local.example` para `.env.local` e preencha:

cp .env.local.example .env.local

ASAAS\_API\_KEY=$aas\_SuaChaveAqui

ASAAS\_ENVIRONMENT=sandbox   \# "sandbox" ou "production"

**Onde encontrar a chave:** Painel Asaas → Minha Conta → Configurações → Integrações → Chave de API

---

## Uso dos endpoints

### Criar cliente

POST /api/customers

Content-Type: application/json

{

  "name": "João da Silva",

  "email": "joao@email.com",

  "cpfCnpj": "12345678900"

}

**Resposta:** `{ id: "cus_xxx", name: "...", email: "...", ... }`

---

### Criar cobrança PIX

POST /api/payments

Content-Type: application/json

{

  "customerId": "cus\_xxx",

  "billingType": "PIX",

  "value": 99.90,

  "dueDate": "2025-12-31",

  "description": "Mini Sonhos \- Kit Especial"

}

Depois de criar, busque o QR Code:

GET /api/payments/pay\_xxx/pix

**Resposta:**

{

  "encodedImage": "data:image/png;base64,...",

  "payload": "00020126...",

  "expirationDate": "2025-12-31T23:59:59"

}

---

### Criar cobrança Boleto

POST /api/payments

Content-Type: application/json

{

  "customerId": "cus\_xxx",

  "billingType": "BOLETO",

  "value": 99.90,

  "dueDate": "2025-12-31",

  "description": "Mini Sonhos \- Kit Especial"

}

**Resposta:** contém `bankSlipUrl` com o PDF do boleto e `invoiceUrl` para a página de pagamento.

---

### Criar cobrança com Cartão de Crédito

**Opção A — redirecionar para a fatura Asaas (recomendado para PCI-DSS):**

POST /api/payments

Content-Type: application/json

{

  "customerId": "cus\_xxx",

  "billingType": "CREDIT\_CARD",

  "value": 99.90,

  "dueDate": "2025-12-31"

}

Use o `invoiceUrl` da resposta para redirecionar o cliente.

**Opção B — enviar dados do cartão diretamente (requer certificação PCI-DSS):**

POST /api/payments

Content-Type: application/json

{

  "customerId": "cus\_xxx",

  "billingType": "CREDIT\_CARD",

  "value": 99.90,

  "dueDate": "2025-12-31",

  "creditCard": {

    "holderName": "João da Silva",

    "number": "4111111111111111",

    "expiryMonth": "12",

    "expiryYear": "2030",

    "ccv": "123"

  },

  "creditCardHolderInfo": {

    "name": "João da Silva",

    "email": "joao@email.com",

    "cpfCnpj": "12345678900",

    "postalCode": "01310100",

    "addressNumber": "100"

  }

}

---

### Parcelamento

Adicione os campos extras ao criar a cobrança:

{

  "installmentCount": 6,

  "installmentValue": 16.65

}

---

### Consultar status de uma cobrança

GET /api/payments/pay\_xxx

**Status possíveis:** `PENDING`, `RECEIVED`, `CONFIRMED`, `OVERDUE`, `REFUNDED`, ...

---

### Cancelar cobrança

DELETE /api/payments/pay\_xxx

---

## Webhooks

### Configurar no painel Asaas

1. Painel Asaas → Configurações → Notificações → Webhooks → Criar  
2. URL: `https://seudominio.com/api/payments/webhook`  
3. Marque os eventos desejados (recomendado: todos de `PAYMENT_*`)

### Testar localmente

Use [ngrok](https://ngrok.com) para expor o localhost:

ngrok http 3000

\# Use a URL gerada: https://xxxx.ngrok.io/api/payments/webhook

### Eventos tratados

| Evento | Descrição | Ação padrão |
| :---- | :---- | :---- |
| `PAYMENT_RECEIVED` | Pago e saldo disponível | `handlePaymentConfirmed` |
| `PAYMENT_CONFIRMED` | Pago, aguardando compensação | `handlePaymentConfirmed` |
| `PAYMENT_OVERDUE` | Cobrança vencida | `handlePaymentOverdue` |
| `PAYMENT_REFUNDED` | Estorno realizado | `handlePaymentRefunded` |
| `PAYMENT_CREATED` | Nova cobrança gerada | Log |
| `PAYMENT_UPDATED` | Cobrança alterada | Log |

Implemente a lógica de negócio nas funções `handlePayment*` dentro de `webhook/route.ts`.

---

## Sandbox (testes)

- **URL sandbox:** `https://sandbox.asaas.com/api/v3`  
- **Cartão de teste:** `4111111111111111` (Visa) / ccv: qualquer 3 dígitos  
- Simule pagamentos pelo painel: Cobranças → Simular pagamento

Mais detalhes: [docs.asaas.com/docs/sandbox-3](https://docs.asaas.com/docs/sandbox-3)  
