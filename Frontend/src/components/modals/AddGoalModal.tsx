import { useEffect, useState, type FormEvent } from 'react';
import type { GoalInput } from '../../hooks/useGoals';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GoalInput) => Promise<{ success: boolean; error?: string }>;
  initialData?: { category?: string | null; target: number; month: number; year: number } | null;
}

export default function AddGoalModal({ isOpen, onClose, onSubmit, initialData }: Props) {
  const [category, setCategory] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState(''); // YYYY-MM
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setCategory('');
      setTarget('');
      setDeadline('');
      setError(null);
      setLoading(false);
      return;
    }

    if (initialData) {
      setCategory(initialData.category || '');
      setTarget(String(initialData.target));
      const monthStr = String(initialData.month).padStart(2, '0');
      setDeadline(`${initialData.year}-${monthStr}`);
      setError(null);
    } else {
      setCategory('');
      setTarget('');
      setDeadline('');
      setError(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const parsedTarget = Number(target.replace(/\./g, '').replace(',', '.'));
    if (!parsedTarget || parsedTarget <= 0) {
      setError('Informe um valor de meta válido.');
      return;
    }

    if (!deadline) {
      setError('Informe um prazo (mês/ano) para a meta.');
      return;
    }

    const [yearStr, monthStr] = deadline.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr);

    if (!year || !month) {
      setError('Prazo inválido.');
      return;
    }

    const payload: GoalInput = {
      category: category.trim() || undefined,
      target: parsedTarget,
      month,
      year,
    };

    setLoading(true);
    const result = await onSubmit(payload);
    setLoading(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Erro ao salvar meta');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose}></div>
      <div className="bg-white rounded-lg p-6 z-10 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {initialData ? 'Editar meta' : 'Nova meta'}
        </h3>
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">Nome do sonho/meta</label>
            <input
              className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200"
              placeholder="Ex: Viagem, carro, reserva..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">Custo total desejado</label>
            <input
              className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200"
              placeholder="Ex: 10000"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              inputMode="decimal"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">Prazo (mês/ano)</label>
            <input
              type="month"
              className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-500 disabled:opacity-60"
            >
              {loading ? 'Salvando...' : initialData ? 'Atualizar meta' : 'Adicionar meta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
