import { useCallback, useEffect, useRef, useState } from 'react';
import api from '../services/api';
import { INVESTMENT_URL } from '../services/endpoints';

export interface Investment {
  id: string;
  name: string;
  category?: string | null;
  currentValue: number;
  investedAmount: number;
  expectedReturnYearly?: number | null;
}

export interface InvestmentInput {
  name: string;
  category?: string;
  currentValue: number;
  investedAmount: number;
  expectedReturnYearly?: number | null;
}

export function useInvestments() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);

  const fetchInvestments = useCallback(() => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);

    api.get(INVESTMENT_URL)
      .then((res) => {
        setInvestments(res.data || []);
        setError(null);
      })
      .catch((err) => {
        console.error('Erro ao buscar investimentos:', err);
        setError(err?.response?.data || 'Erro ao buscar investimentos');
      })
      .finally(() => {
        setLoading(false);
        isFetchingRef.current = false;
      });
  }, []);

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  const createInvestment = useCallback(async (data: InvestmentInput) => {
    try {
      await api.post(INVESTMENT_URL, data);
      fetchInvestments();
      return { success: true };
    } catch (err: any) {
      console.error('Erro ao criar investimento:', err);
      return { success: false, error: err?.response?.data || 'Erro ao criar investimento' };
    }
  }, [fetchInvestments]);

  const updateInvestment = useCallback(async (id: string, data: InvestmentInput) => {
    try {
      await api.put(`${INVESTMENT_URL}/${id}`, data);
      fetchInvestments();
      return { success: true };
    } catch (err: any) {
      console.error('Erro ao atualizar investimento:', err);
      return { success: false, error: err?.response?.data || 'Erro ao atualizar investimento' };
    }
  }, [fetchInvestments]);

  const deleteInvestment = useCallback(async (id: string) => {
    try {
      await api.delete(`${INVESTMENT_URL}/${id}`);
      fetchInvestments();
      return { success: true };
    } catch (err: any) {
      console.error('Erro ao remover investimento:', err);
      return { success: false, error: err?.response?.data || 'Erro ao remover investimento' };
    }
  }, [fetchInvestments]);

  return {
    investments,
    loading,
    error,
    refetch: fetchInvestments,
    createInvestment,
    updateInvestment,
    deleteInvestment,
  };
}
