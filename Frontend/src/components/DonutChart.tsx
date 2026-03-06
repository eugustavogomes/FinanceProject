import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";


// chage to expenses by category later
type Props = {
  income: number;
  expense: number;
}

export default function DonutChart({ income, expense }: Props) {
  const series = [income, expense];

  const options: ApexOptions = {
    chart: {
      type: 'donut',
      background: 'transparent',
    },
    labels: ['Income', 'Expenses'],
    colors: ['#22c55e', '#ef4444'],
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