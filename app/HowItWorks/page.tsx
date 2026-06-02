"use client";
import { motion } from 'framer-motion';
import { ArrowLeft, Gift, Shuffle, Truck, Sparkles } from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa";
import WhatsAppButton from '../components/WhatsAppButton';
import Image from 'next/image';
import Link from 'next/link';

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
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-pink-100 px-4 py-3">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-1 text-purple-600 hover:text-purple-800 transition text-sm font-medium">
                        <ArrowLeft className="w-4 h-4 shrink-0" />
                        <span>Voltar</span>
                    </Link>

                    <Image
                        src="/img/logo.png"
                        alt="Logo"
                        width={120}
                        height={120}
                        style={{ width: "auto", height: "auto" }}
                        className="w-10 h-10 sm:w-14 sm:h-14 object-contain rounded-full"
                        priority
                    />

                    <a
                        href={WHATSAPP_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                        <FaWhatsapp className="w-4 h-4 shrink-0" />
                        <span className="hidden sm:inline">Ajuda</span>
                    </a>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12 sm:mb-16"
                >
                    <span className="text-5xl sm:text-6xl mb-4 sm:mb-6 block">🎲</span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-800 mb-4">
                        Como funciona?
                    </h1>
                    <p className="text-purple-600 text-base sm:text-lg max-w-2xl mx-auto">
                        A emoção de não saber o que vem torna cada pedido uma experiência mágica!
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="space-y-4 sm:space-y-8 mb-12 sm:mb-16">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-4 sm:gap-6 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm border border-pink-100 hover:shadow-md hover:border-purple-300 transition-shadow"
                        >
                            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}>
                                <step.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-pink-400 block mb-1">PASSO {i + 1}</span>
                                <h3 className="text-lg sm:text-xl font-semibold text-purple-800 mb-1 sm:mb-2">{step.title}</h3>
                                <p className="text-purple-600 text-sm leading-relaxed">{step.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm border border-pink-100 mb-10 sm:mb-12"
                >
                    <h2 className="text-xl sm:text-2xl font-bold text-purple-800 mb-5 sm:mb-6">Perguntas frequentes</h2>
                    <div className="space-y-5 sm:space-y-6">
                        <div>
                            <h4 className="font-semibold text-purple-800 mb-1 sm:mb-2 text-sm sm:text-base">Quanto vem em cada scoop?</h4>
                            <p className="text-purple-600 text-sm">
                                Cada scoop tem várias miçangas, e cada miçanga representa um presente diferente!
                                A quantidade pode variar, mas garantimos que você vai amar.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-purple-800 mb-1 sm:mb-2 text-sm sm:text-base">Como funciona o pagamento?</h4>
                            <p className="text-purple-600 text-sm">
                                Aceitamos PIX, boleto e cartão de crédito — tudo processado com segurança pelo Asaas.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-purple-800 mb-1 sm:mb-2 text-sm sm:text-base">Tem mais dúvidas?</h4>
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
                    <Link href="/order" className="block sm:inline-block w-full sm:w-auto">
                        <button className="w-full sm:w-auto rounded-full py-4 px-10 font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                            Quero minha surpresa! 🎁
                        </button>
                    </Link>
                    <div>
                        <a
                            href={WHATSAPP_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 text-sm sm:text-base"
                        >
                            <FaWhatsapp className="w-4 h-4 sm:w-5 sm:h-5" />
                            Precisa de ajuda? Fale conosco!
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
