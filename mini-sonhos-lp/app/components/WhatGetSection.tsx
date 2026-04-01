"use client";

import { motion } from 'framer-motion';

export default function WhatGetSection() {
    return(
         <section className="py-24 px-6 bg-gradient-to-t from-white to-pink-50">
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
    )
}