import React from 'react';
import { TimeRange } from '../../types/dashboard';
import { useDashboardData } from '../../context/DashboardDataContext';
import { DeploymentBarChart } from '../charts/DeploymentBarChart';
import { LeadTimeLineChart } from '../charts/LeadTimeLineChart';
import { CfrDonutChart } from '../charts/CfrDonutChart';
import { SprintVelocityChart } from '../charts/SprintVelocityChart';
import {
  Folder,
  GitBranch,
  Clock,
  ArrowDown,
  Activity,
  CheckCircle2,
  Edit3,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react';

interface EngineeringViewProps {
  timeRange: TimeRange;
  onOpenDataModal?: () => void;
  onOpenIntegrations?: () => void;
  onOpenExport?: () => void;
}

export const EngineeringView: React.FC<EngineeringViewProps> = ({
  timeRange,
  onOpenDataModal,
}) => {
  const { dataset } = useDashboardData();
  const eng = dataset.engineering;

  return (
    <div className="space-y-4">
      {/* Top 4 DORA Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Deployment Frequency */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 card-shadow flex flex-col justify-between relative group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-slate-800 text-xs font-bold">
                <Folder className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>Deployments</span>
              </div>
              <span className="text-[10px] font-bold text-slate-950 bg-amber-300 px-2 py-0.5 rounded-full">
                Elite
              </span>
            </div>
            <div className="text-3xl font-extrabold font-tabular text-slate-950">
              {eng.deploysPerDay} <span className="text-sm font-semibold text-slate-400">/ day</span>
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>DORA Elite Tier (&gt; 1 / day)</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Automated CI/CD:</span>
            <span className="font-bold text-slate-900">100% Trunk Based</span>
          </div>
        </div>

        {/* Metric 2: Lead Time for Changes */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 card-shadow flex flex-col justify-between relative group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-slate-800 text-xs font-bold">
                <Folder className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>Lead Time</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                -28% MoM
              </span>
            </div>
            <div className="text-3xl font-extrabold font-tabular text-slate-950">
              {eng.leadTimeHours} <span className="text-sm font-semibold text-slate-400">hrs</span>
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1">
              <ArrowDown className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
              <span>Target SLA (&le; 24.0 hours)</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Commit to Prod:</span>
            <span className="font-bold text-slate-900">Fast Track</span>
          </div>
        </div>

        {/* Metric 3: Change Failure Rate */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 card-shadow flex flex-col justify-between relative group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-slate-800 text-xs font-bold">
                <Folder className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>Stability</span>
              </div>
              <span className="text-[10px] font-bold text-slate-950 bg-amber-300 px-2 py-0.5 rounded-full">
                &lt; 5% Target
              </span>
            </div>
            <div className="text-3xl font-extrabold font-tabular text-slate-950">
              {eng.changeFailureRate}%
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Change Failure Rate</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Rollback Automation:</span>
            <span className="font-bold text-slate-900">&lt; 3 mins</span>
          </div>
        </div>

        {/* Metric 4: MTTR */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 card-shadow flex flex-col justify-between relative group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-slate-800 text-xs font-bold">
                <Folder className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>MTTR Recovery</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Faster
              </span>
            </div>
            <div className="text-3xl font-extrabold font-tabular text-slate-950">
              {eng.mttrHours} <span className="text-sm font-semibold text-slate-400">hrs</span>
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1">
              <ArrowDown className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
              <span>{Math.abs(eng.mttrChangePercent)}% faster resolution</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Active Outages:</span>
            <span className="font-bold text-emerald-600">0 P1 Incidents</span>
          </div>
        </div>
      </div>

      {/* Row 2: Deployment Frequency & Lead Time for Changes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Deployment Frequency Bar Chart */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 card-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-slate-800 text-xs font-bold max-w-fit mb-1">
                <Folder className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>Deployment Frequency</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-950">
                Production Releases vs. Hotfixes
              </h3>
            </div>
            {onOpenDataModal && (
              <button
                onClick={onOpenDataModal}
                className="text-xs font-bold text-slate-600 hover:text-slate-950 flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}
          </div>
          <div className="flex-1">
            <DeploymentBarChart data={eng.deploymentsSeries} />
          </div>
        </div>

        {/* Lead Time for Changes Line Chart */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 card-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-slate-800 text-xs font-bold max-w-fit mb-1">
                <Folder className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>Lead Time Trend</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-950">
                Commit to Production Turnaround
              </h3>
            </div>
            {onOpenDataModal && (
              <button
                onClick={onOpenDataModal}
                className="text-xs font-bold text-slate-600 hover:text-slate-950 flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}
          </div>
          <div className="flex-1">
            <LeadTimeLineChart data={eng.leadTimeSeries} />
          </div>
        </div>
      </div>

      {/* Row 3: CFR Donut Chart & Sprint Velocity Stacked Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* CFR Donut Chart */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 card-shadow flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-slate-800 text-xs font-bold max-w-fit mb-1">
              <Folder className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>Change Failure Rate</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-950">
              Release Stability Donut
            </h3>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <CfrDonutChart failureRate={eng.changeFailureRate} totalDeployments={eng.totalDeployments} />
          </div>
        </div>

        {/* Sprint Velocity Stacked Bars */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 card-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-slate-800 text-xs font-bold max-w-fit mb-1">
                <Folder className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>Sprint Velocity</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-950">
                Planned vs. Completed Story Points (Last 6 Sprints)
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
          <div className="flex-1">
            <SprintVelocityChart data={eng.sprintSeries} />
          </div>
        </div>
      </div>
    </div>
  );
};
