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
        colors: '#fff'
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
              color: '#fff'
            },
            value: {
              color: '#fff'
            },
            name: {
              color: '#fff'
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
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Financial Distribution</h3>
      <ReactApexChart options={options} series={series} type="donut" width="100%" />
    </div>
  );
}