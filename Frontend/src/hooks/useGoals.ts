import { useEffect, useState, useCallback, useRef } from 'react';
import api from '../services/api';
import { GOAL_URL } from '../services/endpoints';

export interface Goal {
  id: number;
  target: number;
  category?: string | null;
  month: number;
  year: number;
}

export interface GoalInput {
  target: number;
  category?: string;
  month: number;
  year: number;
}

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);

  const fetchGoals = useCallback(() => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);

    api.get(GOAL_URL)
      .then((res) => {
        setGoals(res.data || []);
        setError(null);
      })
      .catch((err) => {
        console.error('Erro ao buscar metas:', err);
        setError(err?.response?.data || 'Erro ao buscar metas');
      })
      .finally(() => {
        setLoading(false);
        isFetchingRef.current = false;
      });
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const createGoal = useCallback(async (data: GoalInput) => {
    try {
      await api.post(GOAL_URL, data);
      fetchGoals();
      return { success: true };
    } catch (err: any) {
      console.error('Erro ao criar meta:', err);
      return { success: false, error: err?.response?.data || 'Erro ao criar meta' };
    }
  }, [fetchGoals]);

  const updateGoal = useCallback(async (id: number, data: GoalInput) => {
    try {
      await api.put(`${GOAL_URL}/${id}`, data);
      fetchGoals();
      return { success: true };
    } catch (err: any) {
      console.error('Erro ao atualizar meta:', err);
      return { success: false, error: err?.response?.data || 'Erro ao atualizar meta' };
    }
  }, [fetchGoals]);

  const deleteGoal = useCallback(async (id: number) => {
    try {
      await api.delete(`${GOAL_URL}/${id}`);
      fetchGoals();
      return { success: true };
    } catch (err: any) {
      console.error('Erro ao remover meta:', err);
      return { success: false, error: err?.response?.data || 'Erro ao remover meta' };
    }
  }, [fetchGoals]);

  return {
    goals,
    loading,
    error,
    refetch: fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
  };
}
