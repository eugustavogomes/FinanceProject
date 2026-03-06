import { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';


type TransactionType = 'Income' | 'Expense';

interface TransactionForm {
  value: string;
  type: TransactionType;
  categoryId: string;
  date: string;
  description: string;
}
interface Transaction {
  id: string | number;
  value: number;
  date: string;
  description: string;
  type: number;
  categoryId: string | null;
  categoryName: string | null;
}

export default function TransactionsPage() {
  const { 
    transactions, 
    loading, 
    error, 
    createTransaction, 
    updateTransaction, 
    deleteTransaction 
  } = useTransactions();
  const [formError, setFormError] = useState<string | null>(null);
  const { categories, loading: loadingCategories } = useCategories();
  const [form, setForm] = useState<TransactionForm>({
    value: '',
    type: 'Income',
    categoryId: '',
    date: new Date().toISOString().slice(0, 10),
    description: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    const numericValue = e.target.value.replace(/[^0-9.,]/g, '');
    setForm({ ...form, value: numericValue });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const submitData = {
      value: parseFloat(form.value),
      type: form.type === 'Income' ? 0 : 1,
      categoryId: form.categoryId || null,
      date: form.date,
      description: form.description
    };

    setFormError(null);
    
    let result;
    if (editingId) {
      result = await updateTransaction(editingId, submitData);
    } else {
      result = await createTransaction(submitData);
    }

    if (result.success) {
      resetForm();
    } else {
      setFormError(result.error);
    }
  }

  function resetForm() {
    setEditingId(null);
    setForm({ value: '', type: 'Income', categoryId: '', date: new Date().toISOString().slice(0, 10), description: '' });
  }

  function handleEdit(tx: any) {
    setEditingId(Number(tx.id));
    setForm({
      value: tx.value.toString(),
      type: tx.type === 0 ? 'Income' : 'Expense',
      categoryId: tx.categoryId || '',
      date: new Date(tx.date).toISOString().slice(0, 10),
      description: tx.description || ''
    });
  }

  async function handleDelete(id: number | string) {
    if (!confirm('Tem certeza que deseja deletar esta transação?')) {
      return;
    }
    
    const result = await deleteTransaction(id);
    if (!result.success) {
      setFormError(result.error);
    }
  }

  return (
    <main className="p-6">
      {loading && <div>Carregando...</div>}
      {error && <div className="text-red-500">Erro: {error}</div>}
      {formError && <div className="text-red-500 mb-2">{formError}</div>}
      <form onSubmit={handleSubmit} className="mb-6 flex gap-2 items-end flex-wrap">
        <input
          type="text"
          name="value"
          value={form.value}
          onChange={handleValueChange}
          placeholder="Valor (ex: 100,50)"
          className="px-2 h-10 rounded border border-gray-200"
          required
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="px-2 h-10 rounded border border-gray-200"
        >
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          className="px-2 h-10 rounded border border-gray-200"
        >
          <option value="">Selecione uma categoria</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name} {category.type}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="px-2 h-10 rounded border border-gray-200"
          required
        />
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Descrição"
          className="px-2 h-10 rounded border border-gray-200"
        />
        <button
          type="submit"
          className="btn btn-primary px-4 h-10 rounded text-white hover:bg-green-700 transition"
          disabled={loadingCategories}
        >
          {editingId ? 'Salvar' : 'Adicionar'}
        </button>
        {editingId &&
          <button
            type="button"
            className="bg-gray-400 text-white px-4 h-10 rounded hover:bg-opacity-90 transition-colors"
            onClick={resetForm}
          >
            Cancelar
          </button>
        }
      </form>
      <div className="bg-white rounded-lg border border-gray-300 p-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-2 text-gray-600">Category</th>
              <th className="text-left py-2 text-gray-600">Type</th>
              <th className="text-right py-2 text-gray-600">Amount</th>
              <th className="text-right py-2 text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-2 text-gray-300">{tx.categoryName || 'Sem categoria'}</td>
                <td className="py-2 text-gray-300">{tx.type === 0 ? 'Income' : 'Expense'}</td>
                <td className={`py-2 text-right font-medium ${tx.type === 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {typeof tx.value === 'number' && !isNaN(tx.value)
                    ? tx.value.toFixed(2)
                    : '--'}
                </td>
                <td className="py-2 text-right text-gray-300">{new Date(tx.date).toLocaleDateString('pt-BR')}</td>
                <td className="py-2 text-right">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleEdit(tx)}>Editar</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(tx.id)}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

interface LatestTransactionsProps {
  transactions: Transaction[];
}

export function LatestTransactions({ transactions }: LatestTransactionsProps) {
  return (
    <div className="flex-1">
      <h3 className="font-semibold mb-2">Últimos lançamentos</h3>
      <ul>
        {transactions.map(tx => (
          <li key={tx.id} className={`flex justify-between py-2 border-b`}>
            <span>{tx.categoryName || 'Sem categoria'} ({tx.type === 0 ? 'Income' : 'Expense'})</span>
            <span className={tx.type === 0 ? 'text-green-600' : 'text-red-500'}>
              {tx.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
            <span>{new Date(tx.date).toLocaleDateString('pt-BR')}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}