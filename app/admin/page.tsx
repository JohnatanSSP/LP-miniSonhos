"use client";

import { useState } from "react";
import { Package, MapPin, User, Phone, Mail, CreditCard, Search, LogOut, Copy, Check } from "lucide-react";
import type { Order } from "@/app/api/orders/route";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  PENDING:   { label: "Aguardando",  color: "bg-yellow-100 text-yellow-700" },
  CONFIRMED: { label: "Confirmado",  color: "bg-green-100 text-green-700" },
  RECEIVED:  { label: "Pago",        color: "bg-green-100 text-green-700" },
  OVERDUE:   { label: "Vencido",     color: "bg-red-100 text-red-700" },
  REFUNDED:  { label: "Estornado",   color: "bg-gray-100 text-gray-500" },
};

const BILLING_LABEL: Record<string, string> = {
  PIX: "PIX",
  BOLETO: "Boleto",
  CREDIT_CARD: "Cartão",
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const login = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        headers: { "x-admin-secret": password },
      });
      if (!res.ok) {
        setError("Senha incorreta.");
        return;
      }
      const data = await res.json();
      setOrders(data);
      setAuthenticated(true);
    } catch {
      setError("Erro ao carregar pedidos.");
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = (order: Order) => {
    const addr = `${order.nome}\n${order.rua}, ${order.numero}${order.complemento ? ` - ${order.complemento}` : ""}\n${order.bairro}, ${order.cidade} - ${order.estado}\nCEP: ${order.cep}\nTel: ${order.telefone}`;
    navigator.clipboard.writeText(addr);
    setCopied(order.id);
    setTimeout(() => setCopied(null), 2000);
  };

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.nome.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q) ||
      o.cidade.toLowerCase().includes(q) ||
      o.paymentId.toLowerCase().includes(q)
    );
  });

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-purple-100 w-full max-w-sm text-center">
          <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-7 h-7 text-purple-500" />
          </div>
          <h1 className="text-2xl font-bold text-purple-900 mb-1">Admin</h1>
          <p className="text-sm text-gray-400 mb-6">Mini Sonhos — Pedidos</p>
          <input
            type="password"
            placeholder="Senha de acesso"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-200 mb-3 text-center"
          />
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <button
            onClick={login}
            disabled={loading || !password}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50"
          >
            {loading ? "Carregando..." : "Entrar"}
          </button>
          <p className="text-xs text-gray-300 mt-4">
            Senha padrão: <code>minisonhos2025</code><br />
            Configure ADMIN_SECRET no .env para mudar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-purple-900">Pedidos</h1>
          <p className="text-sm text-gray-400">{orders.length} pedido{orders.length !== 1 ? "s" : ""} no total</p>
        </div>
        <button
          onClick={() => { setAuthenticated(false); setOrders([]); setPassword(""); }}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition"
        >
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </div>

      {/* Busca */}
      <div className="max-w-6xl mx-auto mb-6 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
        <input
          type="text"
          placeholder="Buscar por nome, e-mail, cidade ou ID do pagamento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-200"
        />
      </div>

      {/* Lista de pedidos */}
      <div className="max-w-6xl mx-auto space-y-4">
        {filtered.length === 0 && (
          <div className="text-center text-gray-400 py-16">
            {search ? "Nenhum pedido encontrado para essa busca." : "Nenhum pedido ainda."}
          </div>
        )}

        {filtered.map((order) => {
          const status = STATUS_LABEL[order.paymentStatus] ?? { label: order.paymentStatus, color: "bg-gray-100 text-gray-500" };
          return (
            <div key={order.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <div className="flex flex-wrap gap-3 items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                      {BILLING_LABEL[order.billingType] ?? order.billingType}
                    </span>
                    <span className="text-xs text-purple-400 bg-purple-50 px-2 py-1 rounded-full">
                      {order.scoops} scoop{order.scoops > 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300">
                    {new Date(order.createdAt).toLocaleString("pt-BR")} · <code className="text-xs">{order.paymentId}</code>
                  </p>
                </div>
                <span className="text-2xl font-bold text-purple-900">
                  R$ {order.value.toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Dados pessoais */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Cliente</p>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <User className="w-4 h-4 text-purple-300 shrink-0" />
                    <span>{order.nome}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Mail className="w-4 h-4 text-purple-300 shrink-0" />
                    <a href={`mailto:${order.email}`} className="hover:text-purple-600 transition">
                      {order.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Phone className="w-4 h-4 text-purple-300 shrink-0" />
                    <a href={`https://wa.me/55${order.telefone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition">
                      {order.telefone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CreditCard className="w-4 h-4 text-purple-300 shrink-0" />
                    <span>{order.cpf}</span>
                  </div>
                </div>

                {/* Endereço */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Endereço de entrega</p>
                    <button
                      onClick={() => copyAddress(order)}
                      className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-600 transition"
                    >
                      {copied === order.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied === order.id ? "Copiado!" : "Copiar"}
                    </button>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <MapPin className="w-4 h-4 text-purple-300 shrink-0 mt-0.5" />
                    <div>
                      <p>{order.rua}, {order.numero}{order.complemento ? ` — ${order.complemento}` : ""}</p>
                      <p>{order.bairro}</p>
                      <p>{order.cidade} — {order.estado}</p>
                      <p className="text-gray-400">CEP: {order.cep}</p>
                    </div>
                  </div>
                  {order.observacoes && (
                    <div className="mt-2 text-sm text-gray-500 bg-yellow-50 rounded-xl px-3 py-2 border border-yellow-100">
                      💬 {order.observacoes}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
