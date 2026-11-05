import React, { useState } from 'react';
import { DualAxisDataPoint } from '../../types/dashboard';

interface DualAxisProps {
  data: DualAxisDataPoint[];
}

export const DualAxisBarLineChart: React.FC<DualAxisProps> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const height = 240;
  const padding = { top: 20, right: 48, bottom: 36, left: 48 };

  // Fixed bounds for visual clarity
  const maxChurn = 3.5; // 0% to 3.5%
  const minNRR = 100; // 100% to 130%
  const maxNRR = 130;

  return (
    <div className="w-full relative select-none">
      <div className="flex items-center justify-between text-xs text-slate-500 mb-2 px-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-slate-800 inline-block"></span>
            <span className="text-slate-700 font-semibold">Gross Churn Rate %</span>
            <span className="text-slate-400">(Bar)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-amber-500 inline-block"></span>
            <span className="text-slate-700 font-semibold">Net Revenue Retention (NRR)</span>
            <span className="text-slate-400">(Line · &gt;115%)</span>
          </div>
        </div>
        <div className="text-slate-600 font-tabular text-xs">
          Oct 2026: <span className="text-amber-600 font-bold">123.6% NRR</span> · <span className="text-slate-800 font-bold">1.3% Churn</span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 760 ${height}`}
          className="w-full h-auto min-w-[500px]"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = padding.top + (height - padding.top - padding.bottom) * pct;
            const churnVal = (maxChurn * (1 - pct)).toFixed(1);
            const nrrVal = Math.round(minNRR + (maxNRR - minNRR) * (1 - pct));

            return (
              <g key={idx}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={760 - padding.right}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                  strokeDasharray={pct === 1 ? 'none' : '3 3'}
                />
                {/* Left Y Axis Label (Gross Churn) */}
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#64748B"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                >
                  {churnVal}%
                </text>
                {/* Right Y Axis Label (NRR) */}
                <text
                  x={760 - padding.right + 8}
                  y={y + 3}
                  textAnchor="start"
                  fill="#D97706"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                >
                  {nrrVal}%
                </text>
              </g>
            );
          })}

          {/* 100% NRR Baseline benchmark line */}
          {(() => {
            const baselineY =
              height -
              padding.bottom -
              ((100 - minNRR) / (maxNRR - minNRR)) * (height - padding.top - padding.bottom);
            return (
              <line
                x1={padding.left}
                y1={baselineY}
                x2={760 - padding.right}
                y2={baselineY}
                stroke="#64748b"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
            );
          })()}

          {/* Grouped Bars: Gross Churn */}
          {data.map((item, idx) => {
            const chartWidth = 760 - padding.left - padding.right;
            const slotWidth = chartWidth / data.length;
            const x = padding.left + idx * slotWidth;
            const barWidth = Math.max(12, Math.min(26, slotWidth * 0.45));
            const barX = x + (slotWidth - barWidth) / 2;

            const barHeight =
              (item.grossChurn / maxChurn) * (height - padding.top - padding.bottom);
            const barY = height - padding.bottom - barHeight;

            const isHovered = hoveredIdx === idx;

            return (
              <g
                key={`bar-${idx}`}
                onMouseEnter={() => setHoveredIdx(idx)}
                className="cursor-pointer transition-opacity duration-150"
              >
                {/* Hover hotspot */}
                <rect
                  x={x}
                  y={padding.top}
                  width={slotWidth}
                  height={height - padding.top - padding.bottom}
                  fill={isHovered ? '#3b82f6' : 'transparent'}
                  fillOpacity={isHovered ? 0.08 : 0}
                />

                {/* Churn Bar */}
                <rect
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  rx="2"
                  fill={isHovered ? '#fb7185' : '#f43f5e'}
                  fillOpacity={isHovered ? 0.95 : 0.75}
                  className="transition-all duration-200"
                />

                {/* Period X-label */}
                <text
                  x={x + slotWidth / 2}
                  y={height - padding.bottom + 18}
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

          {/* NRR Line & Area gradient */}
          {(() => {
            const chartWidth = 760 - padding.left - padding.right;
            const slotWidth = chartWidth / data.length;

            const points = data.map((d, idx) => {
              const x = padding.left + idx * slotWidth + slotWidth / 2;
              const y =
                height -
                padding.bottom -
                ((d.nrr - minNRR) / (maxNRR - minNRR)) * (height - padding.top - padding.bottom);
              return { x, y, data: d };
            });

            const pathString = points.reduce((acc, curr, idx) => {
              return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
            }, '');

            return (
              <g>
                <path
                  d={pathString}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Line point nodes */}
                {points.map((pt, idx) => (
                  <circle
                    key={`point-${idx}`}
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredIdx === idx ? 5 : 3.5}
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="transition-all duration-150 pointer-events-none"
                  />
                ))}
              </g>
            );
          })()}
        </svg>

        {/* Hover Tooltip Card */}
        {hoveredIdx !== null && data[hoveredIdx] && (
          <div
            className="absolute z-20 pointer-events-none bg-slate-900 border border-slate-700/80 rounded-md p-2.5 shadow-xl text-xs space-y-1 backdrop-blur-md"
            style={{
              left: `${Math.min(78, Math.max(18, ((hoveredIdx + 0.5) / data.length) * 100))}%`,
              top: '25%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1 flex items-center justify-between gap-4">
              <span>{data[hoveredIdx].period}</span>
              <span className="text-[10px] text-emerald-400 font-normal">Rolling Period</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Net Retention (NRR):</span>
              <span className="font-tabular font-bold text-emerald-400">{data[hoveredIdx].nrr}%</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Gross Churn:</span>
              <span className="font-tabular font-bold text-rose-400">{data[hoveredIdx].grossChurn}%</span>
            </div>
            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
              Benchmark: NRR &gt;115% · Churn &lt;2.0%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
