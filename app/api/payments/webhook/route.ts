/**
 * POST /api/payments/webhook  → recebe eventos do Asaas
 *
 * Configure no painel Asaas:
 *   Configurações → Integrações → Webhooks → URL: https://seudominio.com/api/payments/webhook
 */

import { NextRequest, NextResponse } from "next/server";

type WebhookEvent =
  | "PAYMENT_CREATED"
  | "PAYMENT_UPDATED"
  | "PAYMENT_CONFIRMED"
  | "PAYMENT_RECEIVED"
  | "PAYMENT_OVERDUE"
  | "PAYMENT_DELETED"
  | "PAYMENT_REFUNDED";

interface WebhookPayload {
  event: WebhookEvent;
  payment: {
    id: string;
    customer: string;
    status: string;
    billingType: string;
    value: number;
    netValue: number;
    dueDate: string;
    paymentDate?: string;
    description?: string;
    externalReference?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as WebhookPayload;
    const { event, payment } = body;

    console.log(`📨 Asaas webhook: ${event}`, {
      id: payment?.id,
      status: payment?.status,
      value: payment?.value,
    });

    switch (event) {
      case "PAYMENT_RECEIVED":
      case "PAYMENT_CONFIRMED": {
        // ✅ Pagamento confirmado — libere o produto/serviço aqui
        // TODO: atualizar status do pedido no banco e enviar e-mail de confirmação
        console.log(`✅ Pago: ${payment.id} — R$ ${payment.value}`);
        break;
      }
      case "PAYMENT_OVERDUE": {
        // ⚠️ Vencida — suspenda acesso ou envie lembrete
        console.log(`⚠️  Vencida: ${payment.id}`);
        break;
      }
      case "PAYMENT_REFUNDED": {
        // 🔄 Estorno — revogue acesso e registre
        console.log(`🔄 Estornado: ${payment.id}`);
        break;
      }
      default:
        console.log(`Evento não tratado: ${event}`);
    }

    // Asaas espera HTTP 200 para marcar como entregue
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Erro no webhook:", error);
    // Retorne 200 mesmo em erro para não travar a fila do Asaas
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
