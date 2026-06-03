"use client";
import { motion } from "framer-motion";
import { Gift, Shuffle, Truck, Sparkles } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: Gift,
    title: "Escolha os scoops",
    description: "Cada scoop é uma colherada cheia de miçangas que revelam uma surpresa especial.",
    color: "from-pink-400 to-pink-500",
    emoji: "1️⃣",
  },
  {
    icon: Shuffle,
    title: "A gente prepara",
    description: "Selecionamos os itens com carinho: squishies, pulseiras, chaveiros e muito mais!",
    color: "from-purple-400 to-purple-500",
    emoji: "2️⃣",
  },
  {
    icon: Truck,
    title: "Enviamos pra você",
    description: "Seu pacotinho surpresa sai direto para a sua porta, embalado com muito amor.",
    color: "from-pink-400 to-purple-400",
    emoji: "3️⃣",
  },
  {
    icon: Sparkles,
    title: "Abra e se surpreenda!",
    description: "A melhor parte! Cada item é uma descoberta mágica que vai alegrar seu dia.",
    color: "from-purple-400 to-pink-400",
    emoji: "4️⃣",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="text-4xl sm:text-5xl mb-3 sm:mb-4 block">🎲</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-800 mb-3 sm:mb-4">
            Como funciona?
          </h2>
          <p className="text-purple-600 max-w-xl mx-auto text-sm sm:text-base">
            Em 4 passos simples você descobre sua próxima surpresa favorita!
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-14">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-pink-100 hover:shadow-md hover:border-purple-200 transition-all duration-300 group"
            >
              {/* Step number badge */}
              <span className="absolute -top-3 -right-2 text-xl sm:text-2xl">{step.emoji}</span>

              <div
                className={`w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <step.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-purple-800 mb-2">
                {step.title}
              </h3>
              <p className="text-purple-600 text-xs sm:text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
        >
          <Link href="/order" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto rounded-full py-3 sm:py-4 px-7 sm:px-10 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg whitespace-nowrap">
              Quero minha surpresa! 🎁
            </button>
          </Link>
          <Link
            href="/HowItWorks"
            className="w-full sm:w-auto text-center text-purple-500 hover:text-purple-700 font-medium text-sm sm:text-base transition-colors underline underline-offset-4"
          >
            Ver detalhes completos →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
