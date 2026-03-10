import React, { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; type?: string }) => Promise<{ success: boolean; error?: string }>;
}

export default function AddCategoryModal({ isOpen, onClose, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setType('');
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError('Nome é obrigatório');
      return;
    }
    setLoading(true);
    const result = await onSubmit({ name: name.trim(), type: type.trim() || undefined });
    setLoading(false);
    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Erro ao criar categoria');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 z-10 w-full max-w-md border border-gray-100 dark:border-gray-700 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Nova Categoria</h3>
        {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome da categoria"
            className="px-2 h-10 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-emerald-200 focus:outline-none"
            required
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-2 h-10 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none"
          >
            <option value="">Select type</option>
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>

          <div className="flex gap-2 justify-end mt-2">
            <button
              type="button"
              className="px-4 h-10 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm border border-gray-300 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-700"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 h-10 rounded bg-green-600 text-white text-sm hover:bg-green-500 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
