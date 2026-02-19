"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import SummaryCard from '@/components/SummaryCard';
import TransactionForm from '@/components/TransactionForm';
import FinanceChart from '@/components/FinanceChart'; // Importamos el nuevo componente

export default function Home() {
  const [totals, setTotals] = useState({ income: 0, expense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const { data, error } = await supabase.from('transactions').select('*');
        
        if (error) throw error;

        if (data) {
          const inc = data
            .filter(t => t.type === 'income')
            .reduce((acc, t) => acc + Number(t.amount), 0);
          const exp = data
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => acc + Number(t.amount), 0);

          setTotals({
            income: inc,
            expense: exp,
            balance: inc - exp
          });
        }
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTotals();
  }, []);

  // Preparamos los datos para la gráfica
  const chartData = [
    { name: 'Flujo de Caja', ingresos: totals.income, gastos: totals.expense }
  ];

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-200 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl font-light tracking-widest uppercase text-slate-400">
              Executive / <span className="font-bold text-white">Finance</span>
            </h1>
            <p className="text-slate-500 mt-1">Resumen analítico de activos y flujos.</p>
          </div>
        </header>

        {/* Sección de Tarjetas (Bento Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2">
            <SummaryCard 
              title="Balance Consolidado" 
              amount={totals.balance} 
              type="total" 
            />
          </div>
          <div className="md:col-span-1">
            <SummaryCard 
              title="Ingresos" 
              amount={totals.income} 
              type="income" 
            />
          </div>
          <div className="md:col-span-1">
            <SummaryCard 
              title="Gastos" 
              amount={totals.expense} 
              type="expense" 
            />
          </div>

          {/* Formulario de Registro */}
          <div className="md:col-span-4 mt-8">
            <TransactionForm />
          </div>

          {/* Gráfica de Análisis Real */}
          <div className="md:col-span-4 mt-4 bg-[#1e293b]/50 border border-slate-800 p-8 rounded-2xl shadow-2xl h-[450px]">
            <h3 className="text-lg font-semibold text-slate-300 mb-8 uppercase tracking-tighter">
              Visualización de Flujos Actuales
            </h3>
            
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <p className="text-slate-500 animate-pulse">Sincronizando con Supabase...</p>
              </div>
            ) : totals.income === 0 && totals.expense === 0 ? (
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-xl">
                <p className="text-slate-500 italic text-center">
                  No hay datos suficientes para generar el análisis.<br/>
                  <span className="text-sm">Registra un movimiento arriba para comenzar.</span>
                </p>
              </div>
            ) : (
              <div className="h-[300px] w-full">
                <FinanceChart data={chartData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}