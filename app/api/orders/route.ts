/**
 * POST /api/orders  → salva pedido com dados do cliente e endereço
 * GET  /api/orders  → lista todos os pedidos (protegido por senha)
 */

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "minisonhos2025";

export interface Order {
  id: string;
  createdAt: string;
  paymentId: string;
  paymentStatus: string;
  billingType: string;
  value: number;
  scoops: number;
  // Dados pessoais
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  // Endereço de entrega
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  observacoes: string;
}

async function readOrders(): Promise<Order[]> {
  try {
    const content = await fs.readFile(ORDERS_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function saveOrders(orders: Order[]): Promise<void> {
  await fs.mkdir(path.dirname(ORDERS_FILE), { recursive: true });
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

// ─── POST – Salvar pedido ──────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const order: Order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      paymentId: body.paymentId ?? "",
      paymentStatus: "PENDING",
      billingType: body.billingType ?? "",
      value: body.value ?? 0,
      scoops: body.scoops ?? 1,
      nome: body.nome ?? "",
      email: body.email ?? "",
      cpf: body.cpf ?? "",
      telefone: body.telefone ?? "",
      rua: body.rua ?? "",
      numero: body.numero ?? "",
      complemento: body.complemento ?? "",
      bairro: body.bairro ?? "",
      cidade: body.cidade ?? "",
      estado: body.estado ?? "",
      cep: body.cep ?? "",
      observacoes: body.observacoes ?? "",
    };

    const orders = await readOrders();
    orders.unshift(order); // mais recente primeiro
    await saveOrders(orders);

    console.log(`✅ Pedido salvo: ${order.id} — ${order.nome} — R$ ${order.value}`);

    return NextResponse.json({ success: true, orderId: order.id }, { status: 201 });
  } catch (error) {
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

  const orders = await readOrders();
  return NextResponse.json(orders);
}
