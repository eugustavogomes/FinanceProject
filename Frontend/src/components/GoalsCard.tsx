import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useGoals } from '../hooks/useGoals';
import { useTransactions } from '../hooks/useTransactions';
import { calculateAverageMonthlyNet, getMonthsUntil } from '../lib/goalsUtils';

export default function GoalsCard() {
  const navigate = useNavigate();
  const { goals, loading: loadingGoals } = useGoals();
  const { transactions } = useTransactions();

  const averageMonthlyNet = calculateAverageMonthlyNet(transactions);

  const sortedGoals = [...goals].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });

  const limitedGoals = sortedGoals.slice(0, 2);
  
  function buildGoalView(goal: any) {
    const monthsRemaining = Math.max(1, getMonthsUntil(goal.year, goal.month));
    const requiredPerMonth = Number(goal.target) / monthsRemaining;

    let progress = 0;
    if (averageMonthlyNet > 0 && requiredPerMonth > 0) {
      progress = Math.max(0, Math.min(100, (averageMonthlyNet / requiredPerMonth) * 100));
    }

    const formattedTarget = goal.target.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const deadline = new Date(goal.year, goal.month - 1, 1).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });

    const title = `${goal.category || 'Goal'} - ${formattedTarget} until ${deadline}`;
    const description = `You need to save about ${requiredPerMonth.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} per month to reach this goal.`;

    return { title, progress, description };
  }

  return (
    <div className="bg-white dark:bg-gray-800 text-card-foreground border border-gray-100 dark:border-gray-700 shadow-sm rounded-lg p-4 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold flex items-center justify-between text-foreground">
          <span>Goals</span>
          {loadingGoals ? (
            <span className="text-xs text-muted-foreground">Loading...</span>
          ) : (
            <span className="text-xs text-muted-foreground">{goals.length} goals</span>
          )}
        </h3>
        <div className="mt-2 space-y-3">
          {limitedGoals.length === 0 && (
            <div className="text-xs text-muted-foreground">
              Create your first financial goals to see progress here.
            </div>
          )}

          {limitedGoals.map((goal) => {
            const { title, progress, description } = buildGoalView(goal);
            return (
              <div key={goal.id} className="border border-border rounded-md p-2">
                <div className="text-xs font-semibold text-foreground mb-1">
                  {title}
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-green-500 h-2.5"
                    style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  {description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button onClick={() => navigate('/goals')} className="px-2 py-1 rounded bg-green-600 text-white text-sm flex items-center">
          View goals
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}
