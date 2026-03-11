import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Gift, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';

import ScoopSelector from '../components/ScoopSelector';
import PreferenceSelector from '../components/PreferenceSelector';
import OrderSummary from '../components/OrderSummary';
import CustomerForm from '../components/CustomerForm';
import WhatsAppButton from '../components/WhatsAppButton';

const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698d0981b1748898520c7b9e/8d36882cc_file_000000004754720eaaf307c3bd0b76f4.png";
const WHATSAPP_LINK = "https://wa.me/qr/326K3JISIY4AF1";
const PRICE_PER_SCOOP = 75;

export default function Order() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [scoops, setScoops] = useState(1);
  const [preferenceNotes, setPreferenceNotes] = useState('');
  const [customerData, setCustomerData] = useState({});

  const calculateTotal = () => {
    return scoops * PRICE_PER_SCOOP;
  };

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    if (!customerData.customer_name || !customerData.customer_phone || !customerData.cpf || !customerData.email) {
      return;
    }

    setLoading(true);
    
    const fullAddress = `${customerData.street}, ${customerData.number}${customerData.complement ? ` - ${customerData.complement}` : ''}, ${customerData.neighborhood}, ${customerData.city} - ${customerData.state}, CEP: ${customerData.cep}`;
    
    const order = await base44.entities.Order.create({
      customer_name: customerData.customer_name,
      customer_phone: customerData.customer_phone,
      customer_address: fullAddress,
      cpf: customerData.cpf,
      email: customerData.email,
      street: customerData.street,
      number: customerData.number,
      complement: customerData.complement,
      neighborhood: customerData.neighborhood,
      city: customerData.city,
      state: customerData.state,
      cep: customerData.cep,
      scoops_quantity: scoops,
      preferences: preferenceNotes,
      special_notes: customerData.special_notes,
      total_price: calculateTotal(),
      status: 'pending',
    });

    navigate(createPageUrl('Confirmation') + `?orderId=${order.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 py-8 px-4">
      <WhatsAppButton />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" className="gap-2 text-purple-600 hover:text-purple-800">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <img src={LOGO_URL} alt="Emily MiniSonhos" className="w-10 h-10 object-contain rounded-full" />
            <span className="font-bold text-purple-800">Emily MiniSonhos</span>
          </div>
          <a 
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-green-600 hover:text-green-700 text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Ajuda</span>
          </a>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                step >= s 
                  ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white' 
                  : 'bg-white text-purple-400 border-2 border-purple-200'
              }`}>
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-16 md:w-24 h-1 rounded-full transition-all ${
                  step > s ? 'bg-gradient-to-r from-pink-400 to-purple-400' : 'bg-purple-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-6">
                <div className="text-center lg:text-left mb-8">
                  <h1 className="text-3xl font-bold text-purple-800 mb-2">Monte seu pedido</h1>
                  <p className="text-purple-600">Escolha quantos scoops surpresa você quer!</p>
                </div>
                <ScoopSelector quantity={scoops} setQuantity={setScoops} />
                <PreferenceSelector notes={preferenceNotes} setNotes={setPreferenceNotes} />
              </div>
              <div>
                <OrderSummary
                  scoops={scoops}
                  onContinue={handleContinue}
                  loading={false}
                  buttonText="Continuar"
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-6">
                <div className="text-center lg:text-left mb-8">
                  <h1 className="text-3xl font-bold text-purple-800 mb-2">Seus dados</h1>
                  <p className="text-purple-600">Complete seus dados para receber sua surpresa</p>
                </div>
                <CustomerForm data={customerData} setData={setCustomerData} />
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="gap-2 border-purple-200 text-purple-600"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar ao pedido
                </Button>
              </div>
              <div>
                <OrderSummary
                  scoops={scoops}
                  onContinue={handleContinue}
                  loading={false}
                  buttonText="Ir para pagamento"
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-6">
                <div className="text-center lg:text-left mb-8">
                  <h1 className="text-3xl font-bold text-purple-800 mb-2">Pagamento</h1>
                  <p className="text-purple-600">Finalize seu pedido</p>
                </div>
                
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-pink-100">
                  <h3 className="text-lg font-semibold text-purple-800 mb-4">Resumo do pedido</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-purple-600">{scoops} scoop{scoops > 1 ? 's' : ''} surpresa</span>
                      <span className="font-medium text-purple-800">R$ {calculateTotal()}</span>
                    </div>
                    <div className="border-t border-pink-100 pt-3 flex justify-between">
                      <span className="font-semibold text-purple-800">Total</span>
                      <span className="font-bold text-purple-800 text-xl">R$ {calculateTotal()}</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 mb-6">
                    <h4 className="font-semibold text-purple-800 mb-3">Formas de pagamento:</h4>
                    <ul className="text-purple-600 text-sm space-y-2">
                      <li>💳 PIX</li>
                      <li>💳 Transferência bancária</li>
                    </ul>
                    <p className="text-purple-500 text-xs mt-4">
                      Após confirmar o pedido, entraremos em contato pelo WhatsApp com os dados para pagamento.
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                    <p className="text-yellow-800 text-sm">
                      ⚠️ O pedido só será processado após a confirmação do pagamento.
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="gap-2 border-purple-200 text-purple-600"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar aos dados
                </Button>
              </div>
              <div>
                <OrderSummary
                  scoops={scoops}
                  onContinue={handleSubmit}
                  loading={loading}
                  buttonText="Confirmar pedido"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}