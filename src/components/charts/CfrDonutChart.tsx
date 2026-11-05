import React, { useState } from 'react';

interface CfrDonutProps {
  failureRate?: number; // e.g. 3.2 (%)
  totalDeployments?: number; // e.g. 359
}

export const CfrDonutChart: React.FC<CfrDonutProps> = ({
  failureRate = 3.2,
  totalDeployments = 359,
}) => {
  const [hoveredSegment, setHoveredSegment] = useState<'success' | 'failure' | null>(null);

  const successRate = 100 - failureRate;
  const failedCount = Math.round((failureRate / 100) * totalDeployments);
  const successCount = totalDeployments - failedCount;

  // SVG Donut params
  const size = 180;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Failure arc length & offset
  const failStrokeDash = (failureRate / 100) * circumference;
  const successStrokeDash = (successRate / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-between h-full w-full">
      <div className="relative flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90 select-none"
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />

          {/* Success segment */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#10b981"
            strokeWidth={hoveredSegment === 'success' ? strokeWidth + 3 : strokeWidth}
            strokeDasharray={`${successStrokeDash} ${circumference}`}
            strokeDashoffset={0}
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredSegment('success')}
            onMouseLeave={() => setHoveredSegment(null)}
          />

          {/* Failure segment */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#f43f5e"
            strokeWidth={hoveredSegment === 'failure' ? strokeWidth + 3 : strokeWidth}
            strokeDasharray={`${failStrokeDash} ${circumference}`}
            strokeDashoffset={-successStrokeDash}
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredSegment('failure')}
            onMouseLeave={() => setHoveredSegment(null)}
          />
        </svg>

        {/* Center Metric Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-2xl font-extrabold font-tabular text-slate-950 tracking-tight">
            {failureRate.toFixed(1)}%
          </span>
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
            Failure Rate
          </span>
        </div>
      </div>

      {/* Legend & Count Breakdown */}
      <div className="w-full mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
        <div
          onMouseEnter={() => setHoveredSegment('success')}
          onMouseLeave={() => setHoveredSegment(null)}
          className={`p-2 rounded-lg border transition-colors cursor-pointer ${
            hoveredSegment === 'success'
              ? 'bg-emerald-50 border-emerald-300'
              : 'bg-slate-50 border-slate-200/80'
          }`}
        >
          <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-xs bg-emerald-500 inline-block" />
            <span>Successful Deploys</span>
          </div>
          <div className="font-tabular font-bold text-slate-900 text-sm mt-0.5">
            {successCount} <span className="text-xs font-normal text-slate-500">({successRate.toFixed(1)}%)</span>
          </div>
        </div>

        <div
          onMouseEnter={() => setHoveredSegment('failure')}
          onMouseLeave={() => setHoveredSegment(null)}
          className={`p-2 rounded-lg border transition-colors cursor-pointer ${
            hoveredSegment === 'failure'
              ? 'bg-rose-50 border-rose-300'
              : 'bg-slate-50 border-slate-200/80'
          }`}
        >
          <div className="flex items-center gap-1.5 text-rose-600 text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-xs bg-rose-500 inline-block" />
            <span>Failed Deployments</span>
          </div>
          <div className="font-tabular font-bold text-slate-900 text-sm mt-0.5">
            {failedCount} <span className="text-xs font-normal text-slate-500">({failureRate.toFixed(1)}%)</span>
          </div>
        </div>
      </div>

      <div className="text-[11px] text-slate-500 pt-2 text-center">
        DORA Elite Benchmark: <span className="text-emerald-600 font-semibold">&lt; 5.0%</span> CFR
      </div>
    </div>
  );
};
