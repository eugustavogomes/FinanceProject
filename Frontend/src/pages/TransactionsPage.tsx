import { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { TrashIcon, Pencil } from 'lucide-react';

type TransactionType = 'Income' | 'Expense';

interface TransactionForm {
  value: string;
  type: TransactionType;
  categoryId: string;
  date: string;
  description: string;
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
          placeholder="Description"
          className="px-2 h-10 rounded border border-gray-200"
        />
        <button
          type="submit"
          className="btn btn-primary px-4 h-10 rounded text-white hover:bg-green-700 transition"
          disabled={loadingCategories}
        >
          {editingId ? 'Save' : 'Add Transaction'}
        </button>
        {editingId &&
          <button
            type="button"
            className="bg-gray-400 text-white px-4 h-10 rounded hover:bg-opacity-90 transition-colors"
            onClick={resetForm}
          >
            Cancel
          </button>
        }
      </form>
      <div className="bg-white rounded-lg border border-gray-300 p-3">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left py-3 text-gray-600">Category</th>
              <th className="text-left py-3 text-gray-600">Type</th>
              <th className="text-right py-3 text-gray-600">Amount</th>
              <th className="text-right py-3 text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center">
                  <span className="inline-block animate-spin rounded-full border-4 border-gray-300 border-t-green-500 h-8 w-8"></span>
                </td>
              </tr>
            ) : (
              transactions.map(tx => (
                <tr key={tx.id} className="border-b border-gray-200 mb-3 last:border-0">
                  <td className="py-3 text-gray-700 font-semibold">{tx.categoryName || 'No category'}</td>
                  <td className="py-3 text-gray-500">{tx.type === 0 ? 'Income' : 'Expense'}</td>
                  <td className={`py-3 text-right font-semibold ${tx.type === 0 ? 'text-green-400' : 'text-red-400'}`}> 
                    {typeof tx.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) === 'string'
                      ? tx.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                      : '--'}
                  </td>
                  <td className="text-right text-gray-500">{new Date(tx.date).toLocaleDateString('pt-BR')}</td>
                  <td className="text-right">
                    <button className="shadow-md rounded-xl border border-gray-200 text-gray-400 p-2 hover:bg-gray-400 hover:text-white rounded mr-2" onClick={() => handleEdit(tx)}>
                      <Pencil className="w-4 h-4 " />
                    </button>
                    <button className="shadow-md rounded-xl border border-red-200 hover:bg-red-600 hover:border-white p-2 text-red-400 hover:text-white rounded" onClick={() => handleDelete(tx.id)}>
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}