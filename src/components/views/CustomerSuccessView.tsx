import React from 'react';
import { TimeRange, QuartileData } from '../../types/dashboard';
import { useDashboardData } from '../../context/DashboardDataContext';
import { EngagementAreaChart } from '../charts/EngagementAreaChart';
import { QuartileCard } from '../charts/QuartileCard';
import { ResponseTimeLineChart } from '../charts/ResponseTimeLineChart';
import { TicketResolutionRatioBar } from '../charts/TicketResolutionRatioBar';
import {
  Folder,
  Users,
  Smile,
  Headphones,
  MessageSquare,
  Edit3,
  Plus,
  Minus,
} from 'lucide-react';

interface CustomerSuccessViewProps {
  timeRange: TimeRange;
  onOpenDataModal?: () => void;
  onOpenIntegrations?: () => void;
  onOpenExport?: () => void;
}

export const CustomerSuccessView: React.FC<CustomerSuccessViewProps> = ({
  timeRange,
  onOpenDataModal,
}) => {
  const { dataset } = useDashboardData();
  const cs = dataset.customerSuccess;

  const stickiness = cs.mau > 0 ? parseFloat(((cs.dau / cs.mau) * 100).toFixed(1)) : 0;

  const dynamicNpsQuartile: QuartileData = {
    metric: 'Net Promoter Score (NPS)',
    current: cs.nps,
    unit: 'points',
    q1: 34,
    median: 48,
    q3: 58,
    topBenchmark: 70,
    previousPeriod: cs.nps - cs.npsChange,
    change: cs.npsChange,
    status: cs.nps >= 50 ? 'healthy' : cs.nps >= 30 ? 'warning' : 'critical',
  };

  const dynamicCsatQuartile: QuartileData = {
    metric: 'Customer Satisfaction (CSAT)',
    current: cs.csat,
    unit: '%',
    q1: 82.0,
    median: 88.5,
    q3: 92.0,
    topBenchmark: 95.0,
    previousPeriod: cs.csat - cs.csatChange,
    change: cs.csatChange,
    status: cs.csat >= 90 ? 'healthy' : cs.csat >= 80 ? 'warning' : 'critical',
  };

  return (
    <div className="space-y-4">
      {/* Top 4 CS Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: MAU */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 card-shadow flex flex-col justify-between relative group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-slate-800 text-xs font-bold">
                <Folder className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>Monthly Active</span>
              </div>
              <span className="text-[10px] font-bold text-slate-950 bg-amber-300 px-2 py-0.5 rounded-full">
                MAU
              </span>
            </div>
            <div className="text-3xl font-extrabold font-tabular text-slate-950">
              {cs.mau.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1">
              Stickiness: <strong className="text-slate-900 font-bold">{stickiness}%</strong> (DAU/MAU)
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Daily Active (DAU):</span>
            <span className="font-bold text-slate-900">{cs.dau.toLocaleString()}</span>
          </div>
        </div>

        {/* Metric 2: Net Promoter Score */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 card-shadow flex flex-col justify-between relative group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-slate-800 text-xs font-bold">
                <Folder className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>NPS Score</span>
              </div>
              <span className="text-[10px] font-bold text-slate-950 bg-amber-300 px-2 py-0.5 rounded-full">
                Top Decile
              </span>
            </div>
            <div className="text-3xl font-extrabold font-tabular text-slate-950">
              {cs.nps > 0 ? `+${cs.nps}` : cs.nps}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1">
              &uarr; <strong className="text-emerald-600 font-bold">+{cs.npsChange} pts</strong> vs prior period
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>SaaS Benchmark:</span>
            <span className="font-bold text-emerald-600">&gt; 50 (Elite)</span>
          </div>
        </div>

        {/* Metric 3: First Response Time (Live Chat) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 card-shadow flex flex-col justify-between relative group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-slate-800 text-xs font-bold">
                <Folder className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>Chat Response</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Live Support
              </span>
            </div>
            <div className="text-3xl font-extrabold font-tabular text-slate-950">
              {cs.chatFrtMins} <span className="text-sm font-semibold text-slate-400">mins</span>
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1">
              Email FRT: <strong className="text-slate-900 font-bold">{cs.emailFrtMins} mins</strong>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Slack Connect:</span>
            <span className="font-bold text-slate-900">{cs.slackFrtMins} mins</span>
          </div>
        </div>

        {/* Metric 4: Ticket Resolution SLA */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 card-shadow flex flex-col justify-between relative group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-slate-800 text-xs font-bold">
                <Folder className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>SLA Compliance</span>
              </div>
              <span className="text-[10px] font-bold text-slate-950 bg-amber-300 px-2 py-0.5 rounded-full">
                Target Exceeded
              </span>
            </div>
            <div className="text-3xl font-extrabold font-tabular text-slate-950">
              {cs.slaRate}%
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1">
              Queue Status: <strong className="text-slate-900 font-bold">{cs.closedTickets} Closed</strong> · {cs.openTickets} Open
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>P1 Breaches:</span>
            <span className="font-bold text-emerald-600">0 Overdue</span>
          </div>
        </div>
      </div>

      {/* Row 2: Active Users DAU/MAU Area Chart */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 card-shadow">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-slate-800 text-xs font-bold max-w-fit mb-1">
              <Folder className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>Engagement Volume</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-950">
              Daily vs. Monthly Active User Expansion (DAU vs MAU)
            </h3>
          </div>
          {onOpenDataModal && (
            <button
              onClick={onOpenDataModal}
              className="text-xs font-bold text-slate-600 hover:text-slate-950 flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Series</span>
            </button>
          )}
        </div>
        <div>
          <EngagementAreaChart data={cs.engagementSeries} />
        </div>
      </div>

      {/* Row 3: Dual NPS & CSAT Quartile Distribution Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <QuartileCard data={dynamicNpsQuartile} />
        <QuartileCard data={dynamicCsatQuartile} />
      </div>

      {/* Row 4: Support Response Time & Resolution Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 card-shadow flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-slate-800 text-xs font-bold max-w-fit mb-1">
              <Folder className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>Response Speeds</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-950">
              First Response Time (FRT) across Channels
            </h3>
          </div>
          <div className="flex-1">
            <ResponseTimeLineChart data={cs.responseTimeSeries} />
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-6 card-shadow flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-slate-800 text-xs font-bold max-w-fit mb-1">
              <Folder className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>Queue Health</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-950">
              Ticket Resolution Ratio (Open vs. Closed)
            </h3>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <TicketResolutionRatioBar
              openCount={cs.openTickets}
              closedCount={cs.closedTickets}
              slaRate={cs.slaRate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
