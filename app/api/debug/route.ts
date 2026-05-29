/**
 * GET /api/debug  → testa a conexão com o Asaas e mostra o erro real
 * REMOVER antes de ir para produção!
 */
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.ASAAS_API_KEY;
  const env = process.env.ASAAS_ENVIRONMENT;
  const baseUrl = env === "production"
    ? "https://api.asaas.com/v3"
    : "https://sandbox.asaas.com/api/v3";

  const info = {
    environment: env ?? "NÃO DEFINIDO",
    baseUrl,
    apiKeyPresent: !!apiKey,
    apiKeyPrefix: apiKey ? apiKey.substring(0, 20) + "..." : "AUSENTE",
  };

  // Teste 1: listar clientes (GET simples)
  try {
    const res = await fetch(`${baseUrl}/customers?limit=1`, {
      headers: { "Content-Type": "application/json", access_token: apiKey! },
      cache: "no-store",
    });
    const text = await res.text();
    let body: unknown;
    try { body = JSON.parse(text); } catch { body = text; }

    return NextResponse.json({
      ...info,
      test: "GET /customers",
      statusCode: res.status,
      ok: res.ok,
      response: body,
    });
  } catch (e) {
    return NextResponse.json({
      ...info,
      test: "GET /customers",
      fetchError: String(e),
    }, { status: 500 });
  }
}
