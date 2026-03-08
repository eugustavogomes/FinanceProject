import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

type Props = {
    income: number[];
    expense: number[];
    months?: string[];
}

export default function LineChart({ income, expense, months }: Props) {
    const defaultMonths = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (11 - i));
        return date.toLocaleString('pt-BR', { month: 'short' });
    });
    const labels = months || defaultMonths;

    const series = [
        {
            name: 'Income',
            data: income
        },
        {
            name: 'Expenses',
            data: expense
        }
    ];

    const options: ApexOptions = {
                grid: {
                    show: false
                },
        yaxis: {
            labels: {
                show: false
            }
        },
        chart: {
            type: 'area',
            background: 'transparent',
            toolbar: {
                show: false
            },
        },
        xaxis: {
            categories: labels,
            labels: {
                style: {
                    colors: '#000'
                },
            }
        },
        stroke: {
            show: true,
        },
        colors: ['#22c55e', '#ef4444'],
        legend: {
            position: 'bottom',
            labels: {
                colors: '#000'
            }
        },
        dataLabels: {
            enabled: false
        },
        tooltip: {
            theme: 'dark'
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 h-full w-max-full">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 p-3">Income and Expenses - Last 12 Months</h3>
            <ReactApexChart options={options} series={series} type="area" height={200} width={580}/>
        </div>
    );
}