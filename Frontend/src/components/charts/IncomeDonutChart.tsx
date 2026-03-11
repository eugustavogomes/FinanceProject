import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { Transaction, Category } from "../../types/finance";

interface Props {
  transactions: Transaction[];
  categories: Category[];
}

export default function IncomeDonutChart({ transactions = [], categories = [] }: Props) {
  const incomeTransactions = transactions.filter(
    (tx: Transaction) => (typeof tx.type === 'string' ? tx.type.toLowerCase() === 'income' : tx.type === 0) && (tx.categoryId || tx.categoryName)
  );

  const categoryIncomeMap: Record<string, { name: string; value: number }> = {};
  incomeTransactions.forEach((tx: Transaction) => {
    const categoryKey = tx.categoryId || tx.categoryName;
    const categoryName = tx.categoryName || categories.find(cat => cat.id === tx.categoryId)?.name || 'Unknown';
    if (categoryKey) {
      if (!categoryIncomeMap[categoryKey]) {
        categoryIncomeMap[categoryKey] = { name: categoryName, value: 0 };
      }
      categoryIncomeMap[categoryKey].value += tx.value;
    }
  });

  const labels = Object.values(categoryIncomeMap).map(cat => cat.name);
  const series = Object.values(categoryIncomeMap).map(cat => cat.value);

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');


  if (series.length === 0 || series.every(s => s === 0)) {
    return (
      <div className="bg-white dark:bg-gray-800 text-card-foreground border border-gray-100 dark:border-gray-700 shadow-sm rounded-lg h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <h3 className="text-xl font-semibold text-foreground mb-2">Income by Category</h3>
          <p>No income data available</p>
        </div>
      </div>
    );
  }

  const options: ApexOptions = {
    chart: {
      type: 'pie',
      background: 'transparent',
      foreColor: isDark ? '#e5e7eb' : '#111827',
    },
    labels,
    colors: ['#22c55e', '#4ade80', '#a3e635', '#facc15', '#38bdf8', '#818cf8', '#f472b6', '#d1d5db'],
    legend: {
      position: 'bottom',
      labels: {
        colors: isDark ? '#e5e7eb' : '#4b5563'
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#fff']
      }
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light'
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-card-foreground border border-gray-100 dark:border-gray-700 shadow-sm rounded-lg h-full">
      <h3 className="text-xl font-semibold text-foreground mb-4 p-3">Income by Category</h3>
      <ReactApexChart options={options} series={series} type="pie" height={200} />
    </div>
  );
}
