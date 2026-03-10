export function getMonthsUntil(year: number, month: number) {
  const now = new Date();
  const currentMonthIndex = now.getMonth() + 1; // 1-12
  const currentYear = now.getFullYear();
  const totalCurrent = currentYear * 12 + currentMonthIndex;
  const totalTarget = year * 12 + month;
  const diff = totalTarget - totalCurrent;
  return diff < 0 ? 0 : diff;
}

export function calculateAverageMonthlyNet(transactions: any[], monthsBack = 6) {
  if (!transactions.length) return 0;

  const now = new Date();
  const monthNets: number[] = [];

  for (let i = 0; i < monthsBack; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth();

    const monthly = transactions.filter((tx: any) => {
      const d = new Date(tx.date);
      if (isNaN(d.getTime())) return false;
      return d.getFullYear() === year && d.getMonth() === month;
    });

    if (!monthly.length) continue;

    const income = monthly
      .filter((t: any) => (typeof t.type === 'string' ? t.type.toLowerCase() === 'income' : t.type === 0))
      .reduce((s: number, t: any) => s + (t.value || 0), 0);

    const expense = monthly
      .filter((t: any) => (typeof t.type === 'string' ? t.type.toLowerCase() === 'expense' : t.type === 1))
      .reduce((s: number, t: any) => s + (t.value || 0), 0);

    monthNets.push(income - expense);
  }

  if (!monthNets.length) return 0;
  const sum = monthNets.reduce((a, b) => a + b, 0);
  return sum / monthNets.length;
}

export function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
