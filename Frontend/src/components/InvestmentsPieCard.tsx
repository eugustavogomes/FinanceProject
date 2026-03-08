import React from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { useNavigate } from 'react-router-dom';

type Investment = { name: string; value: number };

interface Props {
  investments?: Investment[];
}

export default function InvestmentsPieCard({ investments = [] }: Props) {
  const navigate = useNavigate();

  const labels = investments.map(i => i.name);
  const series = investments.map(i => i.value);

  const options: ApexOptions = {
    chart: { type: 'donut', toolbar: { show: false } },
    labels,
    legend: { position: 'bottom' },
    tooltip: { theme: 'dark' }
  };

  const total = series.reduce((s, v) => s + v, 0);

  if (series.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 h-full flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold">Investments</h3>
          <p className="text-sm text-gray-500">Nenhum investimento cadastrado</p>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={() => navigate('/investments')} className="px-3 py-1 rounded bg-green-600 text-white text-sm">Ver</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 h-full flex flex-col">
      <div>
        <h3 className="text-lg font-semibold">Investments</h3>
        <div className="text-sm text-gray-500">Total: {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
      </div>
      <div className="mt-2 flex-1">
        <ReactApexChart options={options} series={series} type="donut" height={180} />
      </div>
      <div className="mt-2 flex justify-end">
        <button onClick={() => navigate('/investments')} className="px-3 py-1 rounded bg-green-600 text-white text-sm">Ir para Investimentos</button>
      </div>
    </div>
  );
}
