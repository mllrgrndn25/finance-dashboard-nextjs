"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner'; //

export default function TransactionForm() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from('transactions')
      .insert([
        { 
          amount: parseFloat(amount), 
          description, 
          type,
          category: 'General' 
        }
      ]);

    if (error) {
      // Notificación de error estilizada
      toast.error(`Error: ${error.message}`); 
    } else {
      // Notificación de éxito con estilo Midnight
      toast.success('¡Movimiento guardado con éxito! ✨');
      
      setAmount('');
      setDescription('');
      
      // Recarga suave para actualizar las tarjetas de arriba
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#1e293b] border border-slate-800 p-8 rounded-xl shadow-2xl space-y-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <PlusCircle size={20} className="text-indigo-400" />
        Registrar Movimiento
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="number"
          step="0.01"
          placeholder="Monto"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
          required
        />
        
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'income' | 'expense')}
          className="bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value="expense">Gasto</option>
          <option value="income">Ingreso</option>
        </select>
      </div>

      <input
        type="text"
        placeholder="¿En qué gastaste?"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
        required
      />

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-indigo-900/40 active:scale-95"
      >
        Guardar Transacción
      </button>
    </form>
  );
}