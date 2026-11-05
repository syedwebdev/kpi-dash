import React from 'react';

interface LtvCacGaugeProps {
  ratio?: number; // e.g. 3.8
  target?: number; // e.g. 3.0
  ltv?: string; // e.g. $22,800
  cac?: string; // e.g. $6,000
}

export const LtvCacGaugeChart: React.FC<LtvCacGaugeProps> = ({
  ratio = 3.8,
  target = 3.0,
  ltv = '$22,800',
  cac = '$6,000',
}) => {
  // Gauge spans 180 degrees (from 180 to 0 degrees, or left to right semi-circle)
  // Max ratio scale = 5.0
  const maxScale = 5.0;
  const clampedRatio = Math.min(maxScale, Math.max(0, ratio));
  
  // Angle: 0 ratio => 180 deg (left), 5 ratio => 0 deg (right)
  const angle = 180 - (clampedRatio / maxScale) * 180;
  const targetAngle = 180 - (target / maxScale) * 180;

  // Center & radius
  const cx = 110;
  const cy = 105;
  const r = 78;
  const strokeWidth = 14;

  // Arc path generator
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 180) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  };

  // Segments:
  // 0 - 1.0 (Critical / Red, 0 to 36 deg from left => 180 to 144)
  // 1.0 - 3.0 (Watchlist / Amber, 144 to 72)
  // 3.0 - 5.0 (Healthy / Green, 72 to 0)
  const arcRed = describeArc(cx, cy, r, 180, 144);
  const arcAmber = describeArc(cx, cy, r, 144, 72);
  const arcGreen = describeArc(cx, cy, r, 72, 0);

  // Target indicator tick coordinates
  const targetRad = ((targetAngle - 180) * Math.PI) / 180;
  const tInnerX = cx + (r - strokeWidth / 2 - 4) * Math.cos(targetRad);
  const tInnerY = cy + (r - strokeWidth / 2 - 4) * Math.sin(targetRad);
  const tOuterX = cx + (r + strokeWidth / 2 + 6) * Math.cos(targetRad);
  const tOuterY = cy + (r + strokeWidth / 2 + 6) * Math.sin(targetRad);

  // Needle tip
  const needleRad = ((angle - 180) * Math.PI) / 180;
  const needleLength = r - 16;
  const needleX = cx + needleLength * Math.cos(needleRad);
  const needleY = cy + needleLength * Math.sin(needleRad);

  return (
    <div className="flex flex-col items-center justify-between h-full w-full">
      <div className="relative w-full max-w-[240px] flex justify-center">
        <svg viewBox="0 0 220 125" className="w-full max-w-[220px] overflow-visible">
          {/* Background arcs */}
          <path d={arcRed} fill="none" stroke="#ef4444" strokeWidth={strokeWidth} strokeOpacity="0.4" strokeLinecap="round" />
          <path d={arcAmber} fill="none" stroke="#f59e0b" strokeWidth={strokeWidth} strokeOpacity="0.4" />
          <path d={arcGreen} fill="none" stroke="#10b981" strokeWidth={strokeWidth} strokeOpacity="0.4" strokeLinecap="round" />

          {/* Active fill up to current ratio */}
          <path
            d={describeArc(cx, cy, r, 180, angle)}
            fill="none"
            stroke={ratio >= 3.0 ? '#10b981' : ratio >= 1.0 ? '#f59e0b' : '#ef4444'}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* 3:1 Target Threshold Marker */}
          <line
            x1={tInnerX}
            y1={tInnerY}
            x2={tOuterX}
            y2={tOuterY}
            stroke="#0f172a"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Needle */}
          <line
            x1={cx}
            y1={cy}
            x2={needleX}
            y2={needleY}
            stroke="#0f172a"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Needle center cap */}
          <circle cx={cx} cy={cy} r="6" fill="#0f172a" stroke="#facc15" strokeWidth="2.5" />

          {/* Target label text in SVG */}
          <text
            x={tOuterX + 4}
            y={tOuterY - 4}
            fill="#475569"
            fontSize="9"
            fontWeight="700"
            fontFamily="Plus Jakarta Sans"
          >
            3:1 Target
          </text>
        </svg>

        {/* Value Overlay */}
        <div className="absolute bottom-0 text-center">
          <div className="text-3xl font-extrabold font-tabular tracking-tight text-slate-950 flex items-center justify-center gap-1">
            <span>{ratio.toFixed(1)}</span>
            <span className="text-lg text-slate-400 font-normal">: 1</span>
          </div>
          <div className="text-xs text-emerald-600 font-semibold">
            Healthy Unit Economics (Benchmark &ge; 3.0)
          </div>
        </div>
      </div>

      {/* Granular Breakdown Strip */}
      <div className="w-full mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80">
          <span className="text-slate-500 block text-[11px] font-medium">Customer LTV</span>
          <span className="font-tabular font-bold text-slate-900">{ltv}</span>
        </div>
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80">
          <span className="text-slate-500 block text-[11px] font-medium">Blended CAC</span>
          <span className="font-tabular font-bold text-slate-900">{cac}</span>
        </div>
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80">
          <span className="text-slate-500 block text-[11px] font-medium">CAC Payback</span>
          <span className="font-tabular font-bold text-emerald-600">8.2 mo</span>
        </div>
      </div>
    </div>
  );
};
