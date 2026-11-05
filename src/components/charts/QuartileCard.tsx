import React from 'react';
import { QuartileData } from '../../types/dashboard';

interface QuartileCardProps {
  data: QuartileData;
}

export const QuartileCard: React.FC<QuartileCardProps> = ({ data }) => {
  // Normalize current position on a scale from minScale to maxScale
  const minScale = Math.min(data.q1 * 0.8, 0);
  const maxScale = Math.max(data.topBenchmark * 1.15, 100);
  const range = maxScale - minScale;

  const getPercent = (val: number) => {
    return Math.min(100, Math.max(0, ((val - minScale) / range) * 100));
  };

  const currentPct = getPercent(data.current);
  const q1Pct = getPercent(data.q1);
  const medianPct = getPercent(data.median);
  const q3Pct = getPercent(data.q3);
  const topPct = getPercent(data.topBenchmark);

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 card-shadow flex flex-col justify-between h-full space-y-4">
      {/* Top Header & Big Score */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold text-slate-500 tracking-wide uppercase">
            {data.metric}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold font-tabular text-slate-950 tracking-tight">
              {data.unit === 'points' && data.current > 0 ? `+${data.current}` : `${data.current}${data.unit}`}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              &uarr; {data.change > 0 ? `+${data.change}` : data.change} {data.unit} vs prior
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-bold text-slate-950 bg-amber-300 px-2.5 py-1 rounded-full">
            Top Quartile
          </span>
        </div>
      </div>

      {/* Historic Quartile Distribution Visual */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>Quartile Distribution</span>
          <span className="font-tabular text-slate-700">
            Median: {data.median}{data.unit} · Top 10%: {data.topBenchmark}{data.unit}
          </span>
        </div>

        {/* Quartile Spectrum Bar */}
        <div className="relative pt-6 pb-2">
          {/* Current Pin Marker (pointing down) */}
          <div
            className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center z-10"
            style={{ left: `${currentPct}%` }}
          >
            <span className="text-[10px] font-tabular font-bold text-slate-950 bg-amber-400 px-1.5 py-0.5 rounded-sm shadow-xs">
              {data.current}
            </span>
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-amber-400" />
          </div>

          {/* Spectrum Bar Segments */}
          <div className="h-3 w-full bg-slate-100 rounded-sm overflow-hidden flex border border-slate-200">
            {/* Q1: Bottom 25% */}
            <div
              className="bg-rose-200 border-r border-white"
              style={{ width: `${q1Pct}%` }}
              title={`Bottom Quartile (0-${data.q1})`}
            />
            {/* Q2: 25% to Median */}
            <div
              className="bg-amber-200 border-r border-white"
              style={{ width: `${medianPct - q1Pct}%` }}
              title={`Below Median (${data.q1}-${data.median})`}
            />
            {/* Q3: Median to Q3 */}
            <div
              className="bg-sky-200 border-r border-white"
              style={{ width: `${q3Pct - medianPct}%` }}
              title={`Upper Mid (${data.median}-${data.q3})`}
            />
            {/* Q4: Q3 to Top Benchmark */}
            <div
              className="bg-emerald-300"
              style={{ width: `${100 - q3Pct}%` }}
              title={`Top Quartile (${data.q3}+)`}
            />
          </div>

          {/* Tick markers */}
          <div className="relative w-full text-[10px] font-tabular text-slate-500 mt-1.5">
            <span className="absolute left-0">Min</span>
            <span
              className="absolute transform -translate-x-1/2"
              style={{ left: `${q1Pct}%` }}
            >
              Q1 ({data.q1})
            </span>
            <span
              className="absolute transform -translate-x-1/2 font-bold text-slate-700"
              style={{ left: `${medianPct}%` }}
            >
              Med ({data.median})
            </span>
            <span
              className="absolute transform -translate-x-1/2"
              style={{ left: `${q3Pct}%` }}
            >
              Q3 ({data.q3})
            </span>
            <span className="absolute right-0 text-emerald-700 font-bold">
              Elite ({data.topBenchmark})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
