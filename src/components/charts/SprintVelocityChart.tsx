import React, { useState } from 'react';
import { SprintVelocityPoint } from '../../types/dashboard';

interface SprintVelocityProps {
  data: SprintVelocityPoint[];
}

export const SprintVelocityChart: React.FC<SprintVelocityProps> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const height = 210;
  const padding = { top: 20, right: 24, bottom: 32, left: 36 };

  const maxPoints = Math.max(...data.map(d => Math.max(d.planned, d.completed)), 150) * 1.1;

  return (
    <div className="w-full relative select-none">
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-indigo-500 inline-block" />
            <span className="text-slate-700 font-semibold">Points Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-slate-300 inline-block" />
            <span className="text-slate-500 font-medium">Unfinished / Rollover</span>
          </div>
        </div>
        <div className="text-xs text-slate-500 font-tabular">
          Avg Velocity: <span className="text-indigo-600 font-bold">125.7 pts / sprint</span>
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
            const val = Math.round(maxPoints * (1 - pct));
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

          {/* Stacked Bars for each Sprint */}
          {data.map((item, idx) => {
            const chartWidth = 680 - padding.left - padding.right;
            const slotWidth = chartWidth / data.length;
            const x = padding.left + idx * slotWidth;
            const barWidth = Math.max(20, Math.min(42, slotWidth * 0.55));
            const barX = x + (slotWidth - barWidth) / 2;

            const plannedHeight = (item.planned / maxPoints) * (height - padding.top - padding.bottom);
            const completedHeight = (item.completed / maxPoints) * (height - padding.top - padding.bottom);
            const unfinishedHeight = Math.max(0, plannedHeight - completedHeight);

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

                {/* Base completed portion (Indigo) */}
                <rect
                  x={barX}
                  y={baseY - completedHeight}
                  width={barWidth}
                  height={completedHeight}
                  rx="1"
                  fill={isHovered ? '#818cf8' : '#6366f1'}
                  className="transition-colors"
                />

                {/* Stacked unfinished/spillover portion (Slate) */}
                {unfinishedHeight > 0 && (
                  <rect
                    x={barX}
                    y={baseY - plannedHeight}
                    width={barWidth}
                    height={unfinishedHeight}
                    rx="1"
                    fill={isHovered ? '#475569' : '#334155'}
                    className="transition-colors"
                  />
                )}

                {/* Completion rate badge text above bar */}
                <text
                  x={barX + barWidth / 2}
                  y={baseY - plannedHeight - 6}
                  textAnchor="middle"
                  fill={item.completionRate >= 95 ? '#34d399' : '#94a3b8'}
                  fontSize="9"
                  fontWeight="600"
                  fontFamily="JetBrains Mono"
                >
                  {item.completionRate.toFixed(0)}%
                </text>

                {/* Sprint label */}
                <text
                  x={x + slotWidth / 2}
                  y={height - padding.bottom + 16}
                  textAnchor="middle"
                  fill={isHovered ? '#0f172a' : '#64748b'}
                  fontSize="10"
                  fontWeight={isHovered ? '700' : '500'}
                  fontFamily="Plus Jakarta Sans"
                >
                  {item.sprint}
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
              {data[hoveredIdx].sprint} Velocity
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Planned Story Points:</span>
              <span className="font-tabular text-slate-200">{data[hoveredIdx].planned} pts</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Completed in Sprint:</span>
              <span className="font-tabular font-bold text-indigo-400">{data[hoveredIdx].completed} pts</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Rollover / Spillovers:</span>
              <span className="font-tabular text-slate-400">{data[hoveredIdx].planned - data[hoveredIdx].completed} pts</span>
            </div>
            <div className="flex justify-between gap-4 pt-1 border-t border-slate-800">
              <span className="text-slate-300 font-medium">Sprint Predictability:</span>
              <span className="font-tabular font-bold text-emerald-400">{data[hoveredIdx].completionRate.toFixed(1)}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
