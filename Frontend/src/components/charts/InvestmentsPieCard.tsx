import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

type Investment = { name: string; value: number };

interface Props {
  investments?: Investment[];
}

export default function InvestmentsPieCard({ investments = [] }: Props) {
  const navigate = useNavigate();

  const labels = investments.map(i => i.name);
  const series = investments.map(i => i.value);
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  const options: ApexOptions = {
    chart: { type: 'donut', toolbar: { show: false }, background: 'transparent', foreColor: isDark ? '#e5e7eb' : '#111827' },
    labels,
    legend: { position: 'bottom', labels: { colors: isDark ? '#e5e7eb' : '#4b5563' } },
    tooltip: { theme: isDark ? 'dark' : 'light' }
  };


  if (series.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 text-card-foreground border border-gray-100 dark:border-gray-700 shadow-sm rounded-lg p-4 h-full flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Investments</h3>
          <p className="text-sm text-muted-foreground">Nenhum investimento cadastrado</p>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={() => navigate('/investments')} className="px-3 py-1 rounded bg-green-600 text-white text-sm flex items-center">
            Investments
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 text-card-foreground border border-gray-100 dark:border-gray-700 shadow-sm rounded-lg p-3 h-full flex flex-col">
      <div>
        <h3 className="text-xl font-semibold text-foreground">Investments</h3>
      </div>
      <div className="mt-2 flex-1">
        <ReactApexChart options={options} series={series} type="donut" height={180} />
      <div className="mt-4 flex justify-end">
        <button onClick={() => navigate('/investments')} className="px-2 py-1 rounded bg-green-600 text-white text-sm flex items-center">
          Investments
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
      </div>
    </div>
  );
}
