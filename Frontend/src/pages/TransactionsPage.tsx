import { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { TrashIcon, Pencil } from 'lucide-react';
import AddTransactionModal from '../components/modals/AddTransactionModal';

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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<any | undefined>(undefined);

  function handleEdit(tx: any) {
    setEditingId(Number(tx.id));
    setModalInitialData({
      value: tx.value,
      type: tx.type,
      categoryId: tx.categoryId || null,
      date: tx.date,
      description: tx.description || ''
    });
    setShowModal(true);
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
      {/* Botão para abrir modal será renderizado abaixo da tabela com um + */}
      <AddTransactionModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingId(null); setModalInitialData(undefined); }}
        onSubmit={async (data) => {
          setFormError(null);
          let result;
          if (editingId) {
            result = await updateTransaction(editingId, data as any);
          } else {
            result = await createTransaction(data as any);
          }
          if (!result.success) setFormError(result.error);
          return result;
        }}
        initialData={modalInitialData}
        categories={categories}
        loadingCategories={loadingCategories}
      />
      <div className="bg-white rounded-lg border border-gray-300 p-3">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left py-3 text-gray-600">Category</th>
              <th className="text-left py-3 text-gray-600">Type</th>
              <th className="text-right py-3 text-gray-600">Amount</th>
              <th className="text-right py-3 text-gray-600">Description</th>
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
                  <td className="py-3 text-right text-gray-500">{tx.description}</td>
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
        <div className="w-full flex justify-end mt-4">
          <button
            className="btn btn-primary "
            onClick={() => { setEditingId(null); setModalInitialData(undefined); setShowModal(true); }}
            aria-label="Add transaction"
          >
            Add Transaction +
          </button>
        </div>
      </div>
    </main>
  )
}