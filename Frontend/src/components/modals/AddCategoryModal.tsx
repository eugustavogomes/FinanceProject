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
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose}></div>
      <div className="bg-white rounded-lg p-6 z-10 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Nova Categoria</h3>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome da categoria"
            className="px-2 h-10 rounded border border-gray-200"
            required
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-2 h-10 rounded border border-gray-200"
          >
            <option value="">Select type</option>
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>

          <div className="flex gap-2 justify-end mt-2">
            <button type="button" className="bg-gray-300 px-4 h-10 rounded" onClick={onClose} disabled={loading}>Cancelar</button>
            <button type="submit" className="btn btn-primary px-4 h-10 rounded text-white" disabled={loading}>{loading ? 'Salvando...' : 'Adicionar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
