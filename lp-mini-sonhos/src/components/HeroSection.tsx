import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698d0981b1748898520c7b9e/8d36882cc_file_000000004754720eaaf307c3bd0b76f4.png";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full opacity-20"
            style={{
              background: ['#f9a8d4', '#c4b5fd', '#fbcfe8', '#ddd6fe', '#fce7f3', '#e9d5ff'][i],
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.img 
            src={LOGO_URL} 
            alt="Emily MiniSonhos" 
            className="w-48 h-48 md:w-64 md:h-64 mx-auto mb-6 object-contain rounded-full"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />

          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="text-sm font-medium text-purple-600">A magia está na surpresa</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Scoops
            </span>
            <br />
            <span className="text-purple-700">Surpresa</span>
          </h1>

          <p className="text-lg md:text-xl text-purple-600/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Escolha seu scoop de miçangas e descubra suas surpresas! ✨
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Order')}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Gift className="w-5 h-5 mr-2" />
                Pedir Agora
              </Button>
            </Link>
            <Link to={createPageUrl('HowItWorks')}>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-6 text-lg rounded-full border-2 border-purple-200 hover:border-pink-300 hover:bg-pink-50 transition-all duration-300"
              >
                Como funciona?
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="mt-16 flex justify-center gap-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {[
            { emoji: "📿", label: "Miçangas surpresa" },
            { emoji: "✨", label: "100% surpresa" },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl mb-2">{item.emoji}</div>
              <p className="text-sm text-purple-500 font-medium">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}