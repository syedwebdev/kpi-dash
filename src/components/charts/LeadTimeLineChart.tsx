import React, { useState } from 'react';
import { LeadTimeDataPoint } from '../../types/dashboard';

interface LeadTimeProps {
  data: LeadTimeDataPoint[];
}

export const LeadTimeLineChart: React.FC<LeadTimeProps> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const height = 210;
  const padding = { top: 16, right: 30, bottom: 32, left: 36 };

  const minVal = 0;
  const maxVal = Math.max(...data.map(d => d.hours), 48);

  const chartWidth = 680 - padding.left - padding.right;
  const slotWidth = chartWidth / (data.length - 1 || 1);

  const points = data.map((d, idx) => {
    const x = padding.left + idx * slotWidth;
    const y =
      height -
      padding.bottom -
      ((d.hours - minVal) / (maxVal - minVal)) * (height - padding.top - padding.bottom);
    return { x, y, data: d };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;

  // 24.0h target benchmark line
  const targetY =
    height -
    padding.bottom -
    ((24.0 - minVal) / (maxVal - minVal)) * (height - padding.top - padding.bottom);

  return (
    <div className="w-full relative select-none">
      <div className="flex items-center justify-between text-xs text-slate-500 mb-2 px-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-sky-500 inline-block" />
            <span className="text-slate-700 font-semibold">Lead Time (Hours to Prod)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-b border-dashed border-slate-400 inline-block" />
            <span className="text-slate-500 font-medium">Target (&le; 24h)</span>
          </div>
        </div>
        <div className="text-xs text-slate-500 font-tabular">
          Latest: <span className="text-emerald-600 font-bold">{data[data.length - 1]?.hours} hrs</span>
          <span className="text-slate-400 ml-1.5">(&darr; Faster)</span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 680 ${height}`}
          className="w-full h-auto min-w-[420px]"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <defs>
            <linearGradient id="leadTimeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.33, 0.66, 1].map((pct, idx) => {
            const y = padding.top + (height - padding.top - padding.bottom) * pct;
            const val = Math.round(maxVal * (1 - pct));
            return (
              <g key={idx}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={680 - padding.right}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 6}
                  y={y + 3}
                  textAnchor="end"
                  fill="#64748B"
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                >
                  {val}h
                </text>
              </g>
            );
          })}

          {/* Target 24h Guideline */}
          <line
            x1={padding.left}
            y1={targetY}
            x2={680 - padding.right}
            y2={targetY}
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeDasharray="4 3"
          />
          <text
            x={680 - padding.right - 4}
            y={targetY - 5}
            textAnchor="end"
            fill="#64748B"
            fontSize="9"
            fontFamily="JetBrains Mono"
          >
            24h SLA Target
          </text>

          {/* Area & Line */}
          <path d={areaD} fill="url(#leadTimeGrad)" />
          <path
            d={pathD}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Hover nodes & vertical guides */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredIdx(idx)}>
                {/* Hotspot */}
                <rect
                  x={pt.x - slotWidth / 2}
                  y={padding.top}
                  width={slotWidth}
                  height={height - padding.top - padding.bottom}
                  fill={isHovered ? '#38bdf8' : 'transparent'}
                  fillOpacity={isHovered ? 0.05 : 0}
                />

                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={padding.top}
                    x2={pt.x}
                    y2={height - padding.bottom}
                    stroke="#38bdf8"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}

                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 5.5 : 3.5}
                  fill="#38bdf8"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-all"
                />

                <text
                  x={pt.x}
                  y={height - padding.bottom + 16}
                  textAnchor="middle"
                  fill={isHovered ? '#0f172a' : '#64748b'}
                  fontSize="10"
                  fontWeight={isHovered ? '700' : '500'}
                  fontFamily="Plus Jakarta Sans"
                >
                  {pt.data.period}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIdx !== null && data[hoveredIdx] && (
          <div
            className="absolute z-20 pointer-events-none bg-slate-900 border border-slate-700/80 rounded-md p-2.5 shadow-xl text-xs space-y-1 backdrop-blur-md"
            style={{
              left: `${Math.min(80, Math.max(20, (hoveredIdx / (data.length - 1 || 1)) * 100))}%`,
              top: '25%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1">
              {data[hoveredIdx].period} Time-to-Production
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Commit-to-Deploy:</span>
              <span className="font-tabular font-bold text-sky-400">{data[hoveredIdx].hours} hrs</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Benchmark SLA:</span>
              <span className="font-tabular text-slate-300">24.0 hrs</span>
            </div>
            <div className="text-[10px] text-emerald-400 pt-0.5">
              {data[hoveredIdx].hours <= 24 ? 'Within DORA Elite / High band' : 'Above target threshold'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
