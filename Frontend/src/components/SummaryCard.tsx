import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

type Trend = {
  percent?: number;
  value?: number;
}

type SummaryCardProps = {
  label: string;
  value: number;
  type?: 'income' | 'expense' | 'balance' | string;
  trend?: Trend;
  sparklineData?: number[];
  variant?: 'compact' | 'default';
  loading?: boolean;
};

function currencyFormatter(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

function abbreviateNumber(num: number) {
  const abs = Math.abs(num);
  if (abs >= 1_000_000) return `R$ ${+(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (abs >= 1_000) return `R$ ${+(num / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return currencyFormatter(num);
}

function Sparkline({ data = [], color = '#10b981' }: { data?: number[]; color?: string }) {
  if (!data || data.length === 0) return null;
  const w = 120; const h = 36; const max = Math.max(...data); const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="inline-block">
      <polyline fill="none" stroke={color} strokeWidth={2} points={points} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SummaryCard({ label, value, type = '', trend, sparklineData, variant = 'default', loading = false }: SummaryCardProps) {
  const [displayValue, setDisplayValue] = useState<number>(value);
  const rafRef = useRef<number | null>(null);
  const prevValueRef = useRef<number>(value);

  useEffect(() => {
    const duration = 700;
    const start = performance.now();
    const from = prevValueRef.current ?? displayValue;
    const to = value;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    function step(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeInOutCubic(t);
      const next = from + (to - from) * eased;
      setDisplayValue(Number(next.toFixed(2)));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
      else prevValueRef.current = to;
    }

    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value]);

  const gradientClass = useMemo(() => {
    if (type === 'income') return 'bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent';
    if (type === 'expense') return 'bg-gradient-to-r from-red-500 to-rose-600 bg-clip-text text-transparent';
    if (type === 'balance') return 'bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent';
    return 'text-gray-700';
  }, [type]);

  if (loading) {
    return (
      <div role="status" className="rounded-xl p-4 bg-white/80 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
          <div className="h-10 bg-gray-200 rounded w-40 mb-2" />
          <div className="h-6 bg-gray-200 rounded w-full" />
        </div>
      </div>
    );
  }

  return (
    <div role="region" aria-label={label} className="rounded-xl p-4 bg-white border border-gray-100 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className={`text-sm font-medium uppercase tracking-wide mb-1 ${gradientClass}`}>{label}</div>
          <div className="flex items-center gap-3">
            <div className="text-2xl md:text-3xl font-extrabold text-gray-800" title={currencyFormatter(value)}>
              {abbreviateNumber(displayValue)}
            </div>
            {trend && typeof trend.percent === 'number' ? (
              <div className={`flex items-center text-sm font-medium ${trend.percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend.percent >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                <span className="ml-1">{Math.abs(trend.percent).toFixed(1)}%</span>
              </div>
            ) : null}
          </div>
        </div>

        {variant === 'default' && sparklineData ? (
          <div className="hidden md:block">
            <Sparkline data={sparklineData} color={type === 'expense' ? '#ef4444' : '#10b981'} />
          </div>
        ) : null}
      </div>

      {variant === 'default' && (
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-gray-500">Summary for the selected period</div>
          <div>
          </div>
        </div>
      )}
    </div>
  );
}