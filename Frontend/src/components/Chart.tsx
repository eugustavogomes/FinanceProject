import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

type Props = {
  income: number;
  expense: number;
}

export default function FinanceChart({ income, expense }: Props) {
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
        colors: ['#898989']
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
              color: '#9b9b9b'
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
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Financial Distribution</h3>
      <ReactApexChart options={options} series={series} type="donut" width="100%" />
    </div>
  );
}