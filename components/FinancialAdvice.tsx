"use client";

import { useState } from 'react';
import { Lightbulb, PieChart, Info } from 'lucide-react';

export default function FinancialAdvice() {
  const [salary, setSalary] = useState<number>(0);

  const calculate = (percent: number) => {
    return (salary * percent) / 100;
  };

  return (
    <div className="bg-[#1e293b]/50 border border-slate-800 p-6 rounded-2xl shadow-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-500/20 rounded-lg">
          <Lightbulb className="text-indigo-400" size={20} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Calculadora 50/30/20</h3>
          <p className="text-[10px] text-slate-500 italic">Optimiza tu sueldo automáticamente</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-400 ml-1">TU SUELDO MENSUAL</label>
        <input
          type="number"
          placeholder="Ej: 3000000"
          onChange={(e) => setSalary(Number(e.target.value))}
          className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition-all font-mono text-lg"
        />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {/* Necesidades 50% */}
        <div className="p-4 bg-slate-900/50 border-l-4 border-indigo-500 rounded-r-xl">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-indigo-400 uppercase">Necesidades (50%)</span>
            <span className="text-sm font-mono font-bold text-white">
              ${calculate(50).toLocaleString()}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Vivienda, servicios, comida, transporte y seguros.
          </p>
        </div>

        {/* Deseos 30% */}
        <div className="p-4 bg-slate-900/50 border-l-4 border-sky-500 rounded-r-xl">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-sky-400 uppercase">Deseos (30%)</span>
            <span className="text-sm font-mono font-bold text-white">
              ${calculate(30).toLocaleString()}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Cine, restaurantes, hobbies, viajes y suscripciones.
          </p>
        </div>

        {/* Ahorro 20% */}
        <div className="p-4 bg-slate-900/50 border-l-4 border-emerald-500 rounded-r-xl">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Ahorro / Deuda (20%)</span>
            <span className="text-sm font-mono font-bold text-white">
              ${calculate(20).toLocaleString()}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Fondo de emergencia, inversiones o pago de deudas.
          </p>
        </div>
      </div>

      <div className="flex gap-2 p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
        <Info size={14} className="text-indigo-400 shrink-0 mt-0.5" />
        <p className="text-[9px] text-slate-400">
          <strong>Regla 50-30-20:</strong> Es un método para simplificar tus finanzas personales repartiendo tus ingresos en estas tres categorías.
        </p>
      </div>
    </div>
  );
}