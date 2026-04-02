"use client";

import { useState } from 'react';
import { Minus, Plus, User, CreditCard, Mail, ArrowLeft, HelpCircle, Phone } from 'lucide-react';
import Image from 'next/image';
import WhatsAppButton from '../components/WhatsAppButton';
import Link from 'next/link';
import { SiGooglestreetview } from "react-icons/si";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { IoIosAddCircle } from "react-icons/io";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FaCity } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { GiTalk } from "react-icons/gi";

export default function page() {
  const [step, setStep] = useState(1);
  const [scoops, setScoops] = useState(1);
  const pricePerScoop = 75;

  const total = scoops * pricePerScoop;

  // Dentro do seu CheckoutPage
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    cep: '',
    
  });

  // Função para atualizar os campos dinamicamente
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      // Apenas avança para o formulário de dados
      setStep(2);
    } else if (step === 2) {
      // Aqui é onde a "mágica" acontece: validação e envio
      finalizarPedido();
    }
  };

  const finalizarPedido = () => {
    // Validação básica antes de prosseguir
    if (!formData.nome || !formData.cpf || !formData.email || !formData.rua || !formData.numero || !formData.bairro || !formData.cidade || !formData.cep) {
      alert("Por favor, preencha todos os campos antes de prosseguir.");
      return;
    }

    // Aqui você integraria com Stripe, Mercado Pago ou apenas um console.log por enquanto
    console.log("Dados do Cliente:", formData);
    console.log("Quantidade de Scoops:", scoops);
    console.log("Total a Pagar:", total);

    // Opcional: Avançar para um passo 3 de "Sucesso" ou abrir o checkout
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-[#FDF8FF] font-sans text-gray-800 p-4 md:p-8">
      {/* Header Navigation */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <Link href="/" className="flex items-center text-purple-600 font-medium hover:opacity-70 transition">
          <button className="flex items-center text-purple-600 font-medium hover:opacity-70 transition">
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </button>
        </Link>
        <div className="flex items-center gap-2 rounded-full flex items-center justify-center">

          <Image src="/img/logo.png" alt="Logo" width={150} height={150} loading="eager" />

          <span className="font-bold text-purple-900">Emily MiniSonhos</span>
        </div>
        <button className="flex items-center text-emerald-500 font-medium hover:opacity-70">
          <HelpCircle className="w-4 h-4 mr-1" /> Ajuda
        </button>
      </header>

      <main className="max-w-6xl mx-auto">
        {/* Stepper Visual */}
        <div className="flex justify-center items-center mb-12 gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-purple-400 text-white' : 'bg-gray-200'}`}>1</div>
          <div className="h-1 w-16 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full bg-purple-400 transition-all ${step > 1 ? 'w-full' : 'w-0'}`}></div>
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-purple-400 text-white' : 'bg-gray-200'}`}>2</div>
          <div className="h-1 w-16 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full bg-purple-400 transition-all ${step > 2 ? 'w-full' : 'w-0'}`}></div>
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 3 ? 'bg-purple-400 text-white' : 'bg-gray-200'}`}>3</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Forms */}
          <div className="lg:col-span-2">
            {step === 1 ? (
              <StepScoops scoops={scoops} setScoops={setScoops} price={total} />
            ) : (
              <StepUserData formData={formData} onChange={handleInputChange} />
            )}
          </div>

          {/* Right Column: Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-xl sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xl">✨</span>
                <h2 className="text-xl font-semibold">Seu pedido surpresa</h2>
              </div>

              <div className="flex justify-between items-center mb-8 border-b border-white/20 pb-4">
                <span>{scoops} scoop{scoops > 1 ? 's' : ''} surpresa</span>
                <span className="font-medium">R$ {total}</span>
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="text-lg">Total</span>
                <span className="text-4xl font-bold text-white">R$ {total}</span>
              </div>

              <button
                onClick={handleNextStep}
                className="w-full bg-white text-purple-600 py-4 rounded-2xl font-bold text-lg hover:bg-purple-50 transition-colors shadow-lg"
              >
                {step === 1 ? 'Continuar' : 'Finalizar Pedido'}
              </button>

              <p className="text-center text-xs mt-4 opacity-80">
                🎲 As surpresas são 100% mistério!
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}

// --- Sub-componentes ---

function StepScoops({ scoops, setScoops, price }: any) {
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
              <p className="text-purple-300 font-medium">scoop</p>
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

function StepUserData({ formData, onChange }: { formData: any, onChange: any }) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h1 className="text-4xl font-bold text-purple-900 mb-2">Seus dados</h1>
      <p className="text-purple-500 mb-8">Complete seus dados para receber sua surpresa</p>

      <div className="bg-white rounded-3xl p-10 shadow-sm border border-purple-50 space-y-6">
        <h3 className="text-purple-900 w-full border-t border-purple-200 font-semibold mb-4">Dados pessoais</h3>

        <div className="space-y-4">
          {/* Campo Nome */}
          <div>
            <label className="block text-purple-800 text-sm font-medium mb-2">Nome completo *</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 w-5 h-5" />
              <input
                type="text"
                name="nome" // O 'name' deve ser igual à chave no useState
                value={formData.nome}
                onChange={onChange}
                placeholder="Seu nome completo"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
              />
            </div>
          </div>

          {/* Campo CPF */}
          <div>
            <label className="block text-purple-800 text-sm font-medium mb-2">CPF *</label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 w-5 h-5" />
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={onChange}
                placeholder="000.000.000-00"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
              />
            </div>
          </div>

          {/* Campo E-mail */}
          <div>
            <label className="block text-purple-800 text-sm font-medium mb-2">E-mail *</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                placeholder="seu@email.com"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
              />
            </div>
          </div>
          {/* Campo Telefone */}
          <div>
            <label className="block text-purple-800 text-sm font-medium mb-2">Telefone *</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 w-5 h-5" />
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={onChange}
                placeholder="(00) 00000-0000"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
              />
            </div>
          </div>

          <h3 className="text-purple-900 w-full border-t border-purple-200 font-semibold mb-4">Endereco de entrega</h3>

          {/* Campo Rua */}
          <div>
            <label className="block text-purple-800 text-sm font-medium mb-2">Rua *</label>
            <div className="relative">
              <SiGooglestreetview className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 w-5 h-5" />
              <input
                type="text"
                name="rua"
                value={formData.rua}
                onChange={onChange}
                placeholder="Nome da rua"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
              />
            </div>
          </div>

          {/* Campo Numero */}
          <div>
            <label className="block text-purple-800 text-sm font-medium mb-2">Numero *</label>
            <div className="relative">
              <AiOutlineFieldNumber className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 w-5 h-5" />
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={onChange}
                placeholder="Numero da casa"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
              />
            </div>
          </div>


          <div>
            <label className="block text-purple-800 text-sm font-medium mb-2">Complemento</label>
            <div className="relative">
              <IoIosAddCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 w-5 h-5" />
              <input
                type="text"
                name="complemento"
                value={formData.complemento}
                onChange={onChange}
                placeholder="Complemento"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
              />
            </div>
          </div>


          <div>
            <label className="block text-purple-800 text-sm font-medium mb-2">Bairro *</label>
            <div className="relative">
              <FaMapMarkedAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 w-5 h-5" />
              <input
                type="text"
                name="bairro"
                value={formData.bairro}
                onChange={onChange}
                placeholder="Nome do bairro"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
              />
            </div>
          </div>


          <div>
            <label className="block text-purple-800 text-sm font-medium mb-2">Cidade *</label>
            <div className="relative">
              <FaCity className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 w-5 h-5" />
              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={onChange}
                placeholder="Nome da cidade"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-purple-800 text-sm font-medium mb-2">Cep *</label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 w-5 h-5" />
              <input
                type="text"
                name="cep"
                value={formData.cep}
                onChange={onChange}
                placeholder="CEP"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-purple-800 text-sm font-medium mb-2">observacoes *</label>
            <div className="relative">
              <GiTalk className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 w-5 h-5" />
              <textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={onChange}
                placeholder="Observações adicionais"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
              />
            </div>
          </div>

        </div>
      </div>
    </div >
  );
}
