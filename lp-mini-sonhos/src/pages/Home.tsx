import React from 'react';
import HeroSection from '../components/HeroSection';
import WhatsAppButton from '../components/WhatsAppButton';
import { motion } from 'framer-motion';
import { Gift, Sparkles, Truck, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698d0981b1748898520c7b9e/8d36882cc_file_000000004754720eaaf307c3bd0b76f4.png";
const WHATSAPP_LINK = "https://wa.me/qr/326K3JISIY4AF1";

const features = [
  {
    icon: Gift,
    title: 'Presentes surpresa',
    description: 'Cada miçanga representa um mimo especial!',
    color: 'from-pink-400 to-pink-500',
  },
  {
    icon: Sparkles,
    title: 'Sempre mágico',
    description: 'A emoção de não saber o que vem torna tudo mais especial',
    color: 'from-purple-400 to-purple-500',
  },
  {
    icon: Truck,
    title: 'Entrega com carinho',
    description: 'Enviamos seu pacotinho surpresa com todo cuidado',
    color: 'from-pink-400 to-purple-400',
  },
  {
    icon: Heart,
    title: 'Itens kawaii',
    description: 'Coisas fofas e especiais selecionadas para você',
    color: 'from-purple-400 to-pink-400',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <WhatsAppButton />

      {/* Features Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-white to-pink-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4">
              Por que escolher a gente?
            </h2>
            <p className="text-purple-600 max-w-2xl mx-auto">
              Somos mais que surpresas, somos momentos de felicidade!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-pink-100 hover:shadow-md transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-purple-800 mb-2">{feature.title}</h3>
                <p className="text-purple-600 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What can you get Section */}
      <section className="py-24 px-6 bg-pink-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-6">
              O que pode vir na surpresa?
            </h2>
            <p className="text-purple-600 mb-10">
              Cada miçanga representa um objeto especial!
            </p>
          </motion.div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {['🧸 Squishy', '🖌️ Kit de pincéis', '✏️ Estojo', '📿 Pulseira', '🔑 Chaveiro', '📝 Post-it', '🖊️ Caneta', '🖍️ Marca-texto'].map((item, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white px-6 py-3 rounded-full text-purple-700 font-medium shadow-sm border border-pink-200"
              >
                {item}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-pink-400 via-purple-400 to-pink-400 rounded-[3rem] p-12 md:p-16 text-center text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10">
            <span className="text-6xl mb-6 block">🎁</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pronta para a surpresa?
            </h2>
            <p className="text-white/90 mb-8 max-w-lg mx-auto">
              Escolha seu scoop de miçangas e descubra presentes incríveis!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/Order"
                className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-pink-50 transition-colors shadow-lg"
              >
                Fazer meu pedido surpresa
              </a>
              <a 
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-600 transition-colors shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Precisa de ajuda?
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-pink-50 border-t border-pink-100">
        <div className="max-w-6xl mx-auto text-center">
          <img src={LOGO_URL} alt="Emily MiniSonhos" className="w-24 h-24 mx-auto mb-4 object-contain rounded-full" />
          <div className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Emily MiniSonhos
          </div>
          <a 
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-4"
          >
            <MessageCircle className="w-5 h-5" />
            Fale conosco pelo WhatsApp
          </a>
          <p className="text-purple-500 text-sm">
            © 2026 Emily MiniSonhos.
          </p>
        </div>
      </footer>
    </div>
  );
}