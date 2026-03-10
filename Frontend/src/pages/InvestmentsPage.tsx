import { useMemo, useState } from 'react';
import { useInvestments, type InvestmentInput } from '../hooks/useInvestments';
import { Pencil, TrashIcon } from 'lucide-react';

export default function InvestmentsPage() {
  const { investments, loading, error, createInvestment, updateInvestment, deleteInvestment } = useInvestments();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<{ name: string; category: string; investedAmount: string; currentValue: string; expectedReturnYearly: string }>(
    { name: '', category: '', investedAmount: '', currentValue: '', expectedReturnYearly: '' }
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const totals = useMemo(() => {
    const totalCurrent = investments.reduce((sum, i) => sum + (i.currentValue || 0), 0);
    const totalInvested = investments.reduce((sum, i) => sum + (i.investedAmount || 0), 0);
    const profit = totalCurrent - totalInvested;
    return { totalCurrent, totalInvested, profit };
  }, [investments]);

  function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function resetForm() {
    setEditingId(null);
    setForm({ name: '', category: '', investedAmount: '', currentValue: '', expectedReturnYearly: '' });
    setFormError(null);
  }

  function handleEdit(id: string) {
    const inv = investments.find((i) => i.id === id);
    if (!inv) return;
    setEditingId(id);
    setForm({
      name: inv.name,
      category: inv.category || '',
      investedAmount: String(inv.investedAmount),
      currentValue: String(inv.currentValue),
      expectedReturnYearly: inv.expectedReturnYearly != null ? String(inv.expectedReturnYearly) : '',
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!form.name.trim()) {
      setFormError('Informe o nome do investimento.');
      return;
    }

    const investedAmount = Number(form.investedAmount.replace(/\./g, '').replace(',', '.'));
    const currentValue = Number(form.currentValue.replace(/\./g, '').replace(',', '.'));
    const expectedReturnYearly = form.expectedReturnYearly
      ? Number(form.expectedReturnYearly.replace(/\./g, '').replace(',', '.'))
      : undefined;

    if (Number.isNaN(investedAmount) || investedAmount < 0) {
      setFormError('Valor investido inválido.');
      return;
    }
    if (Number.isNaN(currentValue) || currentValue < 0) {
      setFormError('Valor atual inválido.');
      return;
    }

    const payload: InvestmentInput = {
      name: form.name.trim(),
      category: form.category.trim() || undefined,
      investedAmount,
      currentValue,
      expectedReturnYearly,
    };

    setSubmitting(true);
    const result = editingId
      ? await updateInvestment(editingId, payload)
      : await createInvestment(payload);
    setSubmitting(false);

    if (!result.success) {
      setFormError(result.error || 'Erro ao salvar investimento');
      return;
    }

    resetForm();
  }

  return (
    <main className="p-3">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="bg-white border border-gray-100 rounded-lg shadow-sm px-3 py-2">
            <div className="text-gray-500">Patrimônio atual</div>
            <div className="font-semibold text-gray-800">{formatCurrency(totals.totalCurrent)}</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg shadow-sm px-3 py-2">
            <div className="text-gray-500">Total investido</div>
            <div className="font-semibold text-gray-800">{formatCurrency(totals.totalInvested)}</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg shadow-sm px-3 py-2">
            <div className="text-gray-500">Resultado</div>
            <div className={`font-semibold ${totals.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatCurrency(totals.profit)}
            </div>
          </div>
        </div>
      </div>

      <section className="mb-8 bg-white border border-gray-100 rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold mb-3">Adicionar investimento</h3>
        {formError && <div className="mb-3 text-sm text-red-600">{formError}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">Nome do investimento</label>
            <input
              className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200"
              placeholder="Ex: Ações XYZ, Tesouro IPCA..."
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">Categoria / tipo</label>
            <input
              className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200"
              placeholder="Ex: Ações, Renda Fixa, Fundos..."
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">Total investido</label>
            <input
              className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200"
              placeholder="Ex: 10000"
              value={form.investedAmount}
              onChange={(e) => setForm((f) => ({ ...f, investedAmount: e.target.value }))}
              inputMode="decimal"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">Valor atual</label>
            <input
              className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200"
              placeholder="Ex: 12000"
              value={form.currentValue}
              onChange={(e) => setForm((f) => ({ ...f, currentValue: e.target.value }))}
              inputMode="decimal"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 justify-end md:justify-start">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-2 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Cancelar edição
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 text-xs rounded-lg bg-green-600 text-white hover:bg-green-500 disabled:opacity-60"
              >
                {submitting ? 'Salvando...' : editingId ? 'Atualizar' : 'Adicionar'}
              </button>
            </div>
          </div>
        </form>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">Seus investimentos</h3>
        {loading ? (
          <div className="text-sm text-gray-500">Carregando investimentos...</div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : investments.length === 0 ? (
          <div className="text-sm text-gray-500">
            Nenhum investimento cadastrado ainda. Use o formulário acima para adicionar.
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-4 py-2 text-xs text-gray-500">Nome</th>
                  <th className="text-left px-4 py-2 text-xs text-gray-500">Categoria</th>
                  <th className="text-right px-4 py-2 text-xs text-gray-500">Investido</th>
                  <th className="text-right px-4 py-2 text-xs text-gray-500">Atual</th>
                  <th className="text-right px-4 py-2 text-xs text-gray-500">Resultado</th>
                  <th className="text-right px-4 py-2 text-xs text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((i) => {
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
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            const ok = window.confirm('Tem certeza que deseja remover este investimento?');
                            if (!ok) return;
                            const result = await deleteInvestment(i.id);
                            if (!result.success) {
                              setFormError(result.error || 'Erro ao remover investimento');
                            }
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-red-200 text-xs text-red-600 hover:bg-red-50"
                        >
                          <TrashIcon className="w-3 h-3" />
                          Remover
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}