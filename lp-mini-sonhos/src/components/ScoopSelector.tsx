import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PRICE_PER_SCOOP = 75;

export default function ScoopSelector({ quantity, setQuantity }) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-pink-100">
      <h3 className="text-lg font-semibold text-purple-800 mb-6">Quantos scoops surpresa?</h3>
      
      <div className="flex items-center justify-center gap-6">
        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14 rounded-full border-2 border-pink-200 hover:border-pink-300 hover:bg-pink-50"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
        >
          <Minus className="w-5 h-5" />
        </Button>

        <motion.div
          key={quantity}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="text-6xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            {quantity}
          </div>
          <p className="text-purple-500 mt-1">
            {quantity === 1 ? 'scoop' : 'scoops'}
          </p>
        </motion.div>

        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14 rounded-full border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50"
          onClick={() => setQuantity(Math.min(10, quantity + 1))}
          disabled={quantity >= 10}
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      <div className="mt-6 pt-6 border-t border-pink-100 flex justify-between items-center">
        <span className="text-purple-600">Subtotal</span>
        <span className="text-2xl font-bold text-purple-800">R$ {quantity * PRICE_PER_SCOOP}</span>
      </div>
    </div>
  );
}