import React, { useState } from 'react';

interface PillBarPoint {
  label: string;
  value: number;
  isHighlight?: boolean;
  tooltipText?: string;
}

interface PillBarChartProps {
  data?: PillBarPoint[];
  height?: number;
}

export const PillBarChart: React.FC<PillBarChartProps> = ({
  data,
  height = 160,
}) => {
  // Default values mimicking the exact bar progression in the reference image
  const defaultBars: PillBarPoint[] = [
    { label: 'Jan', value: 3.2 },
    { label: '', value: 4.1 },
    { label: '', value: 5.5 },
    { label: '', value: 7.2 },
    { label: 'Mar', value: 9.8, isHighlight: true, tooltipText: '3.82%' },
    { label: '', value: 9.0 },
    { label: '', value: 7.4 },
    { label: '', value: 5.8 },
    { label: 'May', value: 4.5 },
    { label: '', value: 4.2 },
    { label: '', value: 3.9 },
    { label: '', value: 3.5 },
    { label: '', value: 3.8 },
    { label: '', value: 4.6 },
    { label: 'Jul', value: 6.2, isHighlight: true, tooltipText: 'Peak' },
    { label: '', value: 7.0 },
  ];

  const chartData = data && data.length > 0 ? data : defaultBars;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxValue = Math.max(...chartData.map((d) => d.value), 10);
  const chartHeight = height;
  const paddingBottom = 24;
  const paddingTop = 28;
  const usableHeight = chartHeight - paddingBottom - paddingTop;

  return (
    <div className="w-full relative select-none">
      <svg
        viewBox={`0 0 540 ${chartHeight}`}
        className="w-full h-auto overflow-visible"
        onMouseLeave={() => setHoveredIdx(null)}
      >
        {/* Horizontal scale indicators (left y-axis percentages like in image: 1.0%, 0.5%, 0.0%) */}
        {[1, 0.5, 0].map((pct, idx) => {
          const y = paddingTop + usableHeight * (1 - pct);
          return (
            <g key={idx}>
              <line
                x1={36}
                y1={y}
                x2={530}
                y2={y}
                stroke="#E2E8F0"
                strokeWidth="1"
                strokeDasharray="2 3"
              />
              <text
                x={30}
                y={y + 3}
                textAnchor="end"
                fill="#94A3B8"
                fontSize="9"
                fontFamily="JetBrains Mono"
              >
                {pct === 1 ? '1.0%' : pct === 0.5 ? '0.5%' : '0.0%'}
              </text>
            </g>
          );
        })}

        {/* Capsule / Pill Bars */}
        {chartData.map((item, idx) => {
          const totalBars = chartData.length;
          const slotWidth = (500 - 40) / totalBars;
          const x = 40 + idx * slotWidth;
          const barWidth = Math.min(14, slotWidth * 0.72);
          const barX = x + (slotWidth - barWidth) / 2;

          const barHeight = Math.max(12, (item.value / maxValue) * usableHeight);
          const barY = chartHeight - paddingBottom - barHeight;

          const isHovered = hoveredIdx === idx;
          const isYellowHighlight = item.isHighlight || isHovered;

          return (
            <g
              key={idx}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
            >
              {/* Invisible touch/hover hotspot */}
              <rect
                x={x}
                y={paddingTop}
                width={slotWidth}
                height={usableHeight + 10}
                fill="transparent"
              />

              {/* Floating Tooltip Pill (like 3.82% above peak in image) */}
              {(item.isHighlight || isHovered) && (
                <g>
                  <rect
                    x={barX + barWidth / 2 - 18}
                    y={barY - 18}
                    width={36}
                    height={15}
                    rx="7.5"
                    fill="#FACC15"
                  />
                  <text
                    x={barX + barWidth / 2}
                    y={barY - 7}
                    textAnchor="middle"
                    fill="#0F172A"
                    fontSize="8.5"
                    fontWeight="800"
                    fontFamily="JetBrains Mono"
                  >
                    {item.tooltipText || `${item.value.toFixed(1)}%`}
                  </text>
                </g>
              )}

              {/* The Capsule Bar */}
              <rect
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                rx={barWidth / 2}
                fill={isYellowHighlight ? '#FACC15' : '#1E293B'}
                className="transition-colors duration-150"
              />

              {/* Label underneath if present */}
              {item.label && (
                <text
                  x={barX + barWidth / 2}
                  y={chartHeight - 6}
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize="10"
                  fontWeight="500"
                  fontFamily="Plus Jakarta Sans"
                >
                  {item.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
