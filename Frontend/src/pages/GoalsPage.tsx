import { useEffect, useMemo, useState } from 'react';
import { useGoals, type GoalInput } from '../hooks/useGoals';
import { useTransactions } from '../hooks/useTransactions';
import { TrashIcon, Pencil } from 'lucide-react';
import { calculateAverageMonthlyNet, formatCurrency, getMonthsUntil } from '../lib/goalsUtils';
import AddGoalModal from '../components/modals/AddGoalModal';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import { IconButton } from '../components/ui/IconButton';
import { FloatingActionButton } from '../components/ui/FloatingActionButton';

export default function GoalsPage() {
  const { goals, loading, error, createGoal, updateGoal, deleteGoal } = useGoals();
  const { transactions } = useTransactions();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<{
    category?: string | null;
    target: number;
    month: number;
    year: number;
  } | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<{ id: number; label?: string } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

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

  function openDeleteConfirm(id: number, label?: string) {
    setConfirmTarget({ id, label });
    setConfirmOpen(true);
  }

  async function handleConfirmDelete() {
    if (!confirmTarget) return;
    setConfirmLoading(true);
    await deleteGoal(confirmTarget.id);
    setConfirmLoading(false);
    setConfirmOpen(false);
    setConfirmTarget(null);
  }

  return (
    <main className="p-3">
      <section>
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading goals...</div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : goals.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No goals registered yet. Use the form above to create your first goal.
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
                helperText = `To reach this goal by ${deadline}, you would need to save around ${formatCurrency(requiredPerMonth)} per month.`;
              } else if (averageMonthlyNet >= requiredPerMonth) {
                helperText = `With your estimated average savings (${formatCurrency(averageMonthlyNet)}/month), you are above the required amount (${formatCurrency(requiredPerMonth)}/month) to reach ${deadline}.`;
              } else {
                const monthsAtCurrentPace = Math.ceil(Number(g.target) / averageMonthlyNet);
                const projectedDate = new Date();
                projectedDate.setMonth(projectedDate.getMonth() + monthsAtCurrentPace);
                const projectedLabel = projectedDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
                helperText = `At your current pace (${formatCurrency(averageMonthlyNet)}/month), you would reach this goal around ${projectedLabel}. To reach ${deadline}, you would need to save about ${formatCurrency(requiredPerMonth)}/month.`;
              }

              const progressRatio = averageMonthlyNet > 0 && requiredPerMonth > 0
                ? Math.max(0, Math.min(1.5, averageMonthlyNet / requiredPerMonth))
                : 0;

              return (
                <div key={g.id} className="bg-white dark:bg-gray-800 text-card-foreground border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-foreground">{g.category || 'Goal without name'}</h4>
                        <p className="text-xs text-muted-foreground">Target deadline: {deadline}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Total cost</div>
                        <div className="font-semibold">{formatCurrency(g.target)}</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Required/month: {formatCurrency(requiredPerMonth)}</span>
                        {averageMonthlyNet > 0 && (
                          <span>Average savings: {formatCurrency(averageMonthlyNet)}/month</span>
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
                    <IconButton
                      onClick={() => setEditingId(g.id)}
                      aria-label="Edit goal"
                    >
                      <Pencil className="w-3 h-3" />
                    </IconButton>
                    <IconButton
                      variant="danger"
                      onClick={() => openDeleteConfirm(g.id)}
                      aria-label="Delete goal"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </IconButton>
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
          return editingId ? await updateGoal(editingId, data) : await createGoal(data);
        }}
      />

      <ConfirmationModal
        isOpen={confirmOpen}
        title="Delete goal"
        message={
          confirmTarget
            ? `Are you sure you want to delete ${confirmTarget.label || 'this goal'}? This action cannot be undone.`
            : 'Are you sure?'
        }
        confirmLabel="Yes, delete goal"
        cancelLabel="Cancel"
        loading={confirmLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setConfirmTarget(null);
        }}
      />

      <FloatingActionButton
        onClick={() => {
          setEditingId(null);
          setModalInitialData(null);
          setModalOpen(true);
        }}
        aria-label="Add goal"
        title="Add goal"
      >
        +
      </FloatingActionButton>
    </main>
  );
}