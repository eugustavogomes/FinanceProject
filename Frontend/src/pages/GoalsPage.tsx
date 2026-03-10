import { useEffect, useMemo, useState } from 'react';
import { useGoals, type GoalInput } from '../hooks/useGoals';
import { useTransactions } from '../hooks/useTransactions';
import { TrashIcon, Pencil } from 'lucide-react';
import { calculateAverageMonthlyNet, formatCurrency, getMonthsUntil } from '../lib/goalsUtils';

export default function GoalsPage() {
  const { goals, loading, error, createGoal, updateGoal, deleteGoal } = useGoals();
  const { transactions } = useTransactions();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<{ category: string; target: string; deadline: string }>({
    category: '',
    target: '',
    deadline: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const averageMonthlyNet = useMemo(() => calculateAverageMonthlyNet(transactions), [transactions]);

  useEffect(() => {
    if (!editingId) return;
    const goal = goals.find((g) => g.id === editingId);
    if (!goal) return;
    const monthStr = goal.month.toString().padStart(2, '0');
    setForm({
      category: goal.category || '',
      target: String(goal.target),
      deadline: `${goal.year}-${monthStr}`,
    });
  }, [editingId, goals]);

  function resetForm() {
    setEditingId(null);
    setForm({ category: '', target: '', deadline: '' });
    setFormError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const target = Number(form.target.replace(/\./g, '').replace(',', '.'));
    if (!target || target <= 0) {
      setFormError('Informe um valor de meta válido.');
      return;
    }

    if (!form.deadline) {
      setFormError('Informe um prazo (mês/ano) para a meta.');
      return;
    }

    const [yearStr, monthStr] = form.deadline.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr);

    if (!year || !month) {
      setFormError('Prazo inválido.');
      return;
    }

    const payload: GoalInput = {
      category: form.category.trim() || undefined,
      target,
      month,
      year,
    };

    setSubmitting(true);
    const result = editingId
      ? await updateGoal(editingId, payload)
      : await createGoal(payload);
    setSubmitting(false);

    if (!result.success) {
      setFormError(result.error || 'Erro ao salvar meta');
      return;
    }

    resetForm();
  }

  return (
    <main className="p-3">
      <section className="mb-8 bg-white border border-gray-100 rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold mb-3">Nova meta</h3>
        {formError && <div className="mb-3 text-sm text-red-600">{formError}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">Nome do sonho/meta</label>
            <input
              className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200"
              placeholder="Ex: Viagem, carro, reserva..."
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">Custo total desejado</label>
            <input
              className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200"
              placeholder="Ex: 10000"
              value={form.target}
              onChange={(e) => setForm((f) => ({ ...f, target: e.target.value }))}
              inputMode="decimal"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">Prazo (mês/ano)</label>
            <input
              type="month"
              className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200"
              value={form.deadline}
              onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
            />
          </div>
          <div className="flex gap-2 justify-end md:justify-start">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                Cancelar edição
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-500 disabled:opacity-60"
            >
              {submitting ? 'Salvando...' : editingId ? 'Atualizar meta' : 'Adicionar meta'}
            </button>
          </div>
        </form>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">Suas metas</h3>
        {loading ? (
          <div className="text-sm text-gray-500">Carregando metas...</div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : goals.length === 0 ? (
          <div className="text-sm text-gray-500">
            Nenhuma meta cadastrada ainda. Use o formulário acima para criar sua primeira meta.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {goals.map((g) => {
              const monthsRemaining = Math.max(1, getMonthsUntil(g.year, g.month));
              const requiredPerMonth = Number(g.target) / monthsRemaining;
              const deadline = new Date(g.year, g.month - 1, 1).toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: 'short',
              });

              let helperText = '';
              if (averageMonthlyNet <= 0) {
                helperText = `Para alcançar esta meta até ${deadline}, você precisaria guardar cerca de ${formatCurrency(requiredPerMonth)} por mês.`;
              } else if (averageMonthlyNet >= requiredPerMonth) {
                helperText = `Com sua poupança média estimada (${formatCurrency(averageMonthlyNet)}/mês), você está acima do necessário (${formatCurrency(requiredPerMonth)}/mês) para chegar até ${deadline}.`;
              } else {
                const monthsAtCurrentPace = Math.ceil(Number(g.target) / averageMonthlyNet);
                const projectedDate = new Date();
                projectedDate.setMonth(projectedDate.getMonth() + monthsAtCurrentPace);
                const projectedLabel = projectedDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
                helperText = `No ritmo atual (${formatCurrency(averageMonthlyNet)}/mês), você atingiria esta meta por volta de ${projectedLabel}. Para chegar até ${deadline}, o ideal seria cerca de ${formatCurrency(requiredPerMonth)}/mês.`;
              }

              const progressRatio = averageMonthlyNet > 0 && requiredPerMonth > 0
                ? Math.max(0, Math.min(1.5, averageMonthlyNet / requiredPerMonth))
                : 0;

              return (
                <div key={g.id} className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">{g.category || 'Meta sem nome'}</h4>
                        <p className="text-xs text-gray-500">Prazo alvo: {deadline}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Custo total</div>
                        <div className="font-semibold">{formatCurrency(g.target)}</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Necessário/mês: {formatCurrency(requiredPerMonth)}</span>
                        {averageMonthlyNet > 0 && (
                          <span>Poupança média: {formatCurrency(averageMonthlyNet)}/mês</span>
                        )}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 ${progressRatio >= 1 ? 'bg-emerald-500' : 'bg-amber-400'}`}
                          style={{ width: `${Math.max(4, Math.min(100, progressRatio * 100))}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-gray-600 leading-snug">{helperText}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(g.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
                    >
                      <Pencil className="w-3 h-3" />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const ok = window.confirm('Tem certeza que deseja remover esta meta?');
                        if (!ok) return;
                        const result = await deleteGoal(g.id);
                        if (!result.success) {
                          setFormError(result.error || 'Erro ao remover meta');
                        }
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-red-200 text-xs text-red-600 hover:bg-red-50"
                    >
                      <TrashIcon className="w-3 h-3" />
                      Remover
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}