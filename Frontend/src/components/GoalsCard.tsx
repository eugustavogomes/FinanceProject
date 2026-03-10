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

  const nextGoal = sortedGoals[0];

  let progress = 0;
  let description = 'Defina suas primeiras metas financeiras para ver sugestões de poupança.';

  if (nextGoal) {
    const monthsRemaining = Math.max(1, getMonthsUntil(nextGoal.year, nextGoal.month));
    const requiredPerMonth = Number(nextGoal.target) / monthsRemaining;

    if (averageMonthlyNet > 0 && requiredPerMonth > 0) {
      progress = Math.max(0, Math.min(100, (averageMonthlyNet / requiredPerMonth) * 100));
    }

    const formattedTarget = nextGoal.target.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const deadline = new Date(nextGoal.year, nextGoal.month - 1, 1).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
    });

    if (averageMonthlyNet <= 0) {
      description = `Para alcançar "${nextGoal.category || 'Meta'}" de ${formattedTarget} até ${deadline}, você precisaria guardar cerca de ${requiredPerMonth.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} por mês.`;
    } else if (averageMonthlyNet >= requiredPerMonth) {
      description = `Você está no ritmo para alcançar "${nextGoal.category || 'Meta'}" de ${formattedTarget} até ${deadline}, poupando em média ${averageMonthlyNet.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} por mês.`;
    } else {
      const monthsAtCurrentPace = Math.ceil(Number(nextGoal.target) / averageMonthlyNet);
      const projectedDate = new Date();
      projectedDate.setMonth(projectedDate.getMonth() + monthsAtCurrentPace);
      const projectedLabel = projectedDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });

      description = `Com a sua poupança média de ${averageMonthlyNet.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/mês, você atingiria "${nextGoal.category || 'Meta'}" por volta de ${projectedLabel}. Para chegar até ${deadline}, o ideal seria guardar cerca de ${requiredPerMonth.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} por mês.`;
    }
  }

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-4 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold flex items-center justify-between">
          <span>Goals</span>
          {loadingGoals ? (
            <span className="text-xs text-gray-400">Carregando...</span>
          ) : (
            <span className="text-xs text-gray-500">{goals.length} metas</span>
          )}
        </h3>
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div className="bg-green-500 h-3" style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
          </div>
          <div className="text-xs text-gray-600 mt-2 leading-snug">
            {description}
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button onClick={() => navigate('/goals')} className="px-2 py-1 rounded bg-green-600 text-white text-sm flex items-center">
          Ver metas
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}
