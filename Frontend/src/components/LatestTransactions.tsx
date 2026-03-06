import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchLatestTransactions } from "../hooks/useDashboard";

type Transaction = {
    id: number;
    categoria: string;
    tipo: string;
    valor: number;
    data: string;
};

export default function LatestTransactions() {
    useEffect(() => {
        fetchLatestTransactions().then(res => {
            const mapped = res.data.slice(0, 5).map((tx: any) => ({
                id: tx.id,
                categoria: tx.category?.name || '',
                tipo: tx.type,
                valor: tx.value,
                data: new Date(tx.date).toLocaleDateString('pt-BR')
            }));
            setTransactions(mapped);

        });
    }, []);
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    return (
        <div>
            <div className="flex  items-center mb-4">
                <h3 className="text-xl font-semibold">Latest Transactions</h3>
                <button
                    className="btn btn-primary p-2 bg-green-600 hover:bg-green-700 text-white rounded-full transition text-md"
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
                                <strong>{t.categoria}</strong>
                                <div className="text-sm text-gray-400">{t.data}</div>
                            </div>
                            <div className="font-medium text-gray-300">{t.valor}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}