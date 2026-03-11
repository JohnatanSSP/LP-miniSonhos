import React from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MapPin, MessageSquare, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function CustomerForm({ data, setData }) {
  const handleChange = (field, value) => {
    setData({ ...data, [field]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-8 shadow-sm border border-pink-100"
    >
      <h3 className="text-lg font-semibold text-purple-800 mb-6">Dados pessoais</h3>

      <div className="space-y-5">
        <div>
          <Label className="text-purple-600 mb-2 block">Nome completo *</Label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
            <Input
              value={data.customer_name || ''}
              onChange={(e) => handleChange('customer_name', e.target.value)}
              placeholder="Seu nome completo"
              className="pl-12 py-6 rounded-xl border-pink-200 focus:border-purple-300 focus:ring-purple-200"
            />
          </div>
        </div>

        <div>
          <Label className="text-purple-600 mb-2 block">CPF *</Label>
          <div className="relative">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
            <Input
              value={data.cpf || ''}
              onChange={(e) => handleChange('cpf', e.target.value)}
              placeholder="000.000.000-00"
              className="pl-12 py-6 rounded-xl border-pink-200 focus:border-purple-300 focus:ring-purple-200"
            />
          </div>
        </div>

        <div>
          <Label className="text-purple-600 mb-2 block">E-mail *</Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
            <Input
              type="email"
              value={data.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="seu@email.com"
              className="pl-12 py-6 rounded-xl border-pink-200 focus:border-purple-300 focus:ring-purple-200"
            />
          </div>
        </div>

        <div>
          <Label className="text-purple-600 mb-2 block">Telefone / WhatsApp *</Label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
            <Input
              value={data.customer_phone || ''}
              onChange={(e) => handleChange('customer_phone', e.target.value)}
              placeholder="(00) 00000-0000"
              className="pl-12 py-6 rounded-xl border-pink-200 focus:border-purple-300 focus:ring-purple-200"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-pink-100">
          <h4 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-pink-400" />
            Endereço de entrega
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label className="text-purple-600 mb-2 block">Rua *</Label>
              <Input
                value={data.street || ''}
                onChange={(e) => handleChange('street', e.target.value)}
                placeholder="Nome da rua"
                className="py-6 rounded-xl border-pink-200 focus:border-purple-300 focus:ring-purple-200"
              />
            </div>

            <div>
              <Label className="text-purple-600 mb-2 block">Número *</Label>
              <Input
                value={data.number || ''}
                onChange={(e) => handleChange('number', e.target.value)}
                placeholder="123"
                className="py-6 rounded-xl border-pink-200 focus:border-purple-300 focus:ring-purple-200"
              />
            </div>

            <div>
              <Label className="text-purple-600 mb-2 block">Complemento</Label>
              <Input
                value={data.complement || ''}
                onChange={(e) => handleChange('complement', e.target.value)}
                placeholder="Apto, bloco..."
                className="py-6 rounded-xl border-pink-200 focus:border-purple-300 focus:ring-purple-200"
              />
            </div>

            <div>
              <Label className="text-purple-600 mb-2 block">Bairro *</Label>
              <Input
                value={data.neighborhood || ''}
                onChange={(e) => handleChange('neighborhood', e.target.value)}
                placeholder="Seu bairro"
                className="py-6 rounded-xl border-pink-200 focus:border-purple-300 focus:ring-purple-200"
              />
            </div>

            <div>
              <Label className="text-purple-600 mb-2 block">Cidade *</Label>
              <Input
                value={data.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Sua cidade"
                className="py-6 rounded-xl border-pink-200 focus:border-purple-300 focus:ring-purple-200"
              />
            </div>

            <div>
              <Label className="text-purple-600 mb-2 block">Estado *</Label>
              <Input
                value={data.state || ''}
                onChange={(e) => handleChange('state', e.target.value)}
                placeholder="UF"
                className="py-6 rounded-xl border-pink-200 focus:border-purple-300 focus:ring-purple-200"
              />
            </div>

            <div>
              <Label className="text-purple-600 mb-2 block">CEP *</Label>
              <Input
                value={data.cep || ''}
                onChange={(e) => handleChange('cep', e.target.value)}
                placeholder="00000-000"
                className="py-6 rounded-xl border-pink-200 focus:border-purple-300 focus:ring-purple-200"
              />
            </div>
          </div>
        </div>

        <div>
          <Label className="text-purple-600 mb-2 block">Observações (opcional)</Label>
          <div className="relative">
            <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-pink-400" />
            <Textarea
              value={data.special_notes || ''}
              onChange={(e) => handleChange('special_notes', e.target.value)}
              placeholder="Referência de entrega, horário preferido..."
              className="pl-12 pt-4 rounded-xl border-pink-200 focus:border-purple-300 focus:ring-purple-200 min-h-[80px]"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}