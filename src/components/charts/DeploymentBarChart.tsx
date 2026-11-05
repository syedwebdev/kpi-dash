import React, { useState } from 'react';
import { DeploymentDataPoint } from '../../types/dashboard';

interface DeploymentBarProps {
  data: DeploymentDataPoint[];
}

export const DeploymentBarChart: React.FC<DeploymentBarProps> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const height = 210;
  const padding = { top: 16, right: 24, bottom: 32, left: 36 };

  const maxDeploy = Math.max(...data.map(d => d.production + d.hotfix), 35);

  return (
    <div className="w-full relative select-none">
      <div className="flex items-center justify-between text-xs text-slate-500 mb-2 px-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-indigo-500 inline-block" />
            <span className="text-slate-700 font-semibold">Production Releases</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-amber-500 inline-block" />
            <span className="text-slate-700 font-semibold">Hotfixes</span>
          </div>
        </div>
        <div className="text-xs text-slate-500 font-tabular">
          DORA Status: <span className="text-emerald-600 font-bold">Elite Tier (&gt;1 deploy/day)</span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 680 ${height}`}
          className="w-full h-auto min-w-[420px]"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {/* Grid lines */}
          {[0, 0.33, 0.66, 1].map((pct, idx) => {
            const y = padding.top + (height - padding.top - padding.bottom) * pct;
            const val = Math.round(maxDeploy * (1 - pct));
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
                  {val}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((item, idx) => {
            const chartWidth = 680 - padding.left - padding.right;
            const slotWidth = chartWidth / data.length;
            const x = padding.left + idx * slotWidth;
            const barWidth = Math.max(16, Math.min(36, slotWidth * 0.55));
            const barX = x + (slotWidth - barWidth) / 2;

            const total = item.production + item.hotfix;
            const prodHeight = (item.production / maxDeploy) * (height - padding.top - padding.bottom);
            const hotfixHeight = (item.hotfix / maxDeploy) * (height - padding.top - padding.bottom);

            const isHovered = hoveredIdx === idx;
            const baseY = height - padding.bottom;

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                className="cursor-pointer transition-opacity"
              >
                {/* Hotspot */}
                <rect
                  x={x}
                  y={padding.top}
                  width={slotWidth}
                  height={height - padding.top - padding.bottom}
                  fill={isHovered ? '#6366f1' : 'transparent'}
                  fillOpacity={isHovered ? 0.08 : 0}
                />

                {/* Production bar */}
                <rect
                  x={barX}
                  y={baseY - prodHeight}
                  width={barWidth}
                  height={prodHeight}
                  rx="1"
                  fill={isHovered ? '#818cf8' : '#6366f1'}
                  className="transition-colors"
                />

                {/* Hotfix bar on top */}
                {item.hotfix > 0 && (
                  <rect
                    x={barX}
                    y={baseY - prodHeight - hotfixHeight}
                    width={barWidth}
                    height={hotfixHeight}
                    rx="1"
                    fill={isHovered ? '#fbbf24' : '#f59e0b'}
                    className="transition-colors"
                  />
                )}

                {/* Label */}
                <text
                  x={x + slotWidth / 2}
                  y={height - padding.bottom + 16}
                  textAnchor="middle"
                  fill={isHovered ? '#0f172a' : '#64748b'}
                  fontSize="10"
                  fontWeight={isHovered ? '700' : '500'}
                  fontFamily="Plus Jakarta Sans"
                >
                  {item.period}
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
              left: `${Math.min(80, Math.max(20, ((hoveredIdx + 0.5) / data.length) * 100))}%`,
              top: '20%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1">
              {data[hoveredIdx].period} Deployments
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Production Releases:</span>
              <span className="font-tabular font-bold text-indigo-400">{data[hoveredIdx].production}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Hotfixes / Patches:</span>
              <span className="font-tabular font-bold text-amber-400">{data[hoveredIdx].hotfix}</span>
            </div>
            <div className="flex justify-between gap-4 pt-1 border-t border-slate-800">
              <span className="text-slate-300 font-medium">Total Runs:</span>
              <span className="font-tabular font-bold text-white">
                {data[hoveredIdx].production + data[hoveredIdx].hotfix}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
