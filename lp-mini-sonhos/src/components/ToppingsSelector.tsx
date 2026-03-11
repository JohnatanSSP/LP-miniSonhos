import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const extras = [
  { id: 'gift_wrap', label: 'Embalagem presente', emoji: '🎀', price: 8 },
  { id: 'card', label: 'Cartãozinho', emoji: '💌', price: 5 },
  { id: 'stickers', label: 'Adesivos', emoji: '⭐', price: 5 },
  { id: 'extra_beads', label: '+5 miçangas', emoji: '📿', price: 15 },
  { id: 'mystery_item', label: 'Item misterioso', emoji: '🎁', price: 12 },
  { id: 'candy', label: 'Docinhos', emoji: '🍬', price: 8 },
];

export default function ToppingsSelector({ selected, setSelected }) {
  const toggleExtra = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(t => t !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const totalExtras = selected.reduce((sum, id) => {
    const extra = extras.find(t => t.id === id);
    return sum + (extra?.price || 0);
  }, 0);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-pink-100">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-purple-800">Extras especiais</h3>
          <p className="text-purple-500 text-sm">Opcional - deixe ainda mais especial</p>
        </div>
        {totalExtras > 0 && (
          <span className="text-sm font-medium text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
            +R$ {totalExtras}
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {extras.map((extra) => {
          const isSelected = selected.includes(extra.id);
          return (
            <motion.button
              key={extra.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleExtra(extra.id)}
              className={`relative p-3 rounded-xl text-center transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-purple-300'
                  : 'bg-pink-50/50 border-2 border-transparent hover:border-pink-200'
              }`}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-purple-400 rounded-full flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-white" />
                </motion.div>
              )}
              <span className="text-2xl block mb-1">{extra.emoji}</span>
              <span className="font-medium text-purple-700 block text-xs">{extra.label}</span>
              <span className="text-xs text-purple-500">+R$ {extra.price}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}