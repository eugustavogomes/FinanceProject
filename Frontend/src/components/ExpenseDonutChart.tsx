import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

type Props = {
  transactions: any[];
  categories: any[];
};

export default function ExpenseDonutChart({ transactions = [], categories = [] }: Props) {
  // Debug logs
  console.log('DonutChart - transactions:', transactions);
  console.log('DonutChart - categories:', categories);

  // Filter expense transactions (type 1 = Expense)
  const expenseTransactions = transactions.filter(
    (tx: any) => tx.type === 1 && (tx.categoryId || tx.categoryName)
  );
  
  console.log('DonutChart - expenseTransactions:', expenseTransactions);

  // Group expenses by category
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

  console.log('DonutChart - categoryExpenseMap:', categoryExpenseMap);

  // Extract labels and series from the map
  const labels = Object.values(categoryExpenseMap).map(cat => cat.name);
  const series = Object.values(categoryExpenseMap).map(cat => cat.value);
  
  console.log('DonutChart - labels:', labels);
  console.log('DonutChart - series:', series);

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
      type: 'donut',
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
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              color: '#9b9b9b'
            },
            value: {
              color: '#4a4747'
            },
            name: {
              color: '#000'
            }
          }
        }
      }
    },
    tooltip: {
      theme: 'dark'
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg h-full">
      <h3 className="text-xl font-semibold text-gray-700 mb-4 p-3">Expenses by Category</h3>
      <ReactApexChart options={options} series={series} type="donut" height={250} />
    </div>
  );
}