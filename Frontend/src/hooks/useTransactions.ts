import { useEffect, useState, useCallback, useRef } from 'react';
import api from '../services/api';
import { TRANSACTION_URL } from '../services/endpoints';

interface CreateTransactionDto {
  value: number;
  type: number;
  categoryId: string | null;
  date: string;
  description: string;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);

  const fetchTransactions = useCallback(() => {
    if (isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    setLoading(true);
    api.get(TRANSACTION_URL)
      .then(response => {
        setTransactions(response.data);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => {
        setLoading(false);
        isFetchingRef.current = false;
      });
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const createTransaction = useCallback(async (data: CreateTransactionDto) => {
    try {
      await api.post(TRANSACTION_URL, data);
      await fetchTransactions();
      return { success: true };
    } catch (err: any) {
      console.error('Erro ao criar transação:', err);
      return { success: false, error: err?.response?.data || 'Erro ao criar transação' };
    }
  }, [fetchTransactions]);

  const updateTransaction = useCallback(async (id: string | number, data: CreateTransactionDto) => {
    try {
      await api.put(`${TRANSACTION_URL}/${id}`, data);
      await fetchTransactions();
      return { success: true };
    } catch (err: any) {
      console.error('Erro ao editar transação:', err);
      return { success: false, error: err?.response?.data || 'Erro ao editar transação' };
    }
  }, [fetchTransactions]);

  const deleteTransaction = useCallback(async (id: string | number) => {
    try {
      await api.delete(`${TRANSACTION_URL}/${id}`);
      await fetchTransactions();
      return { success: true };
    } catch (err: any) {
      console.error('Erro ao deletar transação:', err);
      return { success: false, error: err?.response?.data || 'Erro ao deletar transação' };
    }
  }, [fetchTransactions]);

  return { 
    transactions, 
    loading, 
    error, 
    refetch: fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction
  };
}

export async function fetchLatestTransactions() {
  return api.get(TRANSACTION_URL);
}
