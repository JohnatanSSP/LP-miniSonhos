"use client";

import { useState } from "react";
import {
  Minus,
  Plus,
  User,
  CreditCard,
  Mail,
  ArrowLeft,
  HelpCircle,
  Phone,
  CheckCircle,
  Loader2,
  Copy,
  ExternalLink,
  QrCode,
  FileText,
} from "lucide-react";
import Image from "next/image";
import WhatsAppButton from "../components/WhatsAppButton";
import Link from "next/link";
import { SiGooglestreetview } from "react-icons/si";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { IoIosAddCircle } from "react-icons/io";
import { FaMapMarkedAlt, FaCity, FaMapMarkerAlt } from "react-icons/fa";
import { GiTalk } from "react-icons/gi";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type BillingType = "PIX" | "BOLETO" | "CREDIT_CARD";

interface FormData {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  observacoes: string;
}

interface PaymentResult {
  paymentId: string;
  billingType: BillingType;
  invoiceUrl?: string;
  bankSlipUrl?: string;
  pixQrCode?: string;
  pixPayload?: string;
  value: number;
}

const PRICE_PER_SCOOP = 75;

// ─── Página principal ─────────────────────────────────────────────────────────

export default function OrderPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [scoops, setScoops] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    observacoes: "",
  });
  const [billingType, setBillingType] = useState<BillingType>("PIX");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [copied, setCopied] = useState(false);

  const total = scoops * PRICE_PER_SCOOP;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validarStep2 = () => {
    const required: (keyof FormData)[] = [
      "nome", "cpf", "email", "telefone",
      "rua", "numero", "bairro", "cidade", "estado", "cep",
    ];
    for (const field of required) {
      if (!formData[field]?.trim()) {
        setError("Por favor, preencha todos os campos obrigatórios (*).");
        return false;
      }
    }
    if (!/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(formData.cpf.replace(/\s/g, ""))) {
      setError("CPF inválido. Use o formato 000.000.000-00");
      return false;
    }
    setError(null);
    return true;
  };

  const handleNextStep = () => {
    if (step === 1) setStep(2);
    else if (step === 2) {
      if (validarStep2()) setStep(3);
    }
  };

  const finalizarPedido = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Criar ou recuperar cliente no Asaas
      const customerRes = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.nome,
          email: formData.email,
          cpfCnpj: formData.cpf,
          mobilePhone: formData.telefone,
          postalCode: formData.cep,
        }),
      });

      const customerData = await customerRes.json();
      if (!customerRes.ok) {
        throw new Error(customerData.error ?? "Erro ao cadastrar cliente.");
      }

      // 2. Criar cobrança no Asaas
      const paymentRes = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customerData.id,
          billingType,
          value: total,
          description: `Mini Sonhos – ${scoops} scoop${scoops > 1 ? "s" : ""} surpresa`,
          externalReference: `order-${Date.now()}`,
        }),
      });

      const paymentData = await paymentRes.json();
      if (!paymentRes.ok) {
        throw new Error(paymentData.error ?? "Erro ao criar cobrança.");
      }

      const result: PaymentResult = {
        paymentId: paymentData.id,
        billingType,
        invoiceUrl: paymentData.invoiceUrl,
        bankSlipUrl: paymentData.bankSlipUrl,
        value: total,
      };

      // 3. Se PIX, buscar QR Code
      if (billingType === "PIX") {
        const pixRes = await fetch(`/api/payments/${paymentData.id}/pix`);
        if (pixRes.ok) {
          const pixData = await pixRes.json();
          result.pixQrCode = pixData.encodedImage;
          result.pixPayload = pixData.payload;
        }
      }

      setPaymentResult(result);
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const copiarPix = async () => {
    if (!paymentResult?.pixPayload) return;
    await navigator.clipboard.writeText(paymentResult.pixPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const stepLabels = ["Seu pedido", "Seus dados", "Pagamento", "Confirmação"];

  return (
    <div className="min-h-screen bg-[#FDF8FF] font-sans text-gray-800 p-4 md:p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <Link
          href="/"
          className="flex items-center text-purple-600 font-medium hover:opacity-70 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Link>
        <div className="flex items-center gap-2">
          <Image src="/img/logo.png" alt="Logo" width={100} height={100} loading="eager" />
          <span className="font-bold text-purple-900">Emily MiniSonhos</span>
        </div>
        <Link
          href="/HowItWorks"
          className="flex items-center text-emerald-500 font-medium hover:opacity-70 transition"
        >
          <HelpCircle className="w-4 h-4 mr-1" /> Ajuda
        </Link>
      </header>

      {/* Stepper */}
      <div className="flex justify-center items-center mb-3 gap-2">
        {[1, 2, 3, 4].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= s ? "bg-purple-500 text-white shadow" : "bg-gray-200 text-gray-400"
              }`}
            >
              {step > s ? "✓" : s}
            </div>
            {i < 3 && (
              <div className="h-1 w-10 md:w-16 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-purple-400 transition-all duration-500 ${
                    step > s ? "w-full" : "w-0"
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-purple-400 mb-10 font-medium">
        {stepLabels[step - 1]}
      </p>

      <main className="max-w-6xl mx-auto">
        {step < 4 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Conteúdo do step */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <StepScoops scoops={scoops} setScoops={setScoops} price={total} />
              )}
              {step === 2 && (
                <StepUserData formData={formData} onChange={handleInputChange} />
              )}
              {step === 3 && (
                <StepPayment
                  billingType={billingType}
                  setBillingType={setBillingType}
                  loading={loading}
                  error={error}
                  onConfirm={finalizarPedido}
                  total={total}
                />
              )}
              {error && step !== 3 && (
                <p className="mt-4 text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}
            </div>

            {/* Resumo lateral */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-xl sticky top-8">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xl">✨</span>
                  <h2 className="text-xl font-semibold">Seu pedido surpresa</h2>
                </div>
                <div className="flex justify-between items-center mb-6 border-b border-white/20 pb-4">
                  <span>
                    {scoops} scoop{scoops > 1 ? "s" : ""} surpresa
                  </span>
                  <span className="font-medium">R$ {total}</span>
                </div>
                <div className="flex justify-between items-end mb-8">
                  <span className="text-lg">Total</span>
                  <span className="text-4xl font-bold">R$ {total}</span>
                </div>

                {step < 3 && (
                  <button
                    onClick={handleNextStep}
                    className="w-full bg-white text-purple-600 py-4 rounded-2xl font-bold text-lg hover:bg-purple-50 transition-colors shadow-lg"
                  >
                    {step === 1 ? "Continuar →" : "Ir para Pagamento →"}
                  </button>
                )}

                <p className="text-center text-xs mt-4 opacity-80">
                  🎲 As surpresas são 100% mistério!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <StepConfirmacao
            result={paymentResult!}
            copied={copied}
            onCopiar={copiarPix}
          />
        )}
      </main>

      <WhatsAppButton />
    </div>
  );
}

// ─── Step 1: Scoops ───────────────────────────────────────────────────────────

function StepScoops({
  scoops,
  setScoops,
  price,
}: {
  scoops: number;
  setScoops: (n: number) => void;
  price: number;
}) {
  return (
    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
      <h1 className="text-4xl font-bold text-purple-900 mb-2">Monte seu pedido</h1>
      <p className="text-purple-500 mb-8">Escolha quantos scoops surpresa você quer!</p>

      <div className="bg-white rounded-3xl p-10 shadow-sm border border-purple-50">
        <h3 className="text-purple-900 font-semibold mb-8">Quantos scoops surpresa?</h3>
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setScoops(Math.max(1, scoops - 1))}
              className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:border-purple-300 hover:text-purple-500 transition"
            >
              <Minus size={24} />
            </button>
            <div className="text-center">
              <span className="text-7xl font-bold text-purple-400">{scoops}</span>
              <p className="text-purple-300 font-medium">scoop{scoops > 1 ? "s" : ""}</p>
            </div>
            <button
              onClick={() => setScoops(scoops + 1)}
              className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:border-purple-300 hover:text-purple-500 transition"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-50 flex justify-between items-center">
          <span className="text-purple-400 font-medium">Subtotal</span>
          <span className="text-2xl font-bold text-purple-900 font-mono">R$ {price}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: Dados pessoais ───────────────────────────────────────────────────

function StepUserData({
  formData,
  onChange,
}: {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) {
  function Field({
    label,
    name,
    placeholder,
    icon,
    type = "text",
    required = true,
  }: {
    label: string;
    name: keyof FormData;
    placeholder: string;
    icon: React.ReactNode;
    type?: string;
    required?: boolean;
  }) {
    return (
      <div>
        <label className="block text-purple-800 text-sm font-medium mb-2">
          {label} {required && <span className="text-pink-400">*</span>}
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 w-5 h-5">
            {icon}
          </span>
          <input
            type={type}
            name={name}
            value={(formData as unknown as Record<string, string>)[name]}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h1 className="text-4xl font-bold text-purple-900 mb-2">Seus dados</h1>
      <p className="text-purple-500 mb-8">Complete seus dados para receber sua surpresa</p>

      <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-purple-50 space-y-5">
        <h3 className="text-purple-900 font-semibold border-b border-purple-100 pb-3">
          Dados pessoais
        </h3>
        <Field label="Nome completo" name="nome" placeholder="Seu nome completo" icon={<User />} />
        <Field label="CPF" name="cpf" placeholder="000.000.000-00" icon={<CreditCard />} />
        <Field label="E-mail" name="email" placeholder="seu@email.com" icon={<Mail />} type="email" />
        <Field label="Telefone / WhatsApp" name="telefone" placeholder="(00) 00000-0000" icon={<Phone />} type="tel" />

        <h3 className="text-purple-900 font-semibold border-b border-purple-100 pb-3 pt-2">
          Endereço de entrega
        </h3>
        <Field label="Rua" name="rua" placeholder="Nome da rua" icon={<SiGooglestreetview />} />
        <Field label="Número" name="numero" placeholder="Nº da casa/apt" icon={<AiOutlineFieldNumber />} />
        <Field label="Complemento" name="complemento" placeholder="Apto, bloco..." icon={<IoIosAddCircle />} required={false} />
        <Field label="Bairro" name="bairro" placeholder="Nome do bairro" icon={<FaMapMarkedAlt />} />
        <Field label="Cidade" name="cidade" placeholder="Nome da cidade" icon={<FaCity />} />
        <Field label="Estado" name="estado" placeholder="SP, RJ, MG..." icon={<FaCity />} />
        <Field label="CEP" name="cep" placeholder="00000-000" icon={<FaMapMarkerAlt />} />

        <div>
          <label className="block text-purple-800 text-sm font-medium mb-2">Observações</label>
          <div className="relative">
            <GiTalk className="absolute left-4 top-4 text-pink-300 w-5 h-5" />
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={onChange}
              placeholder="Alguma observação especial para o pedido?"
              rows={3}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200 transition resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Forma de pagamento ───────────────────────────────────────────────

function StepPayment({
  billingType,
  setBillingType,
  loading,
  error,
  onConfirm,
  total,
}: {
  billingType: BillingType;
  setBillingType: (t: BillingType) => void;
  loading: boolean;
  error: string | null;
  onConfirm: () => void;
  total: number;
}) {
  const options: { type: BillingType; label: string; desc: string; icon: React.ReactNode }[] = [
    { type: "PIX", label: "PIX", desc: "Instantâneo, disponível 24h", icon: <QrCode className="w-6 h-6" /> },
    { type: "BOLETO", label: "Boleto Bancário", desc: "Vencimento em 3 dias úteis", icon: <FileText className="w-6 h-6" /> },
    { type: "CREDIT_CARD", label: "Cartão de Crédito", desc: "Página segura do Asaas", icon: <CreditCard className="w-6 h-6" /> },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h1 className="text-4xl font-bold text-purple-900 mb-2">Forma de pagamento</h1>
      <p className="text-purple-500 mb-8">Escolha como prefere pagar</p>

      <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-purple-50 space-y-4">
        {options.map((opt) => (
          <button
            key={opt.type}
            onClick={() => setBillingType(opt.type)}
            className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${
              billingType === opt.type
                ? "border-purple-400 bg-purple-50"
                : "border-gray-100 hover:border-purple-200"
            }`}
          >
            <span
              className={`p-3 rounded-xl ${
                billingType === opt.type
                  ? "bg-purple-400 text-white"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {opt.icon}
            </span>
            <div>
              <p className="font-bold text-purple-900">{opt.label}</p>
              <p className="text-sm text-gray-400">{opt.desc}</p>
            </div>
            <div className="ml-auto">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  billingType === opt.type ? "border-purple-400" : "border-gray-300"
                }`}
              >
                {billingType === opt.type && (
                  <div className="w-3 h-3 rounded-full bg-purple-400" />
                )}
              </div>
            </div>
          </button>
        ))}

        {error && (
          <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">{error}</p>
        )}

        <button
          onClick={onConfirm}
          disabled={loading}
          className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-5 rounded-2xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg disabled:opacity-60 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              Gerando cobrança...
            </>
          ) : (
            `Pagar R$ ${total},00 →`
          )}
        </button>

        <p className="text-center text-xs text-gray-400 mt-2">
          🔒 Pagamento seguro processado pelo Asaas · Regulado pelo Banco Central do Brasil
        </p>
      </div>
    </div>
  );
}

