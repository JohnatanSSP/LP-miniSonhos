import React from 'react';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';

export default function PreferenceSelector({ selected, setSelected, notes, setNotes }) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-pink-100">
      <h3 className="text-lg font-semibold text-purple-800 mb-2">Alguma observação?</h3>
      <p className="text-purple-500 text-sm mb-6">Se quiser deixar algum recado ou preferência, escreva aqui (opcional)</p>
      
      <Textarea
        value={notes || ''}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Ex: Gosto muito de cores pastéis, prefiro coisas fofas..."
        className="rounded-xl border-pink-200 focus:border-purple-300 focus:ring-purple-200 min-h-[100px]"
      />
    </div>
  );
}