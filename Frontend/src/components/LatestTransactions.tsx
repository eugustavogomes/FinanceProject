import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchLatestTransactions } from "../hooks/useTransactions";
import { Eye, ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';

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
            const mapped = res.data.slice(0, 4).map((tx: any) => ({
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
        <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm shadow-sm h-full flex flex-col">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Latest Transactions</h3>
                    <p className="text-sm text-gray-500">Recent activity from your account</p>
                </div>
                <div className="text-sm text-gray-500">{loading ? 'Loading...' : `${transactions.length} shown`}</div>
            </div>

            <div className="flex-1 overflow-auto">
                <ul className="space-y-2">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <li key={i} className="animate-pulse p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-gray-200 rounded-full" />
                                    <div className="flex-1">
                                        <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                                        <div className="h-2 bg-gray-200 rounded w-1/2" />
                                    </div>
                                    <div className="h-3 bg-gray-200 rounded w-20" />
                                </div>
                            </li>
                        ))
                    ) : transactions.length === 0 ? (
                        <li className="p-6 text-center text-gray-500">
                            <p className="mb-3">No recent transactions</p>
                            <div className="flex items-center justify-center gap-2">
                                <button onClick={() => navigate('/transactions/new')} className="px-3 py-2 bg-green-600 text-white rounded-md">Add transaction</button>
                                <button onClick={() => navigate('/transactions')} className="px-3 py-2 border rounded-md">View all</button>
                            </div>
                        </li>
                    ) : (
                        transactions.map((t) => (
                            <li key={t.id}>
                                <button onClick={() => navigate(`/transactions/${t.id}`)} className="w-full text-left p-1 flex items-center gap-3 hover:bg-gray-50 rounded-lg transition">
                                    <div className={`flex items-center justify-center h-5 w-5 rounded-full ${t.type === 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                                        {t.type === 0 ? <ArrowUp className="text-green-600" /> : <ArrowDown className="text-red-600" />}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center justify- gap-4">
                                            <strong className="text-gray-800 truncate">{t.category}</strong>
                                            <div className="text-xs text-gray-500 flex items-center">
                                                <span className="whitespace-nowrap">{t.date}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className={`font-semibold ${t.type === 0 ? 'text-green-600' : 'text-red-600'} text-right`}>{t.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                                        <ChevronRight className="w-4 h-4 text-gray-300" />
                                    </div>
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            <div className="mt-4 flex justify-end">
                <button
                    className="px-3 py-2 gap-2 rounded-lg bg-green-600 text-white text-sm flex items-center font-semibold"
                    onClick={() => navigate('/transactions')}
                >
                    <Eye className="w-4 h-4" />
                    View all
                </button>
            </div>
        </div>
    );
}