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

// Retorna a data de vencimento hoje + N dias no formato YYYY-MM-DD
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
      creditCard,
      creditCardHolderInfo,
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

    // Asaas exige value como número com até 2 casas decimais (ex: 75.00)
    const valueFloat = parseFloat(Number(value).toFixed(2));

    const payload: Record<string, unknown> = {
      customer: customerId,
      billingType,
      value: valueFloat,
      dueDate: dueDateFromNow(3),
      description: description ?? "Mini Sonhos – Pedido surpresa",
      externalReference: externalReference ?? undefined,
    };

    if (installmentCount) {
      payload.installmentCount = installmentCount;
      payload.installmentValue =
        installmentValue ?? parseFloat((valueFloat / installmentCount).toFixed(2));
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

    console.log("→ Criando cobrança Asaas:", JSON.stringify(payload));

    const payment = await asaasRequest<AsaasPayment>("/payments", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    console.log("✓ Cobrança criada:", payment.id, payment.status);

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    if (error instanceof AsaasError) {
      console.error("Asaas error ao criar cobrança:", error.status, JSON.stringify(error.body));
      return NextResponse.json(
        { error: error.message, details: error.body },
        { status: error.status }
      );
    }
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Erro inesperado ao criar cobrança:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
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
      console.error("Asaas error ao listar cobranças:", error.status, JSON.stringify(error.body));
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
