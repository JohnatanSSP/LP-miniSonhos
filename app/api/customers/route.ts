/**
 * POST /api/customers  → cria ou retorna cliente existente no Asaas
 * GET  /api/customers?cpfCnpj=...  → busca cliente por CPF/CNPJ
 */

import { NextRequest, NextResponse } from "next/server";
import { asaasRequest, AsaasError, AsaasCustomer } from "@/app/lib/asaas";

// Rate limit simples em memória (reinicia com o servidor)
// Para produção, use Upstash Redis ou similar
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const window = 60_000; // 1 minuto
  const maxRequests = 10;

  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + window });
    return true;
  }
  if (entry.count >= maxRequests) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  // Rate limit por IP
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Muitas requisições. Tente novamente em 1 minuto." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { name, email, cpfCnpj, phone, mobilePhone, postalCode } = body;

    if (!name || !email || !cpfCnpj) {
      return NextResponse.json(
        { error: "Campos obrigatórios: name, email, cpfCnpj" },
        { status: 400 }
      );
    }

    const cpfLimpo = cpfCnpj.replace(/\D/g, "");

    // Verificar se cliente já existe
    const existing = await asaasRequest<{ data: AsaasCustomer[] }>(
      `/customers?cpfCnpj=${cpfLimpo}`
    );

    if (existing.data.length > 0) {
      return NextResponse.json(existing.data[0], { status: 200 });
    }

    const customer = await asaasRequest<AsaasCustomer>("/customers", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        cpfCnpj: cpfLimpo,
        phone,
        mobilePhone,
        postalCode,
      }),
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    if (error instanceof AsaasError) {
      console.error("Asaas error ao criar cliente:", error.status, error.body);
      return NextResponse.json(
        { error: error.message, details: error.body },
        { status: error.status }
      );
    }
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Erro ao criar cliente:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const cpfCnpj = new URL(request.url).searchParams.get("cpfCnpj");
    const query = cpfCnpj ? `?cpfCnpj=${cpfCnpj.replace(/\D/g, "")}` : "";
    const result = await asaasRequest<{ data: AsaasCustomer[]; totalCount: number }>(
      `/customers${query}`
    );
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AsaasError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
