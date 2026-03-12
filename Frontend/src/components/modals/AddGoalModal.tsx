import { useEffect, useState, type FormEvent } from 'react';
import type { GoalInput } from '../../hooks/useGoals';
import { formatCurrencyInput, parseCurrencyInput } from '../../utils/currencyInput';

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

  const now = new Date();
  const minDeadline = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

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
      setTarget(
        initialData.target
          ? initialData.target.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          : ''
      );
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

    const parsedTarget = parseCurrencyInput(target);
    if (!parsedTarget || parsedTarget <= 0) {
      setError('Please enter a valid target amount.');
      return;
    }

    if (!deadline) {
      setError('Please select a deadline (month/year) for this goal.');
      return;
    }

    const [yearStr, monthStr] = deadline.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr);

    if (!year || !month) {
      setError('Invalid deadline.');
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
      setError(result.error || 'Error saving goal');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 z-10 w-full max-w-md border border-gray-100 dark:border-gray-700 shadow-lg">
        <h3 className="text-lg font-semibold mb-1 text-foreground">
          {initialData ? 'Edit goal' : 'New goal'}
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Define a clear target, amount and deadline for your savings goal.
        </p>
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col">
              <label className="text-xs font-medium text-muted-foreground mb-1">Goal name</label>
              <input
                className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                placeholder="e.g. Trip, car, emergency fund..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-muted-foreground mb-1">Target amount</label>
              <input
                className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                placeholder="e.g. R$ 10.000,00"
                value={target}
                onChange={(e) => setTarget(formatCurrencyInput(e.target.value))}
                inputMode="decimal"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-muted-foreground mb-1">Deadline (month/year)</label>
            <div className="flex items-center gap-2">
              <input
                type="month"
                className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={minDeadline}
              />
            </div>
            <span className="mt-1 text-[11px] text-muted-foreground">
              Choose an approximate month and year to reach this goal.
            </span>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-500 disabled:opacity-60"
            >
              {loading ? 'Saving...' : initialData ? 'Update goal' : 'Add goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
