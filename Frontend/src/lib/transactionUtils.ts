/**
 * Shared helpers for transaction and category type handling.
 * Single source of truth for "Income" vs "Expense" logic.
 */

export type TransactionTypeLabel = 'Income' | 'Expense';

/**
 * Returns true if the transaction is income (type 0 or string 'income').
 */
export function isIncomeTransaction(tx: { type?: number | string } | null | undefined): boolean {
  const rawType = tx?.type;
  if (typeof rawType === 'string') return rawType.toLowerCase() === 'income';
  return rawType === 0;
}

/**
 * Maps API type (0, 1, or string) to display label 'Income' | 'Expense'.
 */
export function getTransactionTypeLabel(rawType: number | string | null | undefined): TransactionTypeLabel | '' {
  if (rawType == null) return '';
  if (typeof rawType === 'string') return rawType === 'Expense' ? 'Expense' : 'Income';
  return rawType === 1 ? 'Expense' : 'Income';
}
