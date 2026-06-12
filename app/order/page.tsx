"use client";

import { useState, useEffect } from "react";
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
  pixExpiration?: string;
  value: number;
}

const PRICE_PER_SCOOP = 80;

// ─── Página principal ─────────────────────────────────────────────────────────

export default function OrderPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [scoops, setScoops] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    nome: "", cpf: "", email: "", telefone: "",
    rua: "", numero: "", complemento: "",
    bairro: "", cidade: "", estado: "", cep: "", observacoes: "",
  });
  const [billingType, setBillingType] = useState<BillingType>("PIX");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [copied, setCopied] = useState(false);

  const total = scoops * PRICE_PER_SCOOP;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    else if (step === 2) { if (validarStep2()) setStep(3); }
  };

  const finalizarPedido = async () => {
    setLoading(true);
    setError(null);
    try {
      const customerRes = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.nome, email: formData.email,
          cpfCnpj: formData.cpf, mobilePhone: formData.telefone, postalCode: formData.cep,
        }),
      });
      const customerData = await customerRes.json();
      if (!customerRes.ok) throw new Error(customerData.error ?? "Erro ao cadastrar cliente.");

      const paymentRes = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customerData.id, billingType, value: total,
          description: `Mini Sonhos – ${scoops} scoop${scoops > 1 ? "s" : ""} surpresa`,
          externalReference: `order-${Date.now()}`,
        }),
      });
      const paymentData = await paymentRes.json();
      if (!paymentRes.ok) throw new Error(paymentData.error ?? "Erro ao criar cobrança.");

      const result: PaymentResult = {
        paymentId: paymentData.id, billingType,
        invoiceUrl: paymentData.invoiceUrl,
        bankSlipUrl: paymentData.bankSlipUrl,
        value: total,
      };

      if (billingType === "PIX") {
        const pixRes = await fetch(`/api/payments/${paymentData.id}/pix`);
        if (pixRes.ok) {
          const pixData = await pixRes.json();
          result.pixQrCode = pixData.encodedImage;
          result.pixPayload = pixData.payload;
          result.pixExpiration = pixData.expirationDate;
        }
      }

      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: paymentData.id, billingType, value: total, scoops, ...formData }),
      });

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
    <div className="min-h-screen bg-[#FDF8FF] font-sans text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-purple-100 px-4 py-3 mb-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-1 text-purple-600 font-medium hover:opacity-70 transition text-sm">
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Voltar</span>
          </Link>
          <div className="flex items-center gap-2">
            <Image src="/img/logo.png" alt="Logo" width={100} height={100} style={{ width: "auto", height: "auto" }} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-contain" loading="eager" />
            <span className="font-bold text-purple-900 text-sm sm:text-base">Emily MiniSonhos</span>
          </div>
          <Link href="/HowItWorks" className="flex items-center gap-1 text-emerald-500 font-medium hover:opacity-70 transition text-sm">
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Ajuda</span>
          </Link>
        </div>
      </header>

      {/* Stepper */}
      <div className="flex justify-center items-center mb-3 gap-2 px-4">
        {[1, 2, 3, 4].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? "bg-purple-500 text-white shadow" : "bg-gray-200 text-gray-400"}`}>
              {step > s ? "✓" : s}
            </div>
            {i < 3 && (
              <div className="h-1 w-6 sm:w-10 md:w-16 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full bg-purple-400 transition-all duration-500 ${step > s ? "w-full" : "w-0"}`} />
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-purple-400 mb-8 font-medium">{stepLabels[step - 1]}</p>

      <main className="max-w-6xl mx-auto px-4 md:px-8">
        {step < 4 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {step === 1 && <StepScoops scoops={scoops} setScoops={setScoops} price={total} />}
              {step === 2 && <StepUserData formData={formData} onChange={handleInputChange} />}
              {step === 3 && (
                <StepPayment
                  billingType={billingType} setBillingType={setBillingType}
                  loading={loading} error={error} onConfirm={finalizarPedido} total={total}
                />
              )}
              {error && step !== 3 && (
                <p className="mt-4 text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">{error}</p>
              )}
            </div>

            {/* Resumo lateral */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-xl sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xl">✨</span>
                  <h2 className="text-xl font-semibold">Seu pedido surpresa</h2>
                </div>
                <div className="flex justify-between items-center mb-6 border-b border-white/20 pb-4">
                  <span>{scoops} scoop{scoops > 1 ? "s" : ""} surpresa</span>
                  <span className="font-medium">R$ {total}</span>
                </div>
                <div className="flex justify-between items-end mb-6 sm:mb-8">
                  <span className="text-base sm:text-lg">Total</span>
                  <span className="text-2xl sm:text-4xl font-bold">R$ {total}</span>
                </div>
                {step < 3 && (
                  <button onClick={handleNextStep} className="w-full bg-white text-purple-600 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg hover:bg-purple-50 transition-colors shadow-lg">
                    {step === 1 ? "Continuar →" : "Ir para Pagamento →"}
                  </button>
                )}
                <p className="text-center text-xs mt-4 opacity-80">🎲 As surpresas são 100% mistério!</p>
              </div>
            </div>
          </div>
        ) : (
          <StepConfirmacao result={paymentResult!} copied={copied} onCopiar={copiarPix} />
        )}
      </main>
      <WhatsAppButton />
    </div>
  );
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────

