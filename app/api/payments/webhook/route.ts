/**
 * POST /api/payments/webhook  → recebe eventos do Asaas e atualiza banco
 *
 * Configure no painel Asaas:
 *   Configurações → Integrações → Webhooks → URL: https://seudominio.com/api/payments/webhook
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { PaymentStatus } from "@prisma/client";

type AsaasEvent =
  | "PAYMENT_CREATED" | "PAYMENT_UPDATED" | "PAYMENT_CONFIRMED"
  | "PAYMENT_RECEIVED" | "PAYMENT_OVERDUE" | "PAYMENT_DELETED"
  | "PAYMENT_REFUNDED" | "PAYMENT_RECEIVED_IN_CASH"
  | "PAYMENT_REFUND_REQUESTED" | "PAYMENT_CHARGEBACK_REQUESTED";

interface WebhookPayload {
  event: AsaasEvent;
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

// Mapeia status do Asaas para o enum do banco
const STATUS_MAP: Record<string, PaymentStatus> = {
  PENDING:              "PENDING",
  CONFIRMED:            "CONFIRMED",
  RECEIVED:             "RECEIVED",
  OVERDUE:              "OVERDUE",
  REFUNDED:             "REFUNDED",
  RECEIVED_IN_CASH:     "RECEIVED_IN_CASH",
  REFUND_REQUESTED:     "REFUND_REQUESTED",
  CHARGEBACK_REQUESTED: "CHARGEBACK_REQUESTED",
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as WebhookPayload;
    const { event, payment } = body;

    console.log(`📨 Asaas webhook: ${event}`, { id: payment?.id, status: payment?.status });

    // Atualiza status no banco baseado no evento
    const newStatus = STATUS_MAP[payment?.status] ?? null;

    if (newStatus && payment?.id) {
      await prisma.order.updateMany({
        where: { paymentId: payment.id },
        data: { paymentStatus: newStatus },
      }).catch((err) => {
        // updateMany não joga erro se não encontrar — só loga
        console.warn("Pedido não encontrado no banco para paymentId:", payment.id, err);
      });
    }

    switch (event) {
      case "PAYMENT_RECEIVED":
      case "PAYMENT_CONFIRMED":
        console.log(`✅ Pago: ${payment.id} — R$ ${payment.value}`);
        // TODO: Enviar e-mail de confirmação para o cliente
        break;
      case "PAYMENT_OVERDUE":
        console.log(`⚠️  Vencida: ${payment.id}`);
        break;
      case "PAYMENT_REFUNDED":
        console.log(`🔄 Estornado: ${payment.id}`);
        break;
    }

    // Asaas espera HTTP 200 para marcar como entregue
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Erro no webhook:", error);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
