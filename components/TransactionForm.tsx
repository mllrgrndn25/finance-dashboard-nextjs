"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PlusCircle, Wallet } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  onSuccess: () => void;
  currentCurrency: string; // Nueva prop
  rate: number;           // Nueva prop
}

export default function TransactionForm({ onSuccess, currentCurrency, rate }: Props) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // CONVERSIÓN CRUCIAL: Convertimos a USD antes de guardar
      const amountInUSD = parseFloat(amount) / rate;

      const { error } = await supabase
        .from('transactions')
        .insert([
          { 
            amount: amountInUSD, 
            description: description || 'Sin descripción',
            type,
            payment_method: type === 'expense' ? paymentMethod : null,
            category: 'General' 
          }
        ]);

      if (error) throw error;

      toast.success(`Guardado en ${currentCurrency} (Base USD)`);
      setAmount('');
      setDescription('');
      onSuccess();
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#1e293b] border border-slate-800 p-6 rounded-2xl shadow-2xl space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
          <PlusCircle size={16} className="text-indigo-400" />
          Nuevo Registro
        </h3>
        <span className="text-[10px] font-black bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/30">
          ESTÁS USANDO {currentCurrency}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-500 font-bold ml-1">MONTO EN {currentCurrency}</label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-[#0f172a] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm font-mono"
            required
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-500 font-bold ml-1">TIPO</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'income' | 'expense')}
            className="bg-[#0f172a] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm cursor-pointer font-bold"
          >
            <option value="expense">Gasto</option>
            <option value="income">Ingreso</option>
          </select>
        </div>
      </div>

      {type === 'expense' && (
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-500 font-bold ml-1 flex items-center gap-1">
            <Wallet size={10} /> MÉTODO DE PAGO
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="bg-[#0f172a] border border-slate-700 rounded-lg p-2.5 text-indigo-300 focus:outline-none focus:border-indigo-500 text-sm cursor-pointer font-bold"
          >
            <option value="Efectivo">💵 Efectivo</option>
            <option value="Tarjeta de Crédito">💳 Tarjeta de Crédito</option>
            <option value="Transferencia">🏦 Transferencia</option>
          </select>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-slate-500 font-bold ml-1 uppercase">Observación</label>
        <input
          type="text"
          placeholder="Ej: Mercado, Sueldo..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-all text-xs uppercase tracking-widest mt-2 shadow-lg shadow-indigo-900/20"
      >
        {loading ? 'Procesando...' : `Guardar en ${currentCurrency}`}
      </button>
    </form>
  );
}