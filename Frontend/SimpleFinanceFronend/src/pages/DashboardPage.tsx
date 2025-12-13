import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SummaryCard } from "../components/SummaryCard";
import Header from "../components/Header";
import FinanceChart from "../components/Chart";

type Transaction = {
  id: number;
  categoria: string;
  tipo: string;
  valor: number;
  data: string;
};
export default function DashboardPage() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState({ balance: 0, income: 0, expense: 0 });

  useEffect(() => {
    setSummary({ balance: 1200, income: 2000, expense: 800 });
    setTransactions([
      {
        id: 1,
        categoria: "Salary",
        tipo: "Income",
        valor: 2000,
        data: "01/12/2025",
      },
      {
        id: 2,
        categoria: "Food",
        tipo: "Expense",
        valor: 200,
        data: "04/12/2025",
      },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <div className="grid grid-cols-3 gap-4 mb-8 p-4">
        <SummaryCard label="Balance" value={summary.balance} type="balance" />
        <SummaryCard label="Income" value={summary.income} type="income" />
        <SummaryCard label="Expenses" value={summary.expense} type="expense" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Latest Transactions</h3>
            <button
              className="btn btn-primary px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full transition text-sm"
              onClick={() => navigate('/transactions')}
            >
              View all
            </button>
          </div>

          <ul className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4">
            {transactions.map((t) => (
              <li key={t.id} className="mb-2 border-b border-white/5 pb-2 last:border-0">
                <div className="flex justify-between">
                  <div>
                    <strong className="text-white">{t.categoria}</strong>
                    <div className="text-sm text-gray-400">{t.data}</div>
                  </div>
                  <div className="font-medium text-gray-300">{t.valor}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <FinanceChart income={summary.income} expense={summary.expense} />
        </div>
      </div>
    </div>
  );
}
