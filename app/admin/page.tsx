"use client";

import { useState } from "react";
import {
  Package, MapPin, User, Phone, Mail, CreditCard,
  Search, LogOut, Copy, Check, RefreshCw, Filter,
} from "lucide-react";

interface Order {
  id: string;
  createdAt: string;
  paymentId: string;
  paymentStatus: string;
  billingType: string;
  value: number;
  scoops: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  rua: string;
  numero: string;
  complemento?: string | null;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  observacoes?: string | null;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING:              { label: "Aguardando",  color: "bg-yellow-100 text-yellow-700" },
  CONFIRMED:            { label: "Confirmado",  color: "bg-blue-100 text-blue-700" },
  RECEIVED:             { label: "Pago",        color: "bg-green-100 text-green-700" },
  RECEIVED_IN_CASH:     { label: "Pago",        color: "bg-green-100 text-green-700" },
  OVERDUE:              { label: "Vencido",     color: "bg-red-100 text-red-700" },
  REFUNDED:             { label: "Estornado",   color: "bg-gray-100 text-gray-500" },
  REFUND_REQUESTED:     { label: "Estorno req.", color: "bg-orange-100 text-orange-600" },
  CHARGEBACK_REQUESTED: { label: "Chargeback",  color: "bg-red-100 text-red-700" },
};

const BILLING_MAP: Record<string, string> = {
  PIX: "PIX", BOLETO: "Boleto", CREDIT_CARD: "Cartão",
};

export default function AdminPage() {
  const [password, setPassword]         = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [orders, setOrders]             = useState<Order[]>([]);
  const [total, setTotal]               = useState(0);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [copied, setCopied]             = useState<string | null>(null);
  const [secret, setSecret]             = useState("");

  const fetchOrders = async (s = search, st = statusFilter, pwd = secret) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (s) params.set("search", s);
      if (st) params.set("status", st);

      const res = await fetch(`/api/orders?${params}`, {
        headers: { "x-admin-secret": pwd },
      });
      if (!res.ok) { setError("Senha incorreta."); return; }
      const data = await res.json();
      setOrders(data.orders ?? []);
      setTotal(data.total ?? 0);
      setAuthenticated(true);
      setSecret(pwd);
    } catch {
      setError("Erro ao carregar pedidos.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => fetchOrders("", "", password);

  const copyAddress = (order: Order) => {
    const lines = [
      order.nome,
      `${order.rua}, ${order.numero}${order.complemento ? ` - ${order.complemento}` : ""}`,
      `${order.bairro}, ${order.cidade} - ${order.estado}`,
      `CEP: ${order.cep}`,
      `Tel: ${order.telefone}`,
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(order.id);
    setTimeout(() => setCopied(null), 2000);
  };

  // ── Login ──────────────────────────────────────────────────────────────────

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
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-200 mb-3 text-center"
          />
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <button
            onClick={handleLogin}
            disabled={loading || !password}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50"
          >
            {loading ? "Carregando..." : "Entrar"}
          </button>
        </div>
      </div>
    );
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────

  const totalValue = orders.reduce((sum, o) => sum + o.value, 0);
  const paidCount = orders.filter((o) =>
    ["RECEIVED", "CONFIRMED", "RECEIVED_IN_CASH"].includes(o.paymentStatus)
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-purple-900">Pedidos</h1>
          <p className="text-sm text-gray-400">
            {total} pedido{total !== 1 ? "s" : ""} · {paidCount} pago{paidCount !== 1 ? "s" : ""} ·{" "}
            R$ {totalValue.toFixed(2)} nesta página
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchOrders()}
            className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-600 transition p-2 rounded-xl hover:bg-purple-50"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setAuthenticated(false); setOrders([]); setPassword(""); setSecret(""); }}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="max-w-6xl mx-auto mb-6 flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail, cidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchOrders(search)}
            className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); fetchOrders(search, e.target.value); }}
            className="pl-9 pr-4 py-3 bg-white rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-200 appearance-none"
          >
            <option value="">Todos os status</option>
            {Object.entries(STATUS_MAP).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => fetchOrders(search)}
          className="px-5 py-3 bg-purple-500 text-white rounded-2xl font-medium hover:bg-purple-600 transition"
        >
          Buscar
        </button>
      </div>

      {/* Lista */}
      <div className="max-w-6xl mx-auto space-y-4">
        {loading && (
          <div className="text-center text-gray-400 py-16">Carregando...</div>
        )}
        {!loading && orders.length === 0 && (
          <div className="text-center text-gray-400 py-16">Nenhum pedido encontrado.</div>
        )}

        {orders.map((order) => {
          const status = STATUS_MAP[order.paymentStatus] ?? { label: order.paymentStatus, color: "bg-gray-100 text-gray-500" };
          return (
            <div key={order.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <div className="flex flex-wrap gap-3 items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                      {BILLING_MAP[order.billingType] ?? order.billingType}
                    </span>
                    <span className="text-xs text-purple-400 bg-purple-50 px-2 py-1 rounded-full">
                      {order.scoops} scoop{order.scoops > 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300">
                    {new Date(order.createdAt).toLocaleString("pt-BR")} ·{" "}
                    <code className="text-xs">{order.paymentId}</code>
                  </p>
                </div>
                <span className="text-2xl font-bold text-purple-900">
                  R$ {order.value.toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cliente */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Cliente</p>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <User className="w-4 h-4 text-purple-300 shrink-0" />
                    <span>{order.nome}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Mail className="w-4 h-4 text-purple-300 shrink-0" />
                    <a href={`mailto:${order.email}`} className="hover:text-purple-600 transition">{order.email}</a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Phone className="w-4 h-4 text-purple-300 shrink-0" />
                    <a
                      href={`https://wa.me/55${order.telefone.replace(/\D/g, "")}`}
                      target="_blank" rel="noopener noreferrer"
                      className="hover:text-green-600 transition"
                    >
                      {order.telefone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
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
                    <div className="text-sm text-gray-500 bg-yellow-50 rounded-xl px-3 py-2 border border-yellow-100">
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
