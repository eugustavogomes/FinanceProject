import React, { useState, useEffect } from 'react';
import type { TransactionType } from '../../types/finance';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    value: number;
    type: TransactionType;
    categoryId: string | null;
    date: string;
    description: string;
  }) => Promise<{ success: boolean; error?: string }>;
  initialData?: {
    value?: number;
    type?: TransactionType | number;
    categoryId?: string | null;
    date?: string;
    description?: string;
  };
  categories: any[];
  loadingCategories: boolean;
}

export default function AddTransactionModal({ isOpen, onClose, onSubmit, initialData, categories, loadingCategories }: Props) {
  const [value, setValue] = useState('');
  const [type, setType] = useState<TransactionType>('Income');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredCategories = categories.filter(c =>
    !c.type || c.type === type
  );

  useEffect(() => {
    if (initialData) {
      setValue(initialData.value !== undefined ? String(initialData.value) : '');
      if (typeof initialData.type === 'string') {
        setType(initialData.type === 'Income' ? 'Income' : 'Expense');
      } else if (typeof initialData.type === 'number') {
        setType(initialData.type === 0 ? 'Income' : 'Expense');
      } else {
        setType('Income');
      }
      setCategoryId(initialData.categoryId || '');
      setDate(initialData.date ? new Date(initialData.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));
      setDescription(initialData.description || '');
    } else {
      setValue('');
      setType('Income');
      setCategoryId('');
      setDate(new Date().toISOString().slice(0, 10));
      setDescription('');
      setError(null);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const numeric = parseFloat(value.toString().replace(/\./g, '').replace(/,/g, '.')) || 0;
    const payload = {
      value: numeric,
      type,
      categoryId: categoryId || null,
      date,
      description
    };

    setLoading(true);
    const result = await onSubmit(payload);
    setLoading(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Erro ao salvar');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 z-10 w-full max-w-md border border-gray-100 dark:border-gray-700 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-foreground">{initialData ? 'Edit Transaction' : 'Add Transaction'}</h3>
        {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/[^0-9,.-]/g, ''))}
            placeholder="Valor (ex: 100,50)"
            className="px-2 h-10 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-emerald-200 focus:outline-none"
            required
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as TransactionType)}
            className="px-2 h-10 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none"
          >
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="px-2 h-10 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none"
          >
            <option value="">Selecione uma categoria</option>
            {filteredCategories.map(c => (
              <option key={c.id} value={c.id}>{c.name} {c.type}</option>
            ))}
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-2 h-10 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-emerald-200 focus:outline-none"
            required
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="px-2 h-10 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-emerald-200 focus:outline-none"
          />

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
              disabled={loading || loadingCategories}
            >
              {loading ? 'Saving...' : (initialData ? 'Save' : 'Add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
