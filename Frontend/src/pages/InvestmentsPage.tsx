import { useMemo, useState } from 'react';
import { useInvestments, type InvestmentInput } from '../hooks/useInvestments';
import { Pencil, TrashIcon } from 'lucide-react';
import AddInvestmentModal from '../components/modals/AddInvestmentModal';

export default function InvestmentsPage() {
  const { investments, loading, error, createInvestment, updateInvestment, deleteInvestment } = useInvestments();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<InvestmentInput | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const totals = useMemo(() => {
    const totalCurrent = investments.reduce((sum, i) => sum + (i.currentValue || 0), 0);
    const totalInvested = investments.reduce((sum, i) => sum + (i.investedAmount || 0), 0);
    const profit = totalCurrent - totalInvested;
    return { totalCurrent, totalInvested, profit };
  }, [investments]);

  const filteredInvestments = useMemo(() => {
    return investments.filter((i) => {
      if (filterCategory !== 'all' && (i.category || '-') !== filterCategory) return false;
      if (search) {
        const haystack = `${i.name} ${i.category || ''}`.toLowerCase();
        if (!haystack.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [investments, search, filterCategory]);

  function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function handleEdit(id: string) {
    const inv = investments.find((i) => i.id === id);
    if (!inv) return;
    setEditingId(id);
    setModalInitialData({
      name: inv.name,
      category: inv.category || undefined,
      investedAmount: inv.investedAmount,
      currentValue: inv.currentValue,
      expectedReturnYearly: inv.expectedReturnYearly ?? undefined,
    });
    setModalOpen(true);
  }

  return (
    <main className="p-3">
      {formError && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
          {formError}
        </div>
      )}

      <section>
        {loading ? (
          <div className="text-sm text-gray-500">Carregando investimentos...</div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : investments.length === 0 ? (
          <div className="text-sm text-gray-500">No investments yet. Use the + button to add your first one.</div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th colSpan={6} className="px-4 py-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex flex-col gap-2 w-full md:w-auto">
                        <div className="flex flex-col sm:flex-row gap-2 w-full">
                          <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or category"
                            className="w-full sm:w-64 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-200"
                          />
                          <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-3 py-2 border rounded-lg text-sm min-w-[160px]"
                          >
                            <option value="all">All categories</option>
                            {Array.from(new Set(investments.map((i) => i.category || '-'))).map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs w-full md:w-auto justify-end">
                        <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-right">
                          <div className="text-gray-500">Current Assets</div>
                          <div className="font-semibold text-gray-800">{formatCurrency(totals.totalCurrent)}</div>
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-right">
                          <div className="text-gray-500">Total Invested</div>
                          <div className="font-semibold text-gray-800">{formatCurrency(totals.totalInvested)}</div>
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-right">
                          <div className="text-gray-500">Profit/Loss</div>
                          <div
                            className={`font-semibold ${totals.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
                          >
                            {formatCurrency(totals.profit)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </th>
                </tr>

                <tr className="border-b bg-gray-50">
                  <th className="text-left px-4 py-2 text-xs text-gray-500">Name</th>
                  <th className="text-left px-4 py-2 text-xs text-gray-500">Category</th>
                  <th className="text-right px-4 py-2 text-xs text-gray-500">Invested</th>
                  <th className="text-right px-4 py-2 text-xs text-gray-500">Current</th>
                  <th className="text-right px-4 py-2 text-xs text-gray-500">Result</th>
                  <th className="text-right px-4 py-2 text-xs text-gray-500">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredInvestments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                      No investments match the current filters.
                    </td>
                  </tr>
                ) : (
                  filteredInvestments.map((i) => {
                    const profit = (i.currentValue || 0) - (i.investedAmount || 0);
                    const profitPct = i.investedAmount > 0 ? (profit / i.investedAmount) * 100 : 0;

                    return (
                      <tr key={i.id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium text-gray-800">{i.name}</td>
                        <td className="px-4 py-2 text-gray-600 text-xs">{i.category || '-'}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(i.investedAmount)}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(i.currentValue)}</td>
                        <td className="px-4 py-2 text-right">
                          <span className={profit >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                            {formatCurrency(profit)} ({profitPct.toFixed(1)}%)
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => handleEdit(i.id)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 mr-1"
                          >
                            <Pencil className="w-3 h-3" />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={async () => {
                              const ok = window.confirm('Are you sure you want to remove this investment?');
                              if (!ok) return;

                              const result = await deleteInvestment(i.id);
                              if (!result.success) {
                                setFormError(result.error || 'Error removing investment');
                              }
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-red-200 text-xs text-red-600 hover:bg-red-50"
                          >
                            <TrashIcon className="w-3 h-3" />
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <AddInvestmentModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingId(null);
          setModalInitialData(null);
        }}
        initialData={modalInitialData}
        onSubmit={async (data) => {
          setFormError(null);

          const result = editingId ? await updateInvestment(editingId, data) : await createInvestment(data);

          if (!result.success) {
            setFormError(result.error || 'Error saving investment');
          }
          return result;
        }}
      />

      <button
        onClick={() => {
          setEditingId(null);
          setModalInitialData(null);
          setModalOpen(true);
        }}
        aria-label="Add investment"
        title="Add investment"
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-green-600 text-white shadow-xl flex items-center justify-center text-3xl hover:bg-green-500 transition"
      >
        +
      </button>
    </main>
  );
}