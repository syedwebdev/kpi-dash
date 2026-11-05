import React from 'react';

interface TicketResolutionProps {
  openCount?: number;
  closedCount?: number;
  slaRate?: number;
}

export const TicketResolutionRatioBar: React.FC<TicketResolutionProps> = ({
  openCount = 42,
  closedCount = 320,
  slaRate = 96.2,
}) => {
  const total = openCount + closedCount;
  const closedPct = total > 0 ? (closedCount / total) * 100 : 0;
  const openPct = 100 - closedPct;

  return (
    <div className="w-full flex flex-col justify-between h-full space-y-4">
      {/* Top figures */}
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-3xl font-extrabold font-tabular text-slate-950 tracking-tight flex items-baseline gap-2">
            <span>{closedPct.toFixed(1)}%</span>
            <span className="text-xs font-semibold text-emerald-600">&uarr; +3.4% MoM</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Ticket Resolution Throughput Rate ({closedCount} closed of {total} total)
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-emerald-600">
            {slaRate}% within SLA
          </span>
          <div className="text-xs text-slate-400 font-tabular mt-0.5">
            SLA Target: &ge; 90.0%
          </div>
        </div>
      </div>

      {/* Horizontal Comparison Ratio Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-4 bg-slate-100 rounded-sm overflow-hidden flex border border-slate-200">
          {/* Closed bar */}
          <div
            className="bg-emerald-500 h-full transition-all duration-500 flex items-center justify-start px-2"
            style={{ width: `${closedPct}%` }}
            title={`Closed Tickets: ${closedCount} (${closedPct.toFixed(1)}%)`}
          >
            {closedPct > 15 && (
              <span className="text-[10px] font-tabular font-bold text-slate-950">
                {closedCount} Closed
              </span>
            )}
          </div>
          {/* Open bar */}
          <div
            className="bg-rose-500 h-full transition-all duration-500 flex items-center justify-end px-2"
            style={{ width: `${openPct}%` }}
            title={`Open / In-Progress: ${openCount} (${openPct.toFixed(1)}%)`}
          >
            {openPct > 12 && (
              <span className="text-[10px] font-tabular font-bold text-white">
                {openCount} Open
              </span>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" />
            <span className="text-slate-700">Closed &amp; Resolved</span>
            <span className="font-tabular font-bold text-emerald-600">({closedCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 inline-block" />
            <span className="text-slate-700">Active Backlog / Open</span>
            <span className="font-tabular font-bold text-rose-600">({openCount})</span>
          </div>
        </div>
      </div>

      {/* SLA & Priority Queue Health Grid */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80">
          <span className="text-slate-500 block text-[11px] font-medium">P1 Critical SLA</span>
          <span className="font-tabular font-bold text-emerald-600">100% (0 breached)</span>
        </div>
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80">
          <span className="text-slate-500 block text-[11px] font-medium">P2 High SLA</span>
          <span className="font-tabular font-bold text-slate-800">97.8% on-time</span>
        </div>
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80">
          <span className="text-slate-500 block text-[11px] font-medium">Avg Resolution</span>
          <span className="font-tabular font-bold text-slate-800">4.8 hours</span>
        </div>
      </div>
    </div>
  );
};
