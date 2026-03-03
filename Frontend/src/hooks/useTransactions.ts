import { useEffect, useState } from 'react';
import api from '../services/api';
import { TRANSACTION_URL } from '../services/endpoints';

export function useTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get(TRANSACTION_URL)
      .then(response => setTransactions(response.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { transactions, loading, error };
}
