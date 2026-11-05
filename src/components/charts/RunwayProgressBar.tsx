import React from 'react';

interface RunwayProgressProps {
  runwayMonths?: number;
  cashReserves?: string;
  netBurn?: string;
  grossBurn?: string;
}

export const RunwayProgressBar: React.FC<RunwayProgressProps> = ({
  runwayMonths = 23.8,
  cashReserves = '$8.20M',
  netBurn = '$345,000 / mo',
  grossBurn = '$520,000 / mo',
}) => {
  // Max scale: 30 months
  const maxMonths = 30;
  const progressPct = Math.min(100, (runwayMonths / maxMonths) * 100);

  const getStatus = (months: number) => {
    if (months >= 18) return { label: 'Optimal Runway', color: 'text-emerald-400', barColor: 'bg-emerald-500' };
    if (months >= 12) return { label: 'Adequate Runway', color: 'text-sky-400', barColor: 'bg-sky-500' };
    if (months >= 6) return { label: 'Fundraising Window', color: 'text-amber-400', barColor: 'bg-amber-500' };
    return { label: 'Critical Runway', color: 'text-rose-400', barColor: 'bg-rose-500' };
  };

  const status = getStatus(runwayMonths);

  return (
    <div className="w-full flex flex-col justify-between h-full space-y-4">
      {/* Top summary figures */}
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-3xl font-extrabold font-tabular text-slate-950 tracking-tight flex items-baseline gap-2">
            <span>{runwayMonths.toFixed(1)}</span>
            <span className="text-sm font-medium text-slate-500">Months</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Zero-revenue survival runway based on current net burn
          </div>
        </div>
        <div className="text-right">
          <span className={`text-xs font-semibold ${status.color}`}>
            {status.label}
          </span>
          <div className="text-xs text-slate-400 font-tabular mt-0.5">
            Cash Out Date: Oct 2028
          </div>
        </div>
      </div>

      {/* Visual Multi-zone Progress Bar */}
      <div className="space-y-1.5">
        <div className="relative w-full h-4 bg-slate-100 rounded-sm overflow-hidden border border-slate-200">
          {/* Subtle colored background track zones */}
          <div className="absolute inset-0 flex opacity-30">
            <div className="w-[20%] bg-rose-400" title="0-6m Critical" />
            <div className="w-[20%] bg-amber-400" title="6-12m Caution" />
            <div className="w-[20%] bg-sky-400" title="12-18m Target" />
            <div className="w-[40%] bg-emerald-400" title="18-30m Comfortable" />
          </div>

          {/* Active Fill Bar */}
          <div
            className={`h-full ${status.barColor} transition-all duration-500 relative`}
            style={{ width: `${progressPct}%` }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white opacity-90 shadow-sm" />
          </div>
        </div>

        {/* Milestone Threshold Indicators */}
        <div className="relative w-full flex justify-between text-[10px] font-tabular text-slate-500 pt-0.5">
          <span>0m</span>
          <span className="text-rose-600 font-medium">6m (Alert)</span>
          <span className="text-amber-600 font-medium">12m (Raise)</span>
          <span className="text-sky-600 font-medium">18m (Target)</span>
          <span className="text-emerald-600 font-medium">24m+</span>
          <span>30m</span>
        </div>
      </div>

      {/* Financial Details Ledger */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80">
          <span className="text-slate-500 block text-[11px] font-medium">Cash Reserves</span>
          <span className="font-tabular font-bold text-slate-900">{cashReserves}</span>
        </div>
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80">
          <span className="text-slate-500 block text-[11px] font-medium">Monthly Net Burn</span>
          <span className="font-tabular font-bold text-rose-600">{netBurn}</span>
        </div>
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80">
          <span className="text-slate-500 block text-[11px] font-medium">Gross Burn</span>
          <span className="font-tabular font-bold text-slate-700">{grossBurn}</span>
        </div>
      </div>
    </div>
  );
};