// ─── Step 4: Confirmação / instruções de pagamento ────────────────────────────

function StepConfirmacao({
  result,
  copied,
  onCopiar,
}: {
  result: PaymentResult;
  copied: boolean;
  onCopiar: () => void;
}) {
  return (
    <div className="max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-purple-50 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-purple-900 mb-2">Pedido criado! 🎉</h2>
        <p className="text-purple-400 mb-8">
          Complete o pagamento para confirmarmos sua surpresa.
        </p>

        {/* PIX */}
        {result.billingType === "PIX" && (
          <div className="space-y-5">
            {result.pixQrCode && (
              <div className="flex flex-col items-center gap-3">
                <p className="font-semibold text-purple-800">Escaneie o QR Code:</p>
                <img
                  src={`data:image/png;base64,${result.pixQrCode}`}
                  alt="QR Code PIX"
                  className="w-48 h-48 rounded-xl border border-purple-100 shadow mx-auto"
                />
              </div>
            )}
            {result.pixPayload && (
              <div>
                <p className="font-semibold text-purple-800 mb-2">Ou copie o código PIX:</p>
                <div className="bg-gray-50 rounded-2xl p-4 text-xs text-gray-500 break-all font-mono border border-gray-100 mb-3 text-left">
                  {result.pixPayload.substring(0, 80)}...
                </div>
                <button
                  onClick={onCopiar}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold transition-all ${
                    copied
                      ? "bg-green-100 text-green-700"
                      : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  }`}
                >
                  <Copy className="w-4 h-4" />
                  {copied ? "Copiado!" : "Copiar código PIX"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Boleto */}
        {result.billingType === "BOLETO" && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Seu boleto foi gerado! Você tem <strong>3 dias úteis</strong> para pagar.
            </p>
            {result.bankSlipUrl && (
              <a
                href={result.bankSlipUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-4 bg-orange-50 text-orange-700 rounded-2xl font-semibold hover:bg-orange-100 transition border border-orange-100"
              >
                <FileText className="w-5 h-5" />
                Baixar PDF do Boleto
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        )}

        {/* Cartão de crédito */}
        {result.billingType === "CREDIT_CARD" && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Clique abaixo para ir à página segura de pagamento do Asaas.
            </p>
            {result.invoiceUrl && (
              <a
                href={result.invoiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-4 bg-purple-500 text-white rounded-2xl font-semibold hover:bg-purple-600 transition shadow"
              >
                <CreditCard className="w-5 h-5" />
                Pagar com Cartão
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        )}

        {/* Link da fatura (todos os tipos, exceto CREDIT_CARD que já redireciona) */}
        {result.invoiceUrl && result.billingType !== "CREDIT_CARD" && (
          <a
            href={result.invoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 text-sm text-purple-400 hover:text-purple-600 transition"
          >
            Ver fatura online
            <ExternalLink className="w-3 h-3" />
          </a>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 space-y-1 text-sm text-gray-400">
          <p>
            Valor:{" "}
            <strong className="text-gray-700">R$ {result.value},00</strong>
          </p>
          <p>
            ID:{" "}
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
              {result.paymentId}
            </code>
          </p>
        </div>

        <Link
          href="/"
          className="mt-6 inline-block text-purple-400 hover:text-purple-600 text-sm transition"
        >
          ← Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}
