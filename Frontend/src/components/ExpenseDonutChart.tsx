import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

type Props = {
  transactions: any[];
  categories: any[];
};

export default function ExpenseDonutChart({ transactions = [], categories = [] }: Props) {
  console.log('DonutChart - transactions:', transactions);
  console.log('DonutChart - categories:', categories);

  const expenseTransactions = transactions.filter(
    (tx: any) => tx.type === 1 && (tx.categoryId || tx.categoryName)
  );
  
  console.log('DonutChart - expenseTransactions:', expenseTransactions);

  const categoryExpenseMap: Record<string, { name: string; value: number }> = {};
  expenseTransactions.forEach((tx: any) => {
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
  
  if (series.length === 0 || series.every(s => s === 0)) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Expenses by Category</h3>
          <p>No expense data available</p>
        </div>
      </div>
    );
  }

  const options: ApexOptions = {
    chart: {
      type: 'pie',
      background: 'transparent',
    },
    labels,
    colors: ['#ef4444', '#599d9b', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6', '#d1d5db'],
    legend: {
      position: 'bottom',
      labels: {
        colors: '#000'
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#fff']
      }
    },
    tooltip: {
      theme: 'dark'
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg h-full">
      <h3 className="text-xl font-semibold text-gray-700 mb-4 p-3">Expenses by Category</h3>
      <ReactApexChart options={options} series={series} type="pie" height={200} />
    </div>
  );
}