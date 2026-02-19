"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PlusCircle, Wallet } from 'lucide-react';
import { toast } from 'sonner';

export default function TransactionForm() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from('transactions')
      .insert([
        { 
          amount: parseFloat(amount), 
          description: description || 'Sin descripción', // Opcional
          type,
          payment_method: type === 'expense' ? paymentMethod : null,
          category: 'General' 
        }
      ]);

    if (error) {
      toast.error(`Error: ${error.message}`);
    } else {
      toast.success('¡Movimiento guardado! ✨');
      setAmount('');
      setDescription('');
      // Recarga suave para actualizar la lista y gráfica
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#1e293b] border border-slate-800 p-6 rounded-2xl shadow-2xl space-y-4">
      <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2 uppercase tracking-widest">
        <PlusCircle size={16} className="text-indigo-400" />
        Nuevo Registro
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-500 font-bold ml-1">MONTO</label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-[#0f172a] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm"
            required
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-500 font-bold ml-1">TIPO</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'income' | 'expense')}
            className="bg-[#0f172a] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500 cursor-pointer text-sm"
          >
            <option value="expense">Gasto</option>
            <option value="income">Ingreso</option>
          </select>
        </div>
      </div>

      {/* Menú condicional de Método de Pago (Solo si es Gasto) */}
      {type === 'expense' && (
        <div className="flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="text-[10px] text-slate-500 font-bold ml-1 flex items-center gap-1">
            <Wallet size={10} /> MÉTODO DE PAGO
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="bg-[#0f172a] border border-slate-700 rounded-lg p-2.5 text-indigo-300 focus:outline-none focus:border-indigo-500 cursor-pointer text-sm font-medium"
          >
            <option value="Efectivo">💵 Efectivo</option>
            <option value="Tarjeta de Crédito">💳 Tarjeta de Crédito</option>
            <option value="Transferencia">🏦 Transferencia</option>
          </select>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-slate-500 font-bold ml-1 uppercase">Observación (Opcional)</label>
        <input
          type="text"
          placeholder="Ej: Cena, Alquiler, Venta..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-indigo-900/20 active:scale-95 text-xs uppercase tracking-widest mt-2"
      >
        Guardar Transacción
      </button>
    </form>
  );
}