import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { SummaryCard } from "../components/SummaryCard";
import { LatestTransactions } from "./TransactionsPage";
import { Chart } from "../components/Chart";
import Header from "../components/Header";

type Transaction = {
  id: number;
  categoria: string;
  tipo: string;
  valor: number;
  data: string;
};
export default function DashboardPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState({ saldo: 0, receita: 0, despesa: 0 });

  function handleLogout() {
    logout();
    navigate("/login");
  }

  useEffect(() => {
    setSummary({ saldo: 1200, receita: 2000, despesa: 800 });
    setTransactions([
      {
        id: 1,
        categoria: "Salário",
        tipo: "Receita",
        valor: 2000,
        data: "01/12/2025",
      },
      {
        id: 2,
        categoria: "Alimentação",
        tipo: "Despesa",
        valor: 200,
        data: "04/12/2025",
      },
    ]);
  }, []);

 return (
    <div>
      <Header />
      <div className="grid grid-cols-3 gap-4 mb-8 p-4">
        <SummaryCard label="Saldo" value={summary.saldo} type={""} />
        <SummaryCard label="Receitas" value={summary.receita} type="receita" />
        <SummaryCard label="Despesas" value={summary.despesa} type="despesa" />
      </div>
      <div className="flex gap-8 p-4">
        <Chart receita={summary.receita} despesa={summary.despesa} />
        <LatestTransactions transactions={transactions} />
      </div>
    </div>
  );
}