function StepScoops({ scoops, setScoops, price }: { scoops: number; setScoops: (n: number) => void; price: number }) {
  return (
    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
      <h1 className="text-3xl sm:text-4xl font-bold text-purple-900 mb-2">Monte seu pedido</h1>
      <p className="text-purple-500 mb-8">Escolha quantos scoops surpresa você quer!</p>
      <div className="bg-white rounded-3xl p-10 shadow-sm border border-purple-50">
        <h3 className="text-purple-900 font-semibold mb-8">Quantos scoops surpresa?</h3>
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-8">
            <button onClick={() => setScoops(Math.max(1, scoops - 1))} className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:border-purple-300 hover:text-purple-500 transition">
              <Minus size={24} />
            </button>
            <div className="text-center">
              <span className="text-5xl sm:text-7xl font-bold text-purple-400">{scoops}</span>
              <p className="text-purple-300 font-medium">scoop{scoops > 1 ? "s" : ""}</p>
            </div>
            <button onClick={() => setScoops(scoops + 1)} className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:border-purple-300 hover:text-purple-500 transition">
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

// ─── FormField (fora do StepUserData para evitar perda de foco) ───────────────

function FormField({ label, name, placeholder, icon, type = "text", required = true, value, onChange }: {
  label: string; name: keyof FormData; placeholder: string; icon: React.ReactNode;
  type?: string; required?: boolean; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block text-purple-800 text-sm font-medium mb-2">
        {label} {required && <span className="text-pink-400">*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 w-5 h-5">{icon}</span>
        <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200 transition" />
      </div>
    </div>
  );
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────

function StepUserData({ formData, onChange }: {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h1 className="text-3xl sm:text-4xl font-bold text-purple-900 mb-2">Seus dados</h1>
      <p className="text-purple-500 mb-8">Complete seus dados para receber sua surpresa</p>
      <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-purple-50 space-y-5">
        <h3 className="text-purple-900 font-semibold border-b border-purple-100 pb-3">Dados pessoais</h3>
        <FormField label="Nome completo" name="nome" placeholder="Seu nome completo" icon={<User />} value={formData.nome} onChange={onChange} />
        <FormField label="CPF" name="cpf" placeholder="000.000.000-00" icon={<CreditCard />} value={formData.cpf} onChange={onChange} />
        <FormField label="E-mail" name="email" placeholder="seu@email.com" icon={<Mail />} type="email" value={formData.email} onChange={onChange} />
        <FormField label="Telefone / WhatsApp" name="telefone" placeholder="(00) 00000-0000" icon={<Phone />} type="tel" value={formData.telefone} onChange={onChange} />
        <h3 className="text-purple-900 font-semibold border-b border-purple-100 pb-3 pt-2">Endereço de entrega</h3>
        <FormField label="Rua" name="rua" placeholder="Nome da rua" icon={<SiGooglestreetview />} value={formData.rua} onChange={onChange} />
        <FormField label="Número" name="numero" placeholder="Nº da casa/apt" icon={<AiOutlineFieldNumber />} value={formData.numero} onChange={onChange} />
        <FormField label="Complemento" name="complemento" placeholder="Apto, bloco..." icon={<IoIosAddCircle />} required={false} value={formData.complemento} onChange={onChange} />
        <FormField label="Bairro" name="bairro" placeholder="Nome do bairro" icon={<FaMapMarkedAlt />} value={formData.bairro} onChange={onChange} />
        <FormField label="Cidade" name="cidade" placeholder="Nome da cidade" icon={<FaCity />} value={formData.cidade} onChange={onChange} />
        <FormField label="Estado" name="estado" placeholder="SP, RJ, MG..." icon={<FaCity />} value={formData.estado} onChange={onChange} />
        <FormField label="CEP" name="cep" placeholder="00000-000" icon={<FaMapMarkerAlt />} value={formData.cep} onChange={onChange} />
        <div>
          <label className="block text-purple-800 text-sm font-medium mb-2">Observações</label>
          <div className="relative">
            <GiTalk className="absolute left-4 top-4 text-pink-300 w-5 h-5" />
            <textarea name="observacoes" value={formData.observacoes} onChange={onChange} placeholder="Alguma observação especial?" rows={3}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200 transition resize-none" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────

function StepPayment({ billingType, setBillingType, loading, error, onConfirm, total }: {
  billingType: BillingType; setBillingType: (t: BillingType) => void;
  loading: boolean; error: string | null; onConfirm: () => void; total: number;
}) {
  const options: { type: BillingType; label: string; desc: string; icon: React.ReactNode }[] = [
    { type: "PIX", label: "PIX", desc: "Instantâneo, QR Code na tela", icon: <QrCode className="w-6 h-6" /> },
    { type: "BOLETO", label: "Boleto Bancário", desc: "Vencimento em 3 dias úteis", icon: <FileText className="w-6 h-6" /> },
    { type: "CREDIT_CARD", label: "Cartão de Crédito", desc: "Página segura do Asaas", icon: <CreditCard className="w-6 h-6" /> },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h1 className="text-3xl sm:text-4xl font-bold text-purple-900 mb-2">Forma de pagamento</h1>
      <p className="text-purple-500 mb-8">Escolha como prefere pagar</p>
      <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-purple-50 space-y-4">
        {options.map((opt) => (
          <button key={opt.type} onClick={() => setBillingType(opt.type)}
            className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${billingType === opt.type ? "border-purple-400 bg-purple-50" : "border-gray-100 hover:border-purple-200"}`}>
            <span className={`p-3 rounded-xl ${billingType === opt.type ? "bg-purple-400 text-white" : "bg-gray-100 text-gray-400"}`}>{opt.icon}</span>
            <div>
              <p className="font-bold text-purple-900">{opt.label}</p>
              <p className="text-sm text-gray-400">{opt.desc}</p>
            </div>
            <div className="ml-auto">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${billingType === opt.type ? "border-purple-400" : "border-gray-300"}`}>
                {billingType === opt.type && <div className="w-3 h-3 rounded-full bg-purple-400" />}
              </div>
            </div>
          </button>
        ))}
        {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">{error}</p>}
        <button onClick={onConfirm} disabled={loading}
          className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-5 rounded-2xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg disabled:opacity-60 flex items-center justify-center gap-3">
          {loading ? (<><Loader2 className="animate-spin w-5 h-5" />Gerando cobrança...</>) : (<>Pagar <span className="font-bold">R$ {total},00</span> →</>)}
        </button>
        <p className="text-center text-xs text-gray-400 mt-2">
          🔒 Pagamento seguro processado pelo Asaas · Regulado pelo Banco Central do Brasil
        </p>
      </div>
    </div>
  );
}

// ─── Step 4: Confirmação ──────────────────────────────────────────────────────

function StepConfirmacao({ result, copied, onCopiar }: {
  result: PaymentResult; copied: boolean; onCopiar: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    if (result.billingType !== "PIX" || !result.pixExpiration) return;
    const calc = () => {
      const diff = new Date(result.pixExpiration!).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft("Expirado"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [result]);

  return (
    <div className="max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-500 px-2">
      <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden">

        {/* Topo verde */}
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-6 text-center text-white">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-1">Pedido criado! 🎉</h2>
          <p className="text-white/90 text-sm">Valor: <strong>R$ {result.value},00</strong></p>
        </div>

        <div className="p-6 space-y-6">

          {/* PIX */}
          {result.billingType === "PIX" && (
            <>
              <div className="text-center">
                <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm font-semibold px-4 py-2 rounded-full border border-green-200">
                  <QrCode className="w-4 h-4" />
                  Pague com PIX — aprovação instantânea
                </span>
              </div>

              {result.pixQrCode && (
                <div className="flex flex-col items-center gap-3">
                  <div className="border-4 border-purple-100 rounded-2xl p-2 shadow-sm">
                    <img src={`data:image/png;base64,${result.pixQrCode}`} alt="QR Code PIX"
                      className="w-52 h-52 sm:w-64 sm:h-64 rounded-xl" />
                  </div>
                  {timeLeft && timeLeft !== "Expirado" && (
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      ⏱ Expira em <span className="font-mono font-semibold text-orange-500">{timeLeft}</span>
                    </p>
                  )}
                  {timeLeft === "Expirado" && (
                    <p className="text-xs text-red-500 font-semibold">QR Code expirado — recarregue a página</p>
                  )}
                </div>
              )}

              {result.pixPayload && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-600 text-center">Ou use o código copia e cola:</p>
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3">
                    <p className="text-xs text-gray-500 font-mono break-all leading-relaxed line-clamp-3">{result.pixPayload}</p>
                  </div>
                  <button onClick={onCopiar}
                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all ${copied ? "bg-green-100 text-green-700 border-2 border-green-300" : "bg-purple-500 text-white hover:bg-purple-600 shadow-md hover:shadow-lg"}`}>
                    {copied ? (<><CheckCircle className="w-5 h-5" />Código copiado!</>) : (<><Copy className="w-5 h-5" />Copiar código PIX</>)}
                  </button>
                </div>
              )}

              <div className="bg-purple-50 rounded-2xl p-4 space-y-2">
                <p className="text-xs font-semibold text-purple-700 mb-2">Como pagar:</p>
                {["Abra o app do seu banco", "Escolha pagar com PIX", "Escaneie o QR Code ou cole o código", "Confirme — aprovação é instantânea!"].map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-purple-600">
                    <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">{i + 1}</span>
                    {s}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Boleto */}
          {result.billingType === "BOLETO" && (
            <>
              <div className="text-center">
                <span className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 text-sm font-semibold px-4 py-2 rounded-full border border-orange-200">
                  <FileText className="w-4 h-4" />
                  Boleto gerado — vence em 3 dias úteis
                </span>
              </div>
              <div className="bg-orange-50 rounded-2xl p-5 space-y-4 border border-orange-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-orange-800 text-sm">Boleto bancário</p>
                    <p className="text-xs text-orange-600">R$ {result.value},00 · Vence em 3 dias úteis</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  {result.bankSlipUrl && (
                    <a href={result.bankSlipUrl} target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-orange-500 text-white rounded-2xl font-semibold hover:bg-orange-600 transition text-sm shadow">
                      <FileText className="w-4 h-4" />Baixar PDF
                    </a>
                  )}
                  {result.invoiceUrl && (
                    <a href={result.invoiceUrl} target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-orange-600 border-2 border-orange-200 rounded-2xl font-semibold hover:bg-orange-50 transition text-sm">
                      <ExternalLink className="w-4 h-4" />Ver fatura
                    </a>
                  )}
                </div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 space-y-1">
                <p className="text-xs font-semibold text-blue-700 mb-2">⚠️ Atenção:</p>
                <p className="text-xs text-blue-600">• Boletos compensam em até 3 dias úteis após o pagamento</p>
                <p className="text-xs text-blue-600">• Seu pedido só é confirmado após a compensação</p>
                <p className="text-xs text-blue-600">• Prefere aprovação na hora? Use o PIX!</p>
              </div>
            </>
          )}

          {/* Cartão */}
          {result.billingType === "CREDIT_CARD" && (
            <>
              <div className="text-center">
                <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full border border-blue-200">
                  <CreditCard className="w-4 h-4" />
                  Finalize o pagamento pelo cartão
                </span>
              </div>
              <div className="bg-blue-50 rounded-2xl p-5 text-center space-y-4 border border-blue-100">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                  <CreditCard className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-blue-800">R$ {result.value},00</p>
                  <p className="text-xs text-blue-600 mt-1">Clique abaixo para ir à página segura de pagamento</p>
                </div>
                {result.invoiceUrl && (
                  <a href={result.invoiceUrl} target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition shadow-md text-base">
                    <CreditCard className="w-5 h-5" />Pagar com cartão agora<ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs text-gray-500 text-center">🔒 Pagamento seguro pelo Asaas · Regulado pelo Banco Central</p>
              </div>
            </>
          )}

          {/* Rodapé */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              ID: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{result.paymentId.substring(0, 16)}...</code>
            </p>
            <Link href="/" className="text-xs text-purple-400 hover:text-purple-600 transition">← Início</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
