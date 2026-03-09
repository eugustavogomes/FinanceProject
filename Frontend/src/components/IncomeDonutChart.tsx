import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

interface Props {
  transactions: any[];
  categories: any[];
}

export default function IncomeDonutChart({ transactions = [], categories = [] }: Props) {
  const incomeTransactions = transactions.filter(
    (tx: any) => tx.type === 0 && (tx.categoryId || tx.categoryName)
  );

  const categoryIncomeMap: Record<string, { name: string; value: number }> = {};
  incomeTransactions.forEach((tx: any) => {
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


  if (series.length === 0 || series.every(s => s === 0)) {
    return (
      <div className="bg-white border border-gray-100 shadow-sm rounded-lg h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Income by Category</h3>
          <p>No income data available</p>
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
    colors: ['#22c55e', '#4ade80', '#a3e635', '#facc15', '#38bdf8', '#818cf8', '#f472b6', '#d1d5db'],
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
    <div className="bg-white border border-gray-100 shadow-sm rounded-lg h-full">
      <h3 className="text-xl font-semibold text-gray-700 mb-4 p-3">Income by Category</h3>
      <ReactApexChart options={options} series={series} type="pie" height={200} />
    </div>
  );
}
