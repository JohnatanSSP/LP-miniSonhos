/**
 * GET /api/payments/[id]/pix  → retorna QR Code e payload PIX
 */

import { NextRequest, NextResponse } from "next/server";
import { asaasRequest, AsaasError, AsaasPixQrCode } from "@/app/lib/asaas";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const pix = await asaasRequest<AsaasPixQrCode>(`/payments/${id}/pixQrCode`);
    return NextResponse.json(pix);
  } catch (error) {
    if (error instanceof AsaasError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
