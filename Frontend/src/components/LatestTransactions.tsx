import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchLatestTransactions } from "../hooks/useTransactions";

type Transaction = {
    id: number;
    category: string;
    type: number;
    value: number;
    date: string;
    description?: string;
};

export default function LatestTransactions() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetchLatestTransactions().then(res => {
            const mapped = res.data.slice(0, 6).map((tx: any) => ({
                id: tx.id,
                category: tx.categoryName || tx.category?.name || 'No category',
                type: tx.type,
                value: tx.value,
                date: new Date(tx.date).toLocaleDateString('pt-BR'),
                description: tx.description || ''
            }));
            setTransactions(mapped);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    return (
        <div className="p-2 bg-white backdrop-blur-sm rounded-lg border border-gray-200 h-full">
            <ul className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 px-3 py-2">
                {loading ? (
                    <li className="py-3 text-center">
                        <span className="inline-block animate-spin rounded-full border-4 border-gray-300 border-t-green-500 h-8 w-8"></span>
                    </li>
                ) : transactions.map((t) => (
                    <li key={t.id} className="mb-2 border-white/5 pb-2 border-b last:border-0 cursor-pointer hover:bg-gray-50 rounded transition" onClick={() => navigate(`/transactions/${t.id}`)}>
                        <div className="grid items-center gap-4" style={{ gridTemplateColumns: '1fr 400px 120px' }}>
                            <div className="min-w-0">
                                <strong className="block text-gray-800 truncate">{t.category}</strong>
                            </div>
                            <div className="text-sm text-gray-500 text-center">
                                <div className="truncate">{t.date}</div>
                            </div>
                            <div className={`font-semibold text-right truncate ${t.type === 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {t.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </div>
                        </div>

                    </li>
                ))}
            </ul>
            <div className="p-2 flex justify-end">
            <button
                className="btn btn-primary"
                onClick={() => navigate('/transactions')}
            >
                View all
            </button>
            </div>
        </div>
    );
}