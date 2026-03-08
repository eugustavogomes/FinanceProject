import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { useNavigate } from 'react-router-dom';

interface Props {
  title: string;
  value: string;
  series: number[];
  color?: string;
  route: string;
}

export default function ChartCard({ title, value, series, color = '#3182ce', route }: Props) {
  const navigate = useNavigate();

  const options: ApexOptions = {
    chart: {
      type: 'area',
      sparkline: { enabled: true },
      animations: { enabled: true }
    },
    stroke: { curve: 'smooth', width: 2 },
    colors: [color],
    tooltip: { enabled: true, theme: 'dark' }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 h-full flex flex-col justify-between">
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-xl font-semibold text-gray-800">{value}</div>
      </div>
      <div className="mt-3">
        <ReactApexChart options={options} series={[{ name: title, data: series }]} type="area" height={80} />
      </div>
      <div className="mt-3 flex justify-end">
        <button onClick={() => navigate(route)} className="px-3 py-1 rounded bg-green-600 text-white text-sm">Ver</button>
      </div>
    </div>
  );
}
