import { useEffect, useState, type FormEvent } from 'react';
import type { InvestmentInput } from '../../hooks/useInvestments';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InvestmentInput) => Promise<{ success: boolean; error?: string }>; 
  initialData?: InvestmentInput | null;
}

function parseCurrencyInput(value: string): number {
  const digits = value.replace(/\D/g, '');
  if (!digits) return 0;
  return Number(digits) / 100;
}

function formatCurrencyInput(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  const numeric = Number(digits) / 100;
  return numeric.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function AddInvestmentModal({ isOpen, onClose, onSubmit, initialData }: Props) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [investedAmount, setInvestedAmount] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [expectedReturnYearly, setExpectedReturnYearly] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setCategory('');
      setInvestedAmount('');
      setCurrentValue('');
      setExpectedReturnYearly('');
      setError(null);
      setLoading(false);
      return;
    }

    if (initialData) {
      setName(initialData.name || '');
      setCategory(initialData.category || '');
      setInvestedAmount(
        typeof initialData.investedAmount === 'number'
          ? initialData.investedAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          : ''
      );
      setCurrentValue(
        typeof initialData.currentValue === 'number'
          ? initialData.currentValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          : ''
      );
      setExpectedReturnYearly(
        initialData.expectedReturnYearly != null
          ? String(initialData.expectedReturnYearly)
          : ''
      );
      setError(null);
    } else {
      setName('');
      setCategory('');
      setInvestedAmount('');
      setCurrentValue('');
      setExpectedReturnYearly('');
      setError(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Investment name is required.');
      return;
    }

    const investedAmountNumber = parseCurrencyInput(investedAmount);
    const currentValueNumber = parseCurrencyInput(currentValue);
    const expectedReturnNumber = expectedReturnYearly
      ? Number(expectedReturnYearly.replace(/\./g, '').replace(',', '.'))
      : undefined;

    if (Number.isNaN(investedAmountNumber) || investedAmountNumber < 0) {
      setError('Invalid invested amount.');
      return;
    }
    if (Number.isNaN(currentValueNumber) || currentValueNumber < 0) {
      setError('Invalid current value.');
      return;
    }

    const payload: InvestmentInput = {
      name: name.trim(),
      category: category.trim() || undefined,
      investedAmount: investedAmountNumber,
      currentValue: currentValueNumber,
      expectedReturnYearly: expectedReturnNumber,
    };

    setLoading(true);
    const result = await onSubmit(payload);
    setLoading(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Error saving investment');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 z-10 w-full max-w-md border border-gray-100 dark:border-gray-700 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-foreground">{initialData ? 'Edit investment' : 'Add investment'}</h3>
        {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-muted-foreground mb-1">Name</label>
            <input
              className="px-2 h-10 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-emerald-200 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Stock XYZ, Treasury..."
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-muted-foreground mb-1">Category / Type</label>
            <input
              className="px-2 h-10 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-emerald-200 focus:outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ex: Stocks, Fixed income, Funds..."
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-muted-foreground mb-1">Invested amount</label>
            <input
              className="px-2 h-10 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-emerald-200 focus:outline-none"
              value={investedAmount}
              onChange={(e) => setInvestedAmount(formatCurrencyInput(e.target.value))}
              placeholder="Ex: R$ 10.000,00"
              inputMode="decimal"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-muted-foreground mb-1">Current value</label>
            <input
              className="px-2 h-10 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-emerald-200 focus:outline-none"
              value={currentValue}
              onChange={(e) => setCurrentValue(formatCurrencyInput(e.target.value))}
              placeholder="Ex: R$ 12.000,00"
              inputMode="decimal"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-muted-foreground mb-1">Expected return / year (%)</label>
            <input
              className="px-2 h-10 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-emerald-200 focus:outline-none"
              value={expectedReturnYearly}
              onChange={(e) => setExpectedReturnYearly(e.target.value.replace(/[^0-9.,-]/g, ''))}
              placeholder="Ex: 10,5"
              inputMode="decimal"
            />
          </div>

          <div className="flex gap-2 justify-end mt-2">
            <button
              type="button"
              className="px-4 h-10 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm border border-gray-300 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-700"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 h-10 rounded bg-green-600 text-white text-sm hover:bg-green-500 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Saving...' : initialData ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
