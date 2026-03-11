import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const containers = [
  { id: 'bag', label: 'Saquinho', emoji: '🎁', price: 0 },
  { id: 'box', label: 'Caixinha', emoji: '📦', price: 5 },
  { id: 'jar', label: 'Potinho', emoji: '🫙', price: 10 },
];

export default function ContainerSelector({ selected, setSelected }) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-pink-100">
      <h3 className="text-lg font-semibold text-purple-800 mb-6">Como quer receber?</h3>
      
      <div className="flex gap-3">
        {containers.map((container) => (
          <motion.button
            key={container.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelected(container.id)}
            className={`relative flex-1 p-4 rounded-2xl text-center transition-all duration-300 ${
              selected === container.id
                ? 'bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-300'
                : 'bg-pink-50/50 border-2 border-transparent hover:border-pink-200'
            }`}
          >
            {selected === container.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-5 h-5 bg-pink-400 rounded-full flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-white" />
              </motion.div>
            )}
            <span className="text-3xl block mb-2">{container.emoji}</span>
            <span className="font-medium text-purple-800 block text-sm">{container.label}</span>
            <span className="text-xs text-purple-500">
              {container.price === 0 ? 'Incluído' : `+R$ ${container.price}`}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}