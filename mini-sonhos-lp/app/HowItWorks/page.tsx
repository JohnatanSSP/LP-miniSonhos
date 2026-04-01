"use client";
import { motion } from 'framer-motion';
import { ArrowLeft, Gift, Shuffle, Truck, Sparkles, MessageCircle } from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa";


import WhatsAppButton from '../components/WhatsAppButton';
import Image from 'next/image';

const WHATSAPP_LINK = "https://wa.me/qr/326K3JISIY4AF1";

const steps = [
  {
    icon: Gift,
    title: 'Escolha quantos scoops',
    description: 'Decida quantas colheradas de miçangas você quer. Cada miçanga representa um objeto especial!',
    color: 'from-pink-400 to-pink-500',
  },
  {
    icon: Shuffle,
    title: 'A gente escolhe as surpresas',
    description: 'Selecionamos os melhores itens: squishy, kit de pincéis, estojo, pulseiras, chaveiros e muito mais!',
    color: 'from-purple-400 to-purple-500',
  },
  {
    icon: Truck,
    title: 'Enviamos pra você',
    description: 'Preparamos seu pacotinho com todo carinho e enviamos direto pra sua casa.',
    color: 'from-pink-400 to-purple-400',
  },
  {
    icon: Sparkles,
    title: 'Abra e se surpreenda!',
    description: 'A melhor parte! Descubra seus presentes e aproveite cada mimo especial.',
    color: 'from-purple-400 to-pink-400',
  },
];

export default function page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      <WhatsAppButton />
      {/* Header */}
      <div className="p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">

          <button className="gap-2 text-purple-600 hover:text-purple-800">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          <div className="flex items-center gap-2">
            <Image src="/img/logo.png" alt="Logo" width={300} height={300} className="w-100 h-100 object-contain rounded-full priority " priority loading="eager" />

          </div>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-green-600 hover:text-green-700 text-sm"
          >
            <FaWhatsapp className="w-4 h-4" />
            <span className="hidden sm:inline">Ajuda</span>
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-6xl mb-6 block">🎲</span>
          <h1 className="text-4xl md:text-5xl font-bold text-purple-800 mb-4">
            Como funciona?
          </h1>
          <p className="text-purple-600 text-lg max-w-2xl mx-auto">
            A emoção de não saber o que vem torna cada pedido uma experiência mágica!
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-8 mb-16">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-6 bg-white rounded-3xl p-8 shadow-sm border border-pink-100 hover:shadow-md hover:border-purple-300 transition-shadow"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}>
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-bold text-pink-400">PASSO {i + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-purple-800 mb-2">{step.title}</h3>
                <p className="text-purple-600 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-pink-100 mb-12"
        >
          <h2 className="text-2xl font-bold text-purple-800 mb-6">Perguntas frequentes</h2>

          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-purple-800 mb-2">Quanto vem em cada scoop?</h4>
              <p className="text-purple-600 text-sm">
                Cada scoop tem várias miçangas, e cada miçanga representa um presente diferente!
                A quantidade pode variar, mas garantimos que você vai amar.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-purple-800 mb-2">Como funciona o pagamento?</h4>
              <p className="text-purple-600 text-sm">
                Após confirmar seu pedido, entraremos em contato pelo WhatsApp com os dados para pagamento via PIX ou transferência.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-purple-800 mb-2">Tem mais dúvidas?</h4>
              <p className="text-purple-600 text-sm">
                Fale com a gente pelo WhatsApp! Estamos sempre prontas para ajudar 💜
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >

          <button

            className="relative rounded-full py-4 px-10 font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 backdrop-blur-none 
            transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(236,72,153,0.8)] before:absolute before:inset-0 before:rounded-full 
            before:bg-gradient-to-l before:to-pink-200 before:from-purple-500 before:blur-xs before:opacity-0 hover:before:opacity-10 before:transition 
            before:duration-500"
          >
            Quero minha surpresa! 🎁
          </button>

          <div>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700"
            >
              <FaWhatsapp className="w-5 h-5" />
              Precisa de ajuda? Fale conosco!
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}