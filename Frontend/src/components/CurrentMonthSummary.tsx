import React from "react";

interface Props {
  transactions: any[];
}

export default function CurrentMonthSummary({ transactions = [] }: Props) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthTransactions = transactions.filter((tx: any) => {
    const txDate = new Date(tx.date);
    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
  });

  const income = monthTransactions
    .filter((tx: any) => tx.type === 0)
    .reduce((sum: number, tx: any) => sum + tx.value, 0);

  const expense = monthTransactions
    .filter((tx: any) => tx.type === 1)
    .reduce((sum: number, tx: any) => sum + tx.value, 0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center min-w-[200px]">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Current Month</h3>
      <div className="flex flex-col gap-2">
        <div>
          <span className="text-green-600 font-bold">Income:</span>
          <span className="ml-2 text-gray-700">R$ {income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
        <div>
          <span className="text-red-600 font-bold">Expense:</span>
          <span className="ml-2 text-gray-700">R$ {expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
}
