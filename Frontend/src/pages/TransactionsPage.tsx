import { useEffect, useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { TrashIcon, Pencil } from 'lucide-react';
import AddTransactionModal from '../components/modals/AddTransactionModal';
import ConfirmationModal from '../components/modals/ConfirmationModal';

/**
 * TransactionsPage
 * Main page component that displays the user's transactions list with
 * search and filters, provides actions to add/edit transactions via a modal,
 * and allows deleting transactions through a confirmation modal.
 * It reads transactions and categories from hooks and keeps a local
 * `filtered` state which is updated whenever dependencies change.
 */
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<any | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Income' | 'Expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<{ id: number | string; label?: string } | null>(null);
  const [filtered, setFiltered] = useState<any[]>([]);
  
  function isIncomeTransaction(tx: any) {
    const rawType = tx?.type;
    if (typeof rawType === 'string') {
      return rawType.toLowerCase() === 'income';
    }
    return rawType === 0;
  }
  
  /**
   * handleEdit
   * Prepare the Add/Edit Transaction modal for editing an existing transaction.
   * - converts the provided transaction id to number and stores in `editingId`.
   * - fills `modalInitialData` with the transaction fields so the modal
   *   form is pre-populated.
   * - opens the modal by setting `showModal` to true.
   */
  function handleEdit(tx: any) {
    setEditingId(String(tx.id));
    setModalInitialData({
      value: tx.value,
      type: tx.type,
      categoryId: tx.categoryId || null,
      date: tx.date,
      description: tx.description || ''
    });
    setShowModal(true);
  }

  /**
   * openDeleteConfirm
   * Open the deletion confirmation modal for a specific transaction.
   * - stores the target id and optional label in `confirmTarget`.
   * - shows the confirmation modal by setting `confirmOpen` to true.
   */
  function openDeleteConfirm(id: number | string, label?: string) {
    setConfirmTarget({ id, label });
    setConfirmOpen(true);
  }

  /**
   * handleConfirmDelete
   * Called when the user confirms deletion in the confirmation modal.
   * - if there is no target, it no-ops.
   * - sets a loading flag while calling the `deleteTransaction` API from the hook.
   * - closes the modal and clears the target afterwards.
   * - if the delete operation fails, stores the error in `formError` so it can
   *   be displayed to the user.
   */
  async function handleConfirmDelete() {
    if (!confirmTarget) return;
    setConfirmLoading(true);
    const result = await deleteTransaction(confirmTarget.id);
    setConfirmLoading(false);
    setConfirmOpen(false);
    setConfirmTarget(null);
    if (!result.success) setFormError(result.error);
  }

  /**
   * Effect to recompute the filtered transactions list.
   * Runs whenever `transactions`, `filterType`, `filterCategory` or `search` change.
   * The computed array is stored in the `filtered` state used for rendering.
   */
  useEffect(() => {
    const next = transactions.filter((tx: any) => {
      if (filterType !== 'all') {
        const income = isIncomeTransaction(tx);
        const matchesType = (filterType === 'Income' && income) || (filterType === 'Expense' && !income);
        if (!matchesType) return false;
      }
      if (filterCategory !== 'all' && String(tx.categoryId || tx.categoryName) !== String(filterCategory)) return false;
      if (search && !String(tx.description || tx.categoryName || '').toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    setFiltered(next);
  }, [transactions, filterType, filterCategory, search]);

  return (
    <main className="p-3">
      {error && <div className="text-red-500">Erro: {error}</div>}
      {formError && <div className="text-red-500 mb-2">{formError}</div>}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b">
                <th colSpan={5} className="p-3">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div className="text-sm font-medium text-foreground">Filtrar transações</div>
                    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por descrição ou categoria"
                        className="w-full md:w-64 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                      />
                      <select
                        value={filterType}
                        onChange={e => setFilterType(e.target.value as any)}
                        className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm min-w-[130px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none"
                      >
                        <option value="all">Todos os tipos</option>
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                      </select>
                      <select
                        value={filterCategory}
                        onChange={e => setFilterCategory(e.target.value)}
                        className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm min-w-[160px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none"
                      >
                        <option value="all">Todas categorias</option>
                        {categories.map((c: any) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </th>
              </tr>
              <tr className="border-b">
                <th className="text-left py-3 text-sm text-gray-700 dark:text-gray-100 p-3 sticky top-0 bg-white dark:bg-gray-800 z-10">Category</th>
                <th className="text-left py-3 text-sm text-gray-700 dark:text-gray-100 p-3 sticky top-0 bg-white dark:bg-gray-800 z-10">Description</th>
                <th className="text-left py-3 text-sm text-gray-700 dark:text-gray-100 p-3 sticky top-0 bg-white dark:bg-gray-800 z-10">Date</th>
                <th className="text-right py-3 text-sm text-gray-700 dark:text-gray-100 p-3 sticky top-0 bg-white dark:bg-gray-800 z-10">Amount</th>
                <th className="text-right py-3 text-sm text-gray-700 dark:text-gray-100 p-3 sticky top-0 bg-white dark:bg-gray-800 z-10">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" /></td>
                    <td className="p-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" /></td>
                    <td className="p-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" /></td>
                    <td className="p-3 text-right"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 ml-auto" /></td>
                    <td className="p-3 text-right"><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <p className="text-gray-600 dark:text-gray-200 mb-4">Nenhuma transação encontrada</p>
                    <button onClick={() => { setEditingId(null); setModalInitialData(undefined); setShowModal(true); }} className="px-4 py-2 bg-green-600 text-white rounded">Adicionar primeira transação</button>
                  </td>
                </tr>
              ) : (
                filtered.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                    <td className="p-3 align-top">
                      <div className="flex items-center gap-3">
                        <div
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                            isIncomeTransaction(tx)
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {tx.categoryName || tx.category || 'No category'}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-gray-700 dark:text-gray-200 max-w-xs truncate">{tx.description || '-'}</td>
                    <td className="p-3 text-sm text-gray-700 dark:text-gray-200">{new Date(tx.date).toLocaleDateString('pt-BR')}</td>
                    <td className={`p-3 text-right font-semibold ${isIncomeTransaction(tx) ? 'text-green-600' : 'text-red-600'}`}>
                      {typeof tx.value === 'number' ? tx.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '--'}
                    </td>
                    <td className="p-3 text-right">
                      <button className="shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 mr-2" onClick={() => handleEdit(tx)}>
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="shadow-sm rounded-lg border border-red-200 dark:border-red-500/60 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30" onClick={() => openDeleteConfirm(tx.id, tx.description || tx.category)}>
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmOpen}
        title="Delete transaction"
        message={confirmTarget ? `Are you sure you want to delete ${confirmTarget.label || 'this transaction'}? This action cannot be undone.` : 'Are you sure?'}
        confirmLabel="Yes, I want to delete"
        cancelLabel="Cancel"
        loading={confirmLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => { setConfirmOpen(false); setConfirmTarget(null); }}
      />
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

      <button
        onClick={() => { setEditingId(null); setModalInitialData(undefined); setShowModal(true); }}
        aria-label="Add Transaction"
        title="Add Transaction"
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-green-600 text-white shadow-xl flex items-center justify-center text-3xl hover:bg-green-500 transition"
      >
        +
      </button>
    </main>
  )
}