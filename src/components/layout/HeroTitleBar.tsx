import React from 'react';
import { DashboardTab, TimeRange } from '../../types/dashboard';
import { Calendar, Clock, ChevronDown, Sparkles } from 'lucide-react';

interface HeroTitleBarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  timeRange: TimeRange;
  setTimeRange: (t: TimeRange) => void;
}

export const HeroTitleBar: React.FC<HeroTitleBarProps> = ({
  activeTab,
  setActiveTab,
  timeRange,
  setTimeRange,
}) => {
  const getSubTitle = () => {
    if (activeTab === 'financial') return 'Executive Financial';
    if (activeTab === 'engineering') return 'Product & DevOps';
    return 'Customer Success';
  };

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-4 pb-2 select-none">
      {/* Title with yellow sunburst accent circle */}
      <div className="flex items-center gap-3">
        <div>
          <div className="text-xl sm:text-2xl font-normal text-slate-400 leading-tight">
            {getSubTitle()}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-none mt-0.5">
            Dashboard
          </h1>
        </div>

        {/* Yellow badge with small graphic like in the image */}
        <div className="relative flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-[#FACC15] flex items-center justify-center text-slate-950 shadow-sm">
            <Sparkles className="w-5 h-5 fill-slate-950" />
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-slate-950 absolute -bottom-0.5 -right-0.5 ring-2 ring-white" />
        </div>
      </div>

      {/* Pill Controls matching the image (Date Range, Time filter, Weekly pill) */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Date Range Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Oct 01 - Nov 05</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </div>

        {/* Time Resolution Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Real-time</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </div>

        {/* Time Horizon Filter (Weekly / Rolling toggle with dark active pill) */}
        <div className="flex items-center p-0.5 bg-slate-100 rounded-full border border-slate-200/80">
          {(['30d', '90d', '12m', 'ytd'] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all uppercase cursor-pointer ${
                timeRange === r
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
