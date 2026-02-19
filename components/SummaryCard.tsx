"use client";
import { TrendingUp, TrendingDown, ShieldCheck } from 'lucide-react';

interface Props {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'total';
}

export default function SummaryCard({ title, amount, type }: Props) {
  const isTotal = type === 'total';
  
  return (
    <div className={`
      relative overflow-hidden p-8 rounded-xl border border-slate-800 transition-all duration-300
      ${isTotal ? 'bg-gradient-to-br from-indigo-900 to-slate-900 shadow-2xl' : 'bg-[#1e293b] hover:border-slate-700'}
    `}>
      <div className="flex justify-between items-start mb-6">
        <div className={`p-2 rounded-lg ${isTotal ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'}`}>
          {type === 'income' && <TrendingUp size={20} />}
          {type === 'expense' && <TrendingDown size={20} />}
          {type === 'total' && <ShieldCheck size={20} />}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-500">Live Data</span>
      </div>
      
      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">{title}</p>
      <h2 className={`text-3xl font-bold tracking-tight ${isTotal ? 'text-white' : 'text-slate-200'}`}>
        <span className="text-slate-500 font-light mr-1">$</span>
        {amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
      </h2>
    </div>
  );
}
