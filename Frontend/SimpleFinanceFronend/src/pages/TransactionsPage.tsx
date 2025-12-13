import { useState, useEffect } from 'react'
import Header from '../components/Header'

interface Transaction {
  id: string | number;
  categoria: string;
  tipo: string;
  valor: number;
  data: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    setTransactions([
      { id: 1, categoria: 'Salary', tipo: 'Income', valor: 5000, data: '01/12/2025' },
      { id: 2, categoria: 'Rent', tipo: 'Expense', valor: 1500, data: '05/12/2025' },
      { id: 3, categoria: 'Food', tipo: 'Expense', valor: 800, data: '10/12/2025' },
    ])
  }, [])

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-white">Transactions</h2>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow-lg border border-white/10 p-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 text-white">Category</th>
                <th className="text-left py-2 text-white">Type</th>
                <th className="text-right py-2 text-white">Amount</th>
                <th className="text-right py-2 text-white">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-2 text-gray-300">{tx.categoria}</td>
                  <td className="py-2 text-gray-300">{tx.tipo}</td>
                  <td className={`py-2 text-right font-medium ${tx.tipo === 'Income' ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="py-2 text-right text-gray-300">{tx.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

interface LatestTransactionsProps {
  transactions: Transaction[];
}

export function LatestTransactions({ transactions }: LatestTransactionsProps) {
  return (
    <div className="flex-1">
      <h3 className="font-semibold mb-2">Últimos lançamentos</h3>
      <ul>
        {transactions.map(tx => (
          <li key={tx.id} className={`flex justify-between py-2 border-b`}>
            <span>{tx.categoria} ({tx.tipo})</span>
            <span className={tx.tipo === 'Income' ? 'text-green-600':'text-red-500'}>
              {tx.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
            <span>{tx.data}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}