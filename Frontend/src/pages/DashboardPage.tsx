import { useEffect, useState } from "react";
import { SummaryCard } from "../components/SummaryCard";
import IncomeDonutChart from "../components/charts/IncomeDonutChart";
import YearTransactionsChart from "../components/charts/YearTransactionsChart";
import { fetchDashboardSummary } from '../hooks/useDashboard';
import LatestTransactions from "../components/LatestTransactions";
import { useTransactions } from "../hooks/useTransactions";
import { useCategories } from "../hooks/useCategories";
import ExpenseDonutChart from "../components/charts/ExpenseDonutChart";
import MonthNavbar from "../components/MonthNavbar";
import InvestmentsPieCard from "../components/charts/InvestmentsPieCard";
import GoalsCard from "../components/GoalsCard";
import { useInvestments } from "../hooks/useInvestments";
import { isIncomeTransaction } from "../lib/transactionUtils";


/**
 * DashboardPage
 * Shows an overview of the user's finances:
 * - Fetches a dashboard summary (balance, income, expense) for the selected month.
 * - Displays KPI summary cards, category/expense/income charts, investments/goals cards
 *   and recent transactions with a line chart that adapts to the selected month.
 */
export default function DashboardPage() {
  const [summary, setSummary] = useState({ balance: 0, income: 0, expense: 0 });
  const { transactions } = useTransactions();
  const { categories } = useCategories();
  const { investments } = useInvestments();
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');


  /**
   * Effect: fetch dashboard summary for the current `selectedMonth`.
   * - calls `fetchDashboardSummary` whenever `selectedMonth` changes and
   *   updates the `summary` state.
   */
  useEffect(() => {
    fetchDashboardSummary(selectedMonth).then(res => setSummary(res.data));
  }, [selectedMonth]);

  const filteredTransactions = (selectedMonth === 'all')
    ? transactions
    : transactions.filter((tx: any) => {
      try {
        const d = new Date(tx.date);
        return d.getMonth() === (selectedMonth as number);
      } catch {
        return false;
      }
    });

  const savingsRate = summary.income > 0
    ? ((summary.income - summary.expense) / summary.income) * 100
    : 0;

  /**
   * getMonthlySeries
   * Build income and expense series for the last 12 months.
   * - returns `{ incomeSeries, expenseSeries, months }` where `months` contains
   *   short month labels in English.
   */
  function getMonthlySeries() {
    const incomeSeries: number[] = [];
    const expenseSeries: number[] = [];
    const months: string[] = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const year = date.getFullYear();
      const month = date.getMonth();
      months.push(date.toLocaleString('en-US', { month: 'short' }));
      const monthly = transactions.filter((tx: any) => {
        const d = new Date(tx.date);
        return d.getFullYear() === year && d.getMonth() === month;
      });
      const income = monthly
        .filter((t: any) => isIncomeTransaction(t))
        .reduce((s: number, t: any) => s + (typeof t.value === 'number' ? t.value : 0), 0);
      const expense = monthly
        .filter((t: any) => !isIncomeTransaction(t))
        .reduce((s: number, t: any) => s + (typeof t.value === 'number' ? t.value : 0), 0);
      incomeSeries.push(income);
      expenseSeries.push(expense);
    }
    return { incomeSeries, expenseSeries, months };
  }

  // The year chart should always display the last 12 months,
  // independent of the selected month filter used elsewhere.
  const lineData = getMonthlySeries();

  const latestForDashboard = transactions
    .slice()
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4)
    .map((tx: any) => ({
      id: String(tx.id),
      category: tx.categoryName || tx.category || 'No category',
      type: tx.type,
      value: tx.value,
      date: new Date(tx.date).toLocaleDateString('pt-BR'),
      description: tx.description || ''
    }));

  return (
    <main className="p-1">
      <div className="mb-3 flex items-center justify-center">
        <MonthNavbar selected={selectedMonth} onChange={(m) => setSelectedMonth(m)} />
      </div>
      <div className="grid grid-cols-4 gap-4 mb-3">
        <SummaryCard label="Current Balance" value={summary.balance} type="balance" />
        <SummaryCard label="Income" value={summary.income} type="income" />
        <SummaryCard label="Expenses" value={summary.expense} type="expense" />
        <SummaryCard label="Savings Rate" value={savingsRate} valueFormat="percentage" />
      </div>
      <div className="grid grid-cols-4 gap-4 mb-3">
        <div>
          <ExpenseDonutChart transactions={filteredTransactions} categories={categories} />
        </div>
        <div>
          <InvestmentsPieCard investments={investments.map((i: any) => ({ name: i.category || i.name, value: i.currentValue }))} />
        </div>
        <div>
          <GoalsCard />
        </div>
        <div>
          <IncomeDonutChart transactions={filteredTransactions} categories={categories} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        <div className="h-full">
          <LatestTransactions transactions={latestForDashboard} />
        </div>
        <div className="h-full">
          <YearTransactionsChart
            income={lineData.incomeSeries}
            expense={lineData.expenseSeries}
          />
        </div>
      </div>
    </main>
  );
}
