import { useState, useEffect } from 'react'
import Header from '../components/Header'
import api from '../services/api';

interface TransactionForm {
  value: number;
  type: string;
  categoryId: number;
  date: string;
  description: string;
}
interface Transaction {
  id: string | number;
  categoria: string;
  tipo: string;
  valor: number;
  data: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [form, setForm] = useState<TransactionForm>({
    value: 0,
    type: 'Income',
    categoryId: 1,
    date: new Date().toISOString().slice(0, 10),
    description: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  function fetchTransactions() {
    api.get('/transactions')
      .then(res => {
        const mapped = res.data.map((tx: any) => ({
          id: tx.id,
          categoria: tx.categoryName || '',
          tipo: tx.type,
          valor: tx.value,
          data: new Date(tx.date).toLocaleDateString('pt-BR')
        }));
        setTransactions(mapped);
      });
  }

  useEffect(() => {
    fetchTransactions();
  }, [])
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      api.put(`/transactions/${editingId}`, form).then(() => {
        setEditingId(null);
        setForm({ value: 0, type: 'Income', categoryId: 1, date: new Date().toISOString().slice(0, 10), description: '' });
        fetchTransactions();
      });
    } else {
      api.post('/transactions', form).then(() => {
        setForm({ value: 0, type: 'Income', categoryId: 1, date: new Date().toISOString().slice(0, 10), description: '' });
        fetchTransactions();
      });
    }
  }

  function handleEdit(tx: any) {
    setEditingId(Number(tx.id));
    setForm({
      value: tx.valor,
      type: tx.tipo,
      categoryId: tx.categoryId || 1,
      date: new Date(tx.data).toISOString().slice(0, 10),
      description: tx.description || ''
    });
  }

  function handleDelete(id: number | string) {
    api.delete(`/transactions/${id}`).then(() => {
      fetchTransactions();
    });
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-white">Transactions</h2>
        <form onSubmit={handleSubmit} className="mb-6 flex gap-4 items-end flex-wrap">
          <input
            type="text"
            name="value"
            value={form.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            onChange={undefined}
            placeholder="Valor"
            className="px-2 h-10 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-600"
            required
          />
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="px-2 h-10 rounded bg-gray-800 text-white border border-gray-600"
          >
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="px-2 h-10 rounded bg-gray-800 text-white border border-gray-600"
            required
          />
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descrição"
            className="px-2 h-10 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-600"
          />
          <input
            type="text"
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            placeholder="Categoria"
            className="px-2 h-10 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-600"
            required
          />
          <button type="submit" className="bg-green-600 text-white px-4 h-10 rounded">{editingId ? 'Salvar' : 'Adicionar'}</button>
          {editingId && <button type="button" className="bg-gray-400 text-white px-4 h-10 rounded" onClick={() => { setEditingId(null); setForm({ value: 0, type: 'Income', categoryId: 1, date: new Date().toISOString().slice(0, 10), description: '' }); }}>Cancelar</button>}
        </form>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow-lg border border-white/10 p-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 text-white">Category</th>
                <th className="text-left py-2 text-white">Type</th>
                <th className="text-right py-2 text-white">Amount</th>
                <th className="text-right py-2 text-white">Date</th>
                <th className="text-right py-2 text-white">Ações</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-2 text-gray-300">{tx.categoria}</td>
                  <td className="py-2 text-gray-300">{tx.tipo}</td>
                  <td className={`py-2 text-right font-medium ${tx.tipo === 'Income' ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="py-2 text-right text-gray-300">{tx.data}</td>
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
    </div>
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
            <span>{tx.categoria} ({tx.tipo})</span>
            <span className={tx.tipo === 'Income' ? 'text-green-600':'text-red-500'}>
              {tx.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
            <span>{tx.data}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}