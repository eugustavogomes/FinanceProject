import { useEffect, useState } from "react";
import { SummaryCard } from "../components/SummaryCard";
import DonutChart from "../components/DonutChart";
import LineChart from "../components/LineChart";
import { fetchDashboardSummary } from '../hooks/useDashboard';
import LatestTransactions from "../components/LatestTransactions";
import { useTransactions } from "../hooks/useTransactions";
import { useCategories } from "../hooks/useCategories";


export default function DashboardPage() {
  const [summary, setSummary] = useState({ balance: 0, income: 0, expense: 0 });
  const { transactions } = useTransactions();
  const { categories } = useCategories();

  useEffect(() => {
    fetchDashboardSummary().then(res => setSummary(res.data));
  }, []);

  return (
    <main className="p-6">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <SummaryCard label="Balance" value={summary.balance} type="balance" />
        <SummaryCard label="Income" value={summary.income} type="income" />
        <SummaryCard label="Expenses" value={summary.expense} type="expense" />
      </div>
      <div className="flex w-full gap-4 mb-4">
        <div className="flex-[1]">
          <DonutChart transactions={transactions} categories={categories} />
        </div>
        <div className="flex-[4] max-w-[1000px]">
          <LineChart
            income={[1200, 1100, 1300, 1250, 1400, 1500, 1600, 1550, 1700, 1800, 1750, 1900]}
            expense={[800, 900, 950, 1000, 1100, 1050, 1200, 1150, 1300, 1350, 1400, 1450]}
          />
        </div>
      </div>
      <LatestTransactions />
    </main>
  );
}
