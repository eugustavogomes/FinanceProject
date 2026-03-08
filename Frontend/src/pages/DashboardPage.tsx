import { useEffect, useState } from "react";
import { SummaryCard } from "../components/SummaryCard";
import IncomeDonutChart from "../components/IncomeDonutChart";
import YearTransactionsChart from "../components/YearTransactionsChart";
import { fetchDashboardSummary } from '../hooks/useDashboard';
import LatestTransactions from "../components/LatestTransactions";
import { useTransactions } from "../hooks/useTransactions";
import { useCategories } from "../hooks/useCategories";
import ExpenseDonutChart from "../components/ExpenseDonutChart";
import MonthNavbar from "../components/MonthNavbar";
import InvestmentsPieCard from "../components/InvestmentsPieCard";
import GoalsCard from "../components/GoalsCard";


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
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const lineData = selectedMonth === 'all' ? getMonthlySeries() : getDailySeriesForMonth(selectedMonth as number);


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
      const income = monthly.filter((t: any) => t.type === 0).reduce((s: number, t: any) => s + t.value, 0);
      const expense = monthly.filter((t: any) => t.type === 1).reduce((s: number, t: any) => s + t.value, 0);
      incomeSeries.push(income);
      expenseSeries.push(expense);
    }
    return { incomeSeries, expenseSeries, months };
  }

  /**
   * getDailySeriesForMonth
   * Build income/expense series for each day of the provided month index.
   * - Uses `filteredTransactions` which already applies the selected month
   *   filter.
   * - Returns `{ incomeSeries, expenseSeries, days }`.
   */
  function getDailySeriesForMonth(monthIndex: number) {
    const now = new Date();
    const year = now.getFullYear();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const incomeSeries: number[] = [];
    const expenseSeries: number[] = [];
    const days: string[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(String(d));
      const dayTotal = filteredTransactions.filter((tx: any) => {
        const dt = new Date(tx.date);
        return dt.getFullYear() === year && dt.getMonth() === monthIndex && dt.getDate() === d;
      });
      const income = dayTotal.filter((t: any) => t.type === 0).reduce((s: number, t: any) => s + t.value, 0);
      const expense = dayTotal.filter((t: any) => t.type === 1).reduce((s: number, t: any) => s + t.value, 0);
      incomeSeries.push(income);
      expenseSeries.push(expense);
    }
    return { incomeSeries, expenseSeries, days };
  }

  return (
    <main className="p-4">
      <div className="mb-3 flex items-center justify-center">
        <MonthNavbar selected={selectedMonth} onChange={(m) => setSelectedMonth(m)} />
      </div>
      <div className="grid grid-cols-4 gap-4 mb-3">
        <SummaryCard label="Current Balance" value={summary.balance} type="balance" />
        <SummaryCard label="Income" value={summary.income} type="income" />
        <SummaryCard label="Expenses" value={summary.expense} type="expense" />
        <SummaryCard label="Transactions" value={transactions.length} type="" />
      </div>
      <div className="grid grid-cols-4 gap-4 mb-3">
        <div>
          <ExpenseDonutChart transactions={filteredTransactions} categories={categories} />
        </div>
        <div>
          <InvestmentsPieCard investments={[{ name: 'Stocks', value: 5000 }, { name: 'REITs', value: 3000 }, { name: 'Savings', value: 2000 }]} />
        </div>
        <div>
          <GoalsCard progress={45} title="Goals" />
        </div>
        <div>
          <IncomeDonutChart transactions={filteredTransactions} categories={categories} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        <div className="h-full">
          <LatestTransactions />
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
