import { useMemo } from 'react';
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

type Props = {
    income: number[];
    expense: number[];
    months?: string[];
    height?: number;
}

/**
 * YearTransactionsChart
 * Enhanced area chart showing income and expenses over the last 12 periods.
 * Improvements applied:
 * - Smooth curves with gradient fill
 * - Markers and hover states
 * - Tooltip and Y axis formatted as BRL currency
 * - Memoized `options` and `series` for performance
 * - Empty state rendering when no data
 */
export default function YearTransactionsChart({ income, expense, months, height = 240 }: Props) {
    const defaultMonths = useMemo(() => Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (11 - i));
        return date.toLocaleString('en-US', { month: 'short' });
    }), []);

    const labels = months && months.length ? months : defaultMonths;

    // Normalize arrays to length of labels (fill missing with zeros)
    const normalizedIncome = useMemo(() => {
        const out = labels.map((_, idx) => (income && income[idx] != null ? income[idx] : 0));
        return out;
    }, [income, labels]);

    const normalizedExpense = useMemo(() => {
        const out = labels.map((_, idx) => (expense && expense[idx] != null ? expense[idx] : 0));
        return out;
    }, [expense, labels]);

    const hasData = normalizedIncome.some(v => v !== 0) || normalizedExpense.some(v => v !== 0);

    const series = useMemo(() => [
        { name: 'Income', data: normalizedIncome },
        { name: 'Expenses', data: normalizedExpense }
    ], [normalizedIncome, normalizedExpense]);

    const currencyFormatter = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

    const abbreviate = (num: number) => {
        const abs = Math.abs(num);
        if (abs >= 1_000_000) return `R$ ${+(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
        if (abs >= 1_000) return `R$ ${+(num / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
        return currencyFormatter(num);
    };

    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

    const options: ApexOptions = useMemo(() => ({
        chart: {
            type: 'area',
            background: 'transparent',
            foreColor: isDark ? '#e5e7eb' : '#111827',
            toolbar: { show: false },
        },
        grid: { show: false, borderColor: isDark ? '#374151' : '#e5e7eb' },
        stroke: { curve: 'smooth', width: 2 },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                type: 'vertical',
                shadeIntensity: 0.5,
                gradientToColors: undefined,
                inverseColors: false,
                opacityFrom: 0.6,
                opacityTo: 0.08,
                stops: [0, 90, 100]
            }
        },
        markers: { size: 4, hover: { size: 6 } },
        xaxis: { categories: labels, labels: { style: { colors: isDark ? '#9ca3af' : '#4b5563' } } },
        yaxis: {
            labels: {
                formatter: (val: number) => abbreviate(Number(val)),
                style: { colors: isDark ? '#9ca3af' : '#4b5563' }
            }
        },
        tooltip: {
            theme: isDark ? 'dark' : 'light',
            y: {
                formatter: (val: number) => abbreviate(Number(val))
            }
        },
        colors: ['#16a34a', '#ef4444'],
        legend: { position: 'top', horizontalAlign: 'right', labels: { colors: isDark ? '#e5e7eb' : '#374151' } },
        dataLabels: { enabled: false },
        responsive: [{
            breakpoint: 640,
            options: { chart: { toolbar: { show: false } }, legend: { position: 'bottom' } }
        }]
    }), [labels, isDark]);

    if (!hasData) {
        return (
            <div className="bg-white dark:bg-gray-800 text-card-foreground border border-gray-100 dark:border-gray-700 shadow-sm rounded-lg p-6 h-full flex flex-col items-center justify-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">Income and Expenses - Last 12 Months</h3>
                <p className="text-sm text-muted-foreground mb-4">No data available for the selected period</p>
                <div className="flex gap-2">
                    <button className="px-3 py-2 bg-green-600 text-white rounded-md">Add transaction</button>
                    <button className="px-3 py-2 border border-border rounded-md text-foreground">View transactions</button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 text-card-foreground border border-gray-100 dark:border-gray-700 shadow-sm rounded-lg p-4 h-full w-full">
            <h3 className="text-xl font-semibold text-foreground mb-2">Income and Expenses - Last 12 Months</h3>
            <ReactApexChart options={options} series={series} type="area" height={height} />
        </div>
    );
}