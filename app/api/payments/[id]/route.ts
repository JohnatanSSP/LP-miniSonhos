/**
 * GET    /api/payments/[id]  → busca cobrança
 * DELETE /api/payments/[id]  → cancela cobrança
 */

import { NextRequest, NextResponse } from "next/server";
import { asaasRequest, AsaasError, AsaasPayment } from "@/app/lib/asaas";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const payment = await asaasRequest<AsaasPayment>(`/payments/${id}`);
    return NextResponse.json(payment);
  } catch (error) {
    if (error instanceof AsaasError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await asaasRequest(`/payments/${id}`, { method: "DELETE" });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AsaasError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
