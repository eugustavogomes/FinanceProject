import ReactApexChart from "react-apexcharts";

type Props = {
  receita: number;
  despesa: number;
}

export default function FinanceChart({ receita, despesa }: Props) {
  const series = [receita, despesa];

  const options = {
    chart: {
      type: 'donut',
    },
    labels: ['Receita', 'Despesa'],
    colors: ['#22c55e', '#ef4444'],
    legend: {
      position: 'bottom'
    },
    dataLabels: {
      enabled: true
    },
  };

  return (
    <div className="bg-white shadow rounded p-4">
      <ReactApexChart series={series} type="donut" width={320} />
    </div>
  );
}