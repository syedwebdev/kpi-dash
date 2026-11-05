import React from 'react';

interface DayItem {
  day: string;
  heightPct: number; // 0 to 100
  isHighlight?: boolean;
}

interface WeeklyStemChartProps {
  days?: DayItem[];
}

export const WeeklyStemChart: React.FC<WeeklyStemChartProps> = ({ days }) => {
  const defaultDays: DayItem[] = [
    { day: 'S', heightPct: 40 },
    { day: 'M', heightPct: 65 },
    { day: 'T', heightPct: 50 },
    { day: 'W', heightPct: 90, isHighlight: true },
    { day: 'T', heightPct: 75 },
    { day: 'F', heightPct: 60 },
    { day: 'S', heightPct: 80 },
  ];

  const items = days || defaultDays;

  return (
    <div className="flex items-end justify-between gap-1.5 h-16 w-full max-w-[140px] px-1">
      {items.map((item, idx) => (
        <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end group">
          {/* Stem & Top Dot */}
          <div className="relative flex flex-col items-center justify-end w-full" style={{ height: `${item.heightPct}%` }}>
            {/* Top Yellow Ball */}
            <div
              className={`w-2.5 h-2.5 rounded-full mb-0.5 transition-transform group-hover:scale-125 ${
                item.isHighlight ? 'bg-amber-400 ring-2 ring-amber-200' : 'bg-amber-300'
              }`}
            />
            {/* Thin vertical stem */}
            <div className="w-[1.5px] h-full bg-slate-200" />
          </div>

          {/* Day Label */}
          <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase">
            {item.day}
          </span>
        </div>
      ))}
    </div>
  );
};
