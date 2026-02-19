"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import SummaryCard from '@/components/SummaryCard';
import TransactionForm from '@/components/TransactionForm';
import FinanceChart from '@/components/FinanceChart';
import FinancialAdvice from '@/components/FinancialAdvice';
import { toast } from 'sonner';
import { Eye, EyeOff, Filter, CreditCard, Banknote, Landmark, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CURRENCIES = {
  USD: { symbol: '$', label: 'USD', rate: 1 },
  COP: { symbol: '$', label: 'COP', rate: 3950 },
  EUR: { symbol: '€', label: 'EUR', rate: 0.92 },
  GBP: { symbol: '£', label: 'GBP', rate: 0.79 },
  MXN: { symbol: '$', label: 'MXN', rate: 17.10 }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function Home() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredMethod, setFilteredMethod] = useState<string>('all');
  const [isPrivate, setIsPrivate] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [totals, setTotals] = useState({ income: 0, expense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) {
        setTransactions(data);
        const inc = data.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
        const exp = data.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
        setTotals({ income: inc, expense: exp, balance: inc - exp });
      }
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    const confirmReset = window.confirm("¿Eliminar todo el historial? Esta acción es irreversible.");
    if (confirmReset) {
      try {
        setLoading(true);
        const { error } = await supabase.from('transactions').delete().not('id', 'is', null);
        if (error) throw error;
        toast.success("Sistema reseteado correctamente ✨");
        setTransactions([]);
        setTotals({ income: 0, expense: 0, balance: 0 });
      } catch (err: any) {
        toast.error("No se pudo borrar: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const convert = (amount: number) => {
    const selected = CURRENCIES[currency as keyof typeof CURRENCIES];
    return amount * selected.rate;
  };

  const displayedTransactions = filteredMethod === 'all' 
    ? transactions 
    : transactions.filter(t => t.payment_method === filteredMethod);

  return (
    <motion.main 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8 font-sans"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Corregido */}
        <motion.header 
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#1e293b]/40 p-6 rounded-3xl border border-slate-800 shadow-xl backdrop-blur-md"
        >
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tighter italic uppercase">Executive Finance</h1>
              <p className="text-[10px] text-indigo-400 uppercase tracking-[0.3em] font-bold">Premium Experience</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPrivate(!isPrivate)}
              className={`p-2 rounded-full transition-all ${isPrivate ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-slate-800 text-slate-400'}`}
            >
              {isPrivate ? <EyeOff size={18} /> : <Eye size={18} />}
            </motion.button>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="text-[10px] font-bold text-rose-500 hover:bg-rose-500/10 border border-rose-900/50 px-4 py-2 rounded-lg transition-all uppercase"
            >
              Resetear Todo
            </motion.button>

            <div className="flex items-center gap-2 bg-[#0f172a] p-1.5 rounded-xl border border-slate-700">
              <span className="text-[9px] font-black text-slate-500 ml-2">DIVISA</span>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent text-indigo-400 text-xs font-bold focus:outline-none cursor-pointer pr-2"
              >
                {Object.keys(CURRENCIES).map(c => <option key={c} value={c} className="bg-[#1e293b]">{c}</option>)}
              </select>
            </div>
          </div>
        </motion.header>

        {/* Tarjetas con Efecto Cascada */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard title="Balance" amount={convert(totals.balance)} type="total" isVisible={!isPrivate} />
          <SummaryCard title="Ingresos" amount={convert(totals.income)} type="income" isVisible={!isPrivate} />
          <SummaryCard title="Gastos" amount={convert(totals.expense)} type="expense" isVisible={!isPrivate} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
            <TransactionForm />
            <FinancialAdvice />
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-8 space-y-6">
            <div className="bg-[#1e293b]/20 border border-slate-800 rounded-3xl flex flex-col overflow-hidden shadow-lg h-[500px]">
              <div className="p-5 border-b border-slate-800 bg-[#1e293b]/40">
                <div className="flex justify-between items-center mb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-2"><Filter size={14} /> Historial</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <FilterBtn label="Todos" active={filteredMethod === 'all'} onClick={() => setFilteredMethod('all')} icon={<LayoutGrid size={12}/>} />
                  <FilterBtn label="Efectivo" active={filteredMethod === 'Efectivo'} onClick={() => setFilteredMethod('Efectivo')} icon={<Banknote size={12}/>} />
                  <FilterBtn label="Tarjeta" active={filteredMethod === 'Tarjeta de Crédito'} onClick={() => setFilteredMethod('Tarjeta de Crédito')} icon={<CreditCard size={12}/>} />
                  <FilterBtn label="Transferencia" active={filteredMethod === 'Transferencia'} onClick={() => setFilteredMethod('Transferencia')} icon={<Landmark size={12}/>} />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
                <AnimatePresence mode='popLayout'>
                  {displayedTransactions.map((t) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={t.id} 
                      className="p-4 flex justify-between items-center hover:bg-[#1e293b]/40 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                          {t.payment_method === 'Efectivo' ? <Banknote size={16}/> : t.payment_method === 'Transferencia' ? <Landmark size={16}/> : <CreditCard size={16}/>}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-200">{t.description || "Sin descripción"}</p>
                          <p className="text-[9px] text-slate-500 uppercase font-bold">{t.payment_method || 'Ingreso'}</p>
                        </div>
                      </div>
                      <div className={`text-right transition-all duration-500 ${isPrivate ? 'blur-md opacity-30' : ''}`}>
                        <p className={`text-sm font-mono font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {t.type === 'income' ? '+' : '-'} {convert(t.amount).toLocaleString()}
                        </p>
                        <p className="text-[10px] text-slate-600 font-black">{currency}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <motion.div 
              variants={itemVariants}
              className={`bg-[#1e293b]/50 border border-slate-800 p-6 rounded-3xl h-[350px] transition-all duration-700 ${isPrivate ? 'opacity-10 blur-2xl' : ''}`}
            >
              <FinanceChart data={[{ name: 'Flujo', ingresos: convert(totals.income), gastos: convert(totals.expense) }]} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
}

function FilterBtn({ label, active, onClick, icon }: any) {
  return (
    <motion.button 
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick} 
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${active ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_5px_15px_rgba(79,70,229,0.4)]' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
    >
      {icon} {label.toUpperCase()}
    </motion.button>
  );
}