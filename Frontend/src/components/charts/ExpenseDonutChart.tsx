import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { Transaction, Category } from "../../types/finance";

type Props = {
  transactions: Transaction[];
  categories: Category[];
};

export default function ExpenseDonutChart({ transactions = [], categories = [] }: Props) {

  const expenseTransactions = transactions.filter(
    (tx: Transaction) => (typeof tx.type === 'string' ? tx.type.toLowerCase() === 'expense' : tx.type === 1) && (tx.categoryId || tx.categoryName)
  );

  const categoryExpenseMap: Record<string, { name: string; value: number }> = {};
  expenseTransactions.forEach((tx: Transaction) => {
    const categoryKey = tx.categoryId || tx.categoryName;
    const categoryName = tx.categoryName || categories.find(cat => cat.id === tx.categoryId)?.name || 'Unknown';
    
    if (categoryKey) {
      if (!categoryExpenseMap[categoryKey]) {
        categoryExpenseMap[categoryKey] = { name: categoryName, value: 0 };
      }
      categoryExpenseMap[categoryKey].value += tx.value;
    }
  });


  const labels = Object.values(categoryExpenseMap).map(cat => cat.name);
  const series = Object.values(categoryExpenseMap).map(cat => cat.value);

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  
  if (series.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 text-card-foreground border border-gray-100 dark:border-gray-700 rounded-lg h-full flex items-center justify-center shadow-sm">
        <div className="text-center text-muted-foreground">
          <h3 className="text-xl font-semibold text-foreground mb-2">Expenses by Category</h3>
          <p>No expense data available</p>
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
    colors: ['#ef4444', '#599d9b', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6', '#d1d5db'],
    legend: {
      position: 'bottom',
      labels: {
        colors: isDark ? '#e5e7eb' : '#4b5563'
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: [isDark ? '#020617' : '#ffffff']
      }
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light'
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-card-foreground border border-gray-100 dark:border-gray-700 shadow-sm rounded-lg h-full">
      <h3 className="text-xl font-semibold text-foreground mb-4 p-3">Expenses by Category</h3>
      <ReactApexChart options={options} series={series} type="pie" height={200} />
    </div>
  );
}