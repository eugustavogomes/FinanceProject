type SummaryCardProps = {
  label: string;
  value: number;
  type: 'income' | 'expense' | string;
};

export function SummaryCard({ label, value, type }: SummaryCardProps) {
  const getGradientClass = () => {
    if (type === 'income') {
      return 'bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent';
    }
    if (type === 'expense') {
      return 'bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent';
    }
    return 'text-blue-400';
  };

  return (
    <div className="rounded-xl px-4 py-6 backdrop-blur-sm border border-gray-900/10 bg-white/70">
      <span className={`block font-semibold text-xl mb-1 ml-3 ${getGradientClass()}`}>{label}</span>
      <span className="text-3xl ml-3 font-bold text-gray-600">
        {value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </span>
    </div>
  );
}