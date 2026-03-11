export function parseCurrencyInput(value: string): number {
  const digits = value.replace(/\D/g, '');
  if (!digits) return 0;
  return Number(digits) / 100;
}

export function formatCurrencyInput(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  const numeric = Number(digits) / 100;
  return numeric.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
