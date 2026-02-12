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
    fetch('http://localhost:5022/api/transactions')
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((tx: any) => ({
          id: tx.id,
          categoria: tx.category?.name || '',
          tipo: tx.type,
          valor: tx.value,
          data: new Date(tx.date).toLocaleDateString('pt-BR')
        }));
        setTransactions(mapped);
      });
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