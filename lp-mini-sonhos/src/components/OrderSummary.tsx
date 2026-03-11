import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PRICE_PER_SCOOP = 75;

export default function OrderSummary({ scoops, onContinue, loading, buttonText = "Continuar" }) {
  const total = scoops * PRICE_PER_SCOOP;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-3xl p-8 text-white sticky top-8"
    >
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-pink-200" />
        <h3 className="text-lg font-semibold">Seu pedido surpresa</h3>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-pink-100">{scoops} scoop{scoops > 1 ? 's' : ''} surpresa</span>
          <span className="font-medium">R$ {total}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-pink-400/30 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg">Total</span>
          <span className="text-3xl font-bold">R$ {total}</span>
        </div>
      </div>

      <Button
        onClick={() => onContinue(total)}
        disabled={loading}
        className="w-full bg-white text-purple-600 hover:bg-pink-50 py-6 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {loading ? 'Processando...' : buttonText}
      </Button>

      <p className="text-center text-pink-200 text-xs mt-4">
        🎲 As surpresas são 100% mistério!
      </p>
    </motion.div>
  );
}