import React from 'react';

interface ConcentricRingsProps {
  value: string;
  unit?: string;
  size?: number;
}

export const ConcentricRings: React.FC<ConcentricRingsProps> = ({
  value = '78.5',
  unit = '%',
  size = 110,
}) => {
  const center = size / 2;
  const radii = [18, 28, 38, 48];

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {radii.map((r, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={r}
            fill="none"
            stroke="#FEF08A" // light yellow
            strokeWidth={i === radii.length - 1 ? '1.5' : '1'}
            strokeOpacity={0.4 + i * 0.15}
            strokeDasharray={i % 2 === 1 ? '3 3' : 'none'}
          />
        ))}
        {/* Subtle center halo */}
        <circle cx={center} cy={center} r={14} fill="#FEF9C3" fillOpacity="0.6" />
      </svg>

      {/* Central Number */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-amber-500 font-extrabold text-lg font-tabular tracking-tight leading-none flex items-baseline">
          <span>{value}</span>
          {unit && <span className="text-[10px] font-semibold text-amber-500 ml-0.5">{unit}</span>}
        </div>
      </div>
    </div>
  );
};
