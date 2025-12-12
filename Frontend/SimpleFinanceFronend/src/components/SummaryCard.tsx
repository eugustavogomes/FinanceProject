type SummaryCardProps = {
  label: string;
  value: number;
  type: 'receita' | 'despesa' | string;
};

export function SummaryCard({ label, value, type }: SummaryCardProps) {
  const color = type === 'receita' ? 'text-green-600' : type === 'despesa' ? 'text-red-500' : 'text-blue-600';
  return (
    <div className={`rounded-lg shadow px-4 py-6 bg-white ${color}`}>
      <span className="block font-medium mb-2">{label}</span>
      <span className="text-2xl font-bold">{value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
    </div>
  );
}