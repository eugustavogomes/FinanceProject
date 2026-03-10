import { useEffect, useMemo, useState } from 'react';
import { useGoals, type GoalInput } from '../hooks/useGoals';
import { useTransactions } from '../hooks/useTransactions';
import { TrashIcon, Pencil } from 'lucide-react';
import { calculateAverageMonthlyNet, formatCurrency, getMonthsUntil } from '../lib/goalsUtils';
import AddGoalModal from '../components/modals/AddGoalModal';

export default function GoalsPage() {
  const { goals, loading, error, createGoal, updateGoal, deleteGoal } = useGoals();
  const { transactions } = useTransactions();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<{ category?: string | null; target: number; month: number; year: number } | null>(null);

  const averageMonthlyNet = useMemo(() => calculateAverageMonthlyNet(transactions), [transactions]);

  useEffect(() => {
    if (!editingId) return;
    const goal = goals.find((g) => g.id === editingId);
    if (!goal) return;
    setModalInitialData({
      category: goal.category,
      target: goal.target,
      month: goal.month,
      year: goal.year,
    });
    setModalOpen(true);
  }, [editingId, goals]);

  return (
    <main className="p-3">
      <section>
        {loading ? (
          <div className="text-sm text-muted-foreground">Carregando metas...</div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : goals.length === 0 ? (
          <div className="text-sm text-muted-foreground">
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
                <div key={g.id} className="bg-white dark:bg-gray-800 text-card-foreground border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-foreground">{g.category || 'Meta sem nome'}</h4>
                        <p className="text-xs text-muted-foreground">Prazo alvo: {deadline}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Custo total</div>
                        <div className="font-semibold">{formatCurrency(g.target)}</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Necessário/mês: {formatCurrency(requiredPerMonth)}</span>
                        {averageMonthlyNet > 0 && (
                          <span>Poupança média: {formatCurrency(averageMonthlyNet)}/mês</span>
                        )}
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 ${progressRatio >= 1 ? 'bg-emerald-500' : 'bg-amber-400'}`}
                          style={{ width: `${Math.max(4, Math.min(100, progressRatio * 100))}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground leading-snug">{helperText}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(g.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
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
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-red-200 dark:border-red-500/60 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
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

      <AddGoalModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingId(null);
          setModalInitialData(null);
        }}
        initialData={modalInitialData || undefined}
        onSubmit={async (data: GoalInput) => {
          setFormError(null);
          const result = editingId ? await updateGoal(editingId, data) : await createGoal(data);
          if (!result.success) {
            setFormError(result.error || 'Erro ao salvar meta');
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
        aria-label="Adicionar meta"
        title="Adicionar meta"
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-green-600 text-white shadow-xl flex items-center justify-center text-3xl hover:bg-green-500 transition"
      >
        +
      </button>
    </main>
  );
}