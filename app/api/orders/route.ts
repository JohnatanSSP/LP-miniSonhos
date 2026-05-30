/**
 * POST /api/orders  → salva pedido no PostgreSQL
 * GET  /api/orders  → lista pedidos (protegido por senha)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { PaymentStatus } from "@prisma/client";

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "minisonhos2025";

// ─── POST – Salvar pedido ──────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      paymentId, billingType, value, scoops,
      nome, email, cpf, telefone,
      rua, numero, complemento, bairro, cidade, estado, cep, observacoes,
    } = body;

    if (!paymentId || !nome || !email || !cpf) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        paymentId,
        paymentStatus: "PENDING",
        billingType: billingType ?? "PIX",
        value: parseFloat(value) ?? 0,
        scoops: parseInt(scoops) ?? 1,
        nome,
        email,
        cpf: cpf.replace(/\D/g, ""),
        telefone: telefone.replace(/\D/g, ""),
        rua, numero,
        complemento: complemento || null,
        bairro, cidade, estado,
        cep: cep.replace(/\D/g, ""),
        observacoes: observacoes || null,
      },
    });

    console.log(`✅ Pedido salvo: ${order.id} — ${order.nome}`);
    return NextResponse.json({ success: true, orderId: order.id }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "Pedido já registrado para este pagamento" }, { status: 409 });
    }
    console.error("Erro ao salvar pedido:", error);
    return NextResponse.json({ error: "Erro ao salvar pedido" }, { status: 500 });
  }
}

// ─── GET – Listar pedidos (admin) ──────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const secret = request.headers.get("x-admin-secret");
  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") as PaymentStatus | null;
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "50");

  const where = {
    ...(status ? { paymentStatus: status } : {}),
    ...(search ? {
      OR: [
        { nome: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
        { cidade: { contains: search, mode: "insensitive" as const } },
        { paymentId: { contains: search, mode: "insensitive" as const } },
      ],
    } : {}),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit }),
    prisma.order.count({ where }),
  ]);

  return NextResponse.json({ orders, total, page, limit });
}

// Exporta o tipo para a página admin
export type { Order } from "@prisma/client";
