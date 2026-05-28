/**
 * POST /api/payments  → cria cobrança no Asaas (PIX, BOLETO, CREDIT_CARD)
 * GET  /api/payments?customerId=... → lista cobranças
 */

import { NextRequest, NextResponse } from "next/server";
import {
  asaasRequest,
  AsaasError,
  AsaasPayment,
  BillingType,
} from "@/lib/asaas";

// Retorna a data de vencimento de hoje + N dias no formato YYYY-MM-DD
function dueDateFromNow(days = 3): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      customerId,
      billingType,
      value,
      description,
      externalReference,
      // Cartão de crédito
      creditCard,
      creditCardHolderInfo,
      // Parcelamento
      installmentCount,
      installmentValue,
    } = body;

    if (!customerId || !billingType || !value) {
      return NextResponse.json(
        { error: "Campos obrigatórios: customerId, billingType, value" },
        { status: 400 }
      );
    }

    const validTypes: BillingType[] = ["PIX", "BOLETO", "CREDIT_CARD", "UNDEFINED"];
    if (!validTypes.includes(billingType)) {
      return NextResponse.json(
        { error: `billingType inválido. Use: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const payload: Record<string, unknown> = {
      customer: customerId,
      billingType,
      value,
      dueDate: dueDateFromNow(3),
      description: description ?? "Mini Sonhos – Pedido surpresa",
      externalReference,
    };

    if (installmentCount) {
      payload.installmentCount = installmentCount;
      payload.installmentValue = installmentValue ?? (value / installmentCount).toFixed(2);
    }

    if (billingType === "CREDIT_CARD" && creditCard) {
      if (!creditCardHolderInfo) {
        return NextResponse.json(
          { error: "creditCardHolderInfo obrigatório junto com creditCard" },
          { status: 400 }
        );
      }
      payload.creditCard = creditCard;
      payload.creditCardHolderInfo = creditCardHolderInfo;
    }

    const payment = await asaasRequest<AsaasPayment>("/payments", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    if (error instanceof AsaasError) {
      return NextResponse.json(
        { error: error.message, details: error.body },
        { status: error.status }
      );
    }
    console.error("Erro ao criar cobrança:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar cobrança" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams();
    const customerId = searchParams.get("customerId");
    const status = searchParams.get("status");
    if (customerId) params.set("customer", customerId);
    if (status) params.set("status", status);

    const result = await asaasRequest<{ data: AsaasPayment[]; totalCount: number }>(
      `/payments${params.toString() ? `?${params}` : ""}`
    );

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AsaasError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
