import React, { useState } from 'react';
import { UserEngagementPoint } from '../../types/dashboard';

interface EngagementAreaProps {
  data: UserEngagementPoint[];
}

export const EngagementAreaChart: React.FC<EngagementAreaProps> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const height = 230;
  const padding = { top: 16, right: 30, bottom: 32, left: 45 };

  const maxMau = Math.max(...data.map(d => d.mau), 45000) * 1.05;

  const chartWidth = 680 - padding.left - padding.right;
  const slotWidth = chartWidth / (data.length - 1 || 1);

  // Points for MAU
  const mauPoints = data.map((d, idx) => {
    const x = padding.left + idx * slotWidth;
    const y =
      height - padding.bottom - (d.mau / maxMau) * (height - padding.top - padding.bottom);
    return { x, y, data: d };
  });

  // Points for DAU
  const dauPoints = data.map((d, idx) => {
    const x = padding.left + idx * slotWidth;
    const y =
      height - padding.bottom - (d.dau / maxMau) * (height - padding.top - padding.bottom);
    return { x, y, data: d };
  });

  const mauLineD = mauPoints.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');
  const mauAreaD = `${mauLineD} L ${mauPoints[mauPoints.length - 1].x} ${height - padding.bottom} L ${mauPoints[0].x} ${height - padding.bottom} Z`;

  const dauLineD = dauPoints.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');
  const dauAreaD = `${dauLineD} L ${dauPoints[dauPoints.length - 1].x} ${height - padding.bottom} L ${dauPoints[0].x} ${height - padding.bottom} Z`;

  const latest = data[data.length - 1];

  return (
    <div className="w-full relative select-none">
      <div className="flex items-center justify-between text-xs text-slate-500 mb-2 px-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-indigo-500/40 border border-indigo-400 rounded-xs inline-block" />
            <span className="text-slate-700 font-semibold">Monthly Active Users (MAU)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-emerald-500/40 border border-emerald-400 rounded-xs inline-block" />
            <span className="text-slate-700 font-semibold">Daily Active Users (DAU)</span>
          </div>
        </div>
        <div className="text-xs text-slate-500 font-tabular">
          DAU/MAU Stickiness: <span className="text-emerald-600 font-bold">{latest?.stickiness.toFixed(1)}%</span>
          <span className="text-slate-400 ml-1.5">(SaaS Best-in-Class &gt;40%)</span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 680 ${height}`}
          className="w-full h-auto min-w-[420px]"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <defs>
            <linearGradient id="mauGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="dauGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.03" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = padding.top + (height - padding.top - padding.bottom) * pct;
            const val = Math.round((maxMau * (1 - pct)) / 1000);
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
                  {val}k
                </text>
              </g>
            );
          })}

          {/* MAU Area & Line */}
          <path d={mauAreaD} fill="url(#mauGrad)" />
          <path
            d={mauLineD}
            fill="none"
            stroke="#818cf8"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* DAU Area & Line */}
          <path d={dauAreaD} fill="url(#dauGrad)" />
          <path
            d={dauLineD}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Hover interaction slots */}
          {data.map((d, idx) => {
            const isHovered = hoveredIdx === idx;
            const x = padding.left + idx * slotWidth;
            const mPt = mauPoints[idx];
            const dPt = dauPoints[idx];

            return (
              <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredIdx(idx)}>
                {/* Hotspot */}
                <rect
                  x={x - slotWidth / 2}
                  y={padding.top}
                  width={slotWidth}
                  height={height - padding.top - padding.bottom}
                  fill={isHovered ? '#6366f1' : 'transparent'}
                  fillOpacity={isHovered ? 0.06 : 0}
                />

                {isHovered && (
                  <line
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={height - padding.bottom}
                    stroke="#94a3b8"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}

                <circle
                  cx={mPt.x}
                  cy={mPt.y}
                  r={isHovered ? 5 : 3}
                  fill="#818cf8"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <circle
                  cx={dPt.x}
                  cy={dPt.y}
                  r={isHovered ? 5 : 3.5}
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                {/* X axis labels */}
                <text
                  x={x}
                  y={height - padding.bottom + 16}
                  textAnchor="middle"
                  fill={isHovered ? '#0f172a' : '#64748b'}
                  fontSize="10"
                  fontWeight={isHovered ? '700' : '500'}
                  fontFamily="Plus Jakarta Sans"
                >
                  {d.date}
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
              Active User Volume · {data[hoveredIdx].date}
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Monthly Active (MAU):</span>
              <span className="font-tabular font-bold text-indigo-400">
                {data[hoveredIdx].mau.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Daily Active (DAU):</span>
              <span className="font-tabular font-bold text-emerald-400">
                {data[hoveredIdx].dau.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between gap-4 pt-1 border-t border-slate-800">
              <span className="text-slate-300 font-medium">Stickiness (DAU/MAU):</span>
              <span className="font-tabular font-bold text-white">
                {data[hoveredIdx].stickiness.toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
