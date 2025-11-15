
import React from 'react';

interface ChartData {
  label: string;
  value: number;
}

interface SalesChartProps {
  data: ChartData[];
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  const formatRupiahSimple = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}jt`;
    }
    if (value >= 1000) {
      return `${Math.round(value / 1000)}rb`;
    }
    return value;
  };
  
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-grow flex items-end gap-2 sm:gap-4 relative pt-4">
        {/* Y-Axis Line */}
        <div className="absolute top-0 bottom-6 left-0 w-px bg-neutral-200"></div>
        
        {/* Y-Axis Labels */}
        <div className="absolute top-0 -left-1 -translate-x-full h-full flex flex-col justify-between text-right pr-2 text-xs text-neutral-500">
          <span>{formatRupiahSimple(maxValue)}</span>
          <span>{formatRupiahSimple(maxValue / 2)}</span>
          <span className="pb-6">{formatRupiahSimple(0)}</span>
        </div>
        
        {data.map((item, index) => {
          const barHeight = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          return (
            <div key={index} className="flex-1 flex flex-col items-center group relative h-full justify-end">
              {/* Tooltip */}
              <div className="absolute -top-1 mb-2 w-max px-2 py-1 bg-neutral-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none transform -translate-x-1/2 left-1/2">
                {formatRupiah(item.value)}
              </div>
              
              {/* Bar */}
              <div
                className="w-full bg-primary/20 hover:bg-primary/40 rounded-t-md transition-colors duration-300"
                style={{ height: `${barHeight}%` }}
              ></div>
            </div>
          );
        })}
      </div>
      
      {/* X-Axis Line */}
      <div className="w-full h-px bg-neutral-200 mt-2"></div>

      {/* X-Axis Labels */}
      <div className="flex items-center gap-2 sm:gap-4 mt-1">
        {data.map((item, index) => (
          <div key={index} className="flex-1 text-center text-xs font-medium text-neutral-500">
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesChart;
