"use client";
import { motion } from 'framer-motion';
import { FaWhatsapp } from "react-icons/fa";
const WHATSAPP_LINK = "https://wa.me/qr/326K3JISIY4AF1";

export default function CiaSection() {
    return(
         <section className="bg-gradient-to-b from-pink-50 to-white py-24 px-6 z-40">
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
                                href="/order"
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
                                <FaWhatsapp className="w-5 h-5" />
                                Precisa de ajuda?
                            </a>
                        </div>
                    </div>
                </motion.div>
            </section>
    )
}