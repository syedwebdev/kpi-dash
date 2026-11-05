import React, { useState } from 'react';
import { ResponseTimePoint } from '../../types/dashboard';

interface ResponseTimeProps {
  data: ResponseTimePoint[];
}

export const ResponseTimeLineChart: React.FC<ResponseTimeProps> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const height = 220;
  const padding = { top: 16, right: 30, bottom: 32, left: 38 };

  // Scale for email (highest val)
  const maxMins = Math.max(...data.map(d => d.email), 60) * 1.1;

  const chartWidth = 680 - padding.left - padding.right;
  const slotWidth = chartWidth / (data.length - 1 || 1);

  // Email line points
  const emailPoints = data.map((d, idx) => ({
    x: padding.left + idx * slotWidth,
    y: height - padding.bottom - (d.email / maxMins) * (height - padding.top - padding.bottom),
    val: d.email,
  }));

  // Slack Connect points
  const slackPoints = data.map((d, idx) => ({
    x: padding.left + idx * slotWidth,
    y: height - padding.bottom - (d.slackConnect / maxMins) * (height - padding.top - padding.bottom),
    val: d.slackConnect,
  }));

  // Live Chat points
  const chatPoints = data.map((d, idx) => ({
    x: padding.left + idx * slotWidth,
    y: height - padding.bottom - (d.chat / maxMins) * (height - padding.top - padding.bottom),
    val: d.chat,
  }));

  const buildPath = (pts: { x: number; y: number }[]) =>
    pts.reduce((acc, curr, idx) => (idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`), '');

  return (
    <div className="w-full relative select-none">
      <div className="flex items-center justify-between text-xs text-slate-500 mb-2 px-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-500 inline-block" />
            <span className="text-slate-700 font-semibold">Live Chat (mins)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-sky-500 inline-block" />
            <span className="text-slate-700 font-semibold">Slack Connect</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-indigo-500 inline-block" />
            <span className="text-slate-700 font-semibold">Email / Helpdesk</span>
          </div>
        </div>
        <div className="text-xs text-slate-500 font-tabular">
          Chat FRT: <span className="text-emerald-600 font-bold">{data[data.length - 1]?.chat}m</span> ·
          Email: <span className="text-indigo-600 font-bold">{data[data.length - 1]?.email}m</span>
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
            const val = Math.round(maxMins * (1 - pct));
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
                  {val}m
                </text>
              </g>
            );
          })}

          {/* Lines */}
          <path d={buildPath(emailPoints)} fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" />
          <path d={buildPath(slackPoints)} fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" />
          <path d={buildPath(chatPoints)} fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />

          {/* Interactive slots */}
          {data.map((d, idx) => {
            const isHovered = hoveredIdx === idx;
            const x = padding.left + idx * slotWidth;

            return (
              <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredIdx(idx)}>
                {/* Hotspot */}
                <rect
                  x={x - slotWidth / 2}
                  y={padding.top}
                  width={slotWidth}
                  height={height - padding.top - padding.bottom}
                  fill={isHovered ? '#38bdf8' : 'transparent'}
                  fillOpacity={isHovered ? 0.05 : 0}
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

                <circle cx={x} cy={emailPoints[idx].y} r={isHovered ? 5 : 3} fill="#818cf8" stroke="#ffffff" strokeWidth="2" />
                <circle cx={x} cy={slackPoints[idx].y} r={isHovered ? 5 : 3} fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                <circle cx={x} cy={chatPoints[idx].y} r={isHovered ? 5 : 3.5} fill="#34d399" stroke="#ffffff" strokeWidth="2" />

                <text
                  x={x}
                  y={height - padding.bottom + 16}
                  textAnchor="middle"
                  fill={isHovered ? '#0f172a' : '#64748b'}
                  fontSize="10"
                  fontWeight={isHovered ? '700' : '500'}
                  fontFamily="Plus Jakarta Sans"
                >
                  {d.period}
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
              {data[hoveredIdx].period} First Response Times
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Live Chat:</span>
              <span className="font-tabular font-bold text-emerald-400">
                {data[hoveredIdx].chat} mins
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Slack Connect:</span>
              <span className="font-tabular font-bold text-sky-400">
                {data[hoveredIdx].slackConnect} mins
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Email Ticket:</span>
              <span className="font-tabular font-bold text-indigo-400">
                {data[hoveredIdx].email} mins
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
