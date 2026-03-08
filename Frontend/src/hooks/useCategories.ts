import { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { CATEGORY_URL } from '../services/endpoints';

interface Category {
  id: string;
  name: string;
  type: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);

  const fetchCategories = async () => {
    if (isFetchingRef.current) return;
    
    try {
      isFetchingRef.current = true;
      setLoading(true);
      const response = await api.get(CATEGORY_URL);
      setCategories(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao carregar categorias:', err);
      setError(err?.response?.data || err.message);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  const createCategory = async (name: string, type?: string) => {
    try {
      const response = await api.post(CATEGORY_URL, { name, type });
      await fetchCategories(); 
      return response.data;
    } catch (err: any) {
      throw new Error(err?.response?.data || err.message);
    }
  };

  const updateCategory = async (id: string, name: string, type?: string) => {
    try {
      const response = await api.put(`${CATEGORY_URL}/${id}`, { name, type });
      await fetchCategories(); 
      return response.data;
    } catch (err: any) {
      throw new Error(err?.response?.data || err.message);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await api.delete(`${CATEGORY_URL}/${id}`);
      await fetchCategories(); 
    } catch (err: any) {
      throw new Error(err?.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { 
    categories, 
    loading, 
    error, 
    createCategory, 
    updateCategory, 
    deleteCategory,
    refetch: fetchCategories 
  };
}