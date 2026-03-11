import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, MapPin, Phone, Gift, Home, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import WhatsAppButton from '../components/WhatsAppButton';

const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698d0981b1748898520c7b9e/8d36882cc_file_000000004754720eaaf307c3bd0b76f4.png";
const WHATSAPP_LINK = "https://wa.me/qr/326K3JISIY4AF1";

export default function Confirmation() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get('orderId');
      
      if (orderId) {
        const orders = await base44.entities.Order.filter({ id: orderId });
        if (orders.length > 0) {
          setOrder(orders[0]);
        }
      }
      setLoading(false);
    };
    loadOrder();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="animate-pulse text-purple-400">Carregando...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 flex items-center justify-center p-4">
        <div className="text-center">
          <span className="text-6xl block mb-4">🤔</span>
          <h1 className="text-2xl font-bold text-purple-800 mb-4">Pedido não encontrado</h1>
          <Link to={createPageUrl('Home')}>
            <Button className="bg-gradient-to-r from-pink-400 to-purple-400">Voltar ao início</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 py-12 px-4">
      <WhatsAppButton />
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center"
          >
            <Check className="w-10 h-10 text-white" />
          </motion.div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-purple-800 mb-2">
              Pedido confirmado!
            </h1>
            <p className="text-purple-600">
              Entraremos em contato pelo WhatsApp para finalizar o pagamento 🎉
            </p>
          </div>

          {/* Order Number */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 mb-8 text-center">
            <p className="text-sm text-purple-500 mb-1">Número do pedido</p>
            <p className="text-2xl font-bold text-purple-800">#{order.id?.slice(-8).toUpperCase()}</p>
          </div>

          {/* Order Details */}
          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center flex-shrink-0">
                <Gift className="w-5 h-5 text-pink-500" />
              </div>
              <div>
                <p className="font-medium text-purple-800">Seu pedido</p>
                <p className="text-purple-600 text-sm">
                  {order.scoops_quantity} scoop{order.scoops_quantity > 1 ? 's' : ''} surpresa
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="font-medium text-purple-800">Endereço de entrega</p>
                <p className="text-purple-600 text-sm">{order.customer_address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-pink-500" />
              </div>
              <div>
                <p className="font-medium text-purple-800">Contato</p>
                <p className="text-purple-600 text-sm">{order.customer_name} • {order.customer_phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="font-medium text-purple-800">Próximos passos</p>
                <p className="text-purple-600 text-sm">Aguarde nosso contato pelo WhatsApp para pagamento!</p>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-pink-100 pt-6 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-purple-600">Total a pagar</span>
              <span className="text-3xl font-bold text-purple-800">R$ {order.total_price}</span>
            </div>
          </div>

          <div className="space-y-3">
            <a 
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button className="w-full py-6 rounded-2xl bg-green-500 hover:bg-green-600 text-white">
                <MessageCircle className="w-5 h-5 mr-2" />
                Falar no WhatsApp
              </Button>
            </a>
            
            <Link to={createPageUrl('Home')} className="block">
              <Button variant="outline" className="w-full py-6 rounded-2xl border-purple-200 text-purple-600">
                <Home className="w-5 h-5 mr-2" />
                Voltar ao início
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="text-center mt-8">
          <img src={LOGO_URL} alt="Emily MiniSonhos" className="w-16 h-16 mx-auto mb-2 object-contain rounded-full" />
          <p className="text-purple-500 text-sm">
            © 2026 Emily MiniSonhos
          </p>
        </div>
      </div>
    </div>
  );
}