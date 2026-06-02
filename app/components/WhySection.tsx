"use client";
import { motion } from 'framer-motion';
import { Gift, Sparkles, Truck, Heart } from 'lucide-react';

export default function WhySection() {
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

    return (
        <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-white to-pink-50">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10 sm:mb-16"
                >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-800 mb-4">
                        Por que escolher a gente?
                    </h2>
                    <p className="text-purple-600 max-w-2xl mx-auto">
                        Somos mais que surpresas, somos momentos de felicidade!
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, ease: 'backIn' }}
                            whileHover={{ y: -8 }}
                            className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-pink-100 hover:shadow-md transition-all duration-300"
                        >
                            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 sm:mb-6`}>
                                <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                            </div>
                            <h3 className="text-base sm:text-lg font-semibold text-purple-800 mb-2">{feature.title}</h3>
                            <p className="text-purple-600 text-sm leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
