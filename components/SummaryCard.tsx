"use client";

interface Props {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'total';
  isVisible?: boolean; // Controla el desenfoque (Modo Privacidad)
}

export default function SummaryCard({ title, amount, type, isVisible = true }: Props) {
  // Definición de colores según el tipo de tarjeta
  const colors = {
    income: 'text-emerald-400',
    expense: 'text-rose-400',
    total: 'text-indigo-400'
  };

  // Iconos o bordes sutiles según el tipo
  const borderColors = {
    income: 'border-emerald-500/20',
    expense: 'border-rose-500/20',
    total: 'border-indigo-500/20'
  };

  return (
    <div className={`bg-[#1e293b]/50 border ${borderColors[type]} p-5 rounded-2xl shadow-lg transition-all duration-300`}>
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
        {title}
      </h3>
      <div className="relative">
        <p className={`text-2xl font-mono font-bold ${colors[type]} transition-all duration-500 ${!isVisible ? 'blur-lg select-none opacity-40' : 'blur-0'}`}>
          ${amount.toLocaleString()}
        </p>
        
        {!isVisible && (
          <div className="absolute inset-0 flex items-center">
            <div className="h-1 w-16 bg-slate-700/50 rounded-full animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}