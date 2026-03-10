export type TransactionType = 'Income' | 'Expense';

export interface Transaction {
  id: string;
  value: number;
  date: string;
  description?: string;
  type: TransactionType | string;
  categoryId: string | null;
  categoryName?: string | null;
}

export interface Category {
  id: string;
  name: string;
  isActive: boolean;
  type: TransactionType | string;
  userId: string;
  user: any | null;
  transactions: any | null;
}
