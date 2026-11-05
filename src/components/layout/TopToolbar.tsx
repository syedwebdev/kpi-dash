import React from 'react';
import { DashboardTab, TimeRange, UserRole, RoleConfig } from '../../types/dashboard';
import { Database, RefreshCw, UserCheck, Shield, ChevronDown } from 'lucide-react';

interface TopToolbarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  roles: RoleConfig[];
  onOpenIntegrations: () => void;
  onQuickSync: () => Promise<void>;
  isSyncing: boolean;
  lastSyncTime: string;
  onOpenDataModal: () => void;
  isUsingCustomData: boolean;
  isAllBlank: boolean;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({
  activeTab,
  setActiveTab,
  timeRange,
  setTimeRange,
  currentRole,
  setCurrentRole,
  roles,
  onOpenIntegrations,
  onQuickSync,
  isSyncing,
  lastSyncTime,
  onOpenDataModal,
  isUsingCustomData,
  isAllBlank,
}) => {
  const activeRoleConfig = roles.find((r) => r.id === currentRole) || roles[0];

  return (
    <div className="border-b border-slate-800 bg-slate-950/40 px-6 py-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: View Tabs (Segmented Control conforming to Section 1.A) */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto">
          <button
            onClick={() => setActiveTab('financial')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'financial'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Financial Health &amp; Growth</span>
            <span className="text-[10px] text-slate-500 font-normal">Executive</span>
          </button>

          <button
            onClick={() => setActiveTab('engineering')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'engineering'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Product &amp; Engineering</span>
            <span className="text-[10px] text-slate-500 font-normal">DORA / DevOps</span>
          </button>

          <button
            onClick={() => setActiveTab('customer_success')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'customer_success'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Customer Success &amp; Support</span>
            <span className="text-[10px] text-slate-500 font-normal">CS View</span>
          </button>
        </div>

        {/* Right: Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Time Range Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            {(['30d', '90d', '12m', 'ytd'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors uppercase whitespace-nowrap cursor-pointer ${
                  timeRange === range
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Data State Badge & Add Real Data trigger */}
          <button
            onClick={onOpenDataModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
              isAllBlank
                ? 'bg-amber-950/50 hover:bg-amber-900/60 border-amber-800 text-amber-300'
                : isUsingCustomData
                ? 'bg-emerald-950/50 hover:bg-emerald-900/60 border-emerald-800 text-emerald-300'
                : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full inline-block ${
                isAllBlank ? 'bg-amber-400' : isUsingCustomData ? 'bg-emerald-400' : 'bg-indigo-400'
              }`}
            />
            <span className="font-medium">
              {isAllBlank ? 'No Data Loaded' : isUsingCustomData ? 'Real Data Active' : 'Sample Data'}
            </span>
            <span className="text-[11px] text-slate-400 font-normal underline decoration-slate-600 ml-0.5">
              Edit
            </span>
          </button>

          {/* Pipeline Sync Button */}
          <button
            onClick={onOpenIntegrations}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            title="Open Automated Pipeline Integrations"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Sources:</span>
            <span className="font-semibold text-white">4/4 Synced</span>
            <span className="text-slate-500 font-tabular text-[11px]">({lastSyncTime})</span>
          </button>

          {/* Quick Refresh Button */}
          <button
            onClick={onQuickSync}
            disabled={isSyncing}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh Operational Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          {/* Role-Based Access Control Switcher */}
          <div className="relative flex items-center">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-300">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-500 hidden xl:inline">Role:</span>
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-hidden cursor-pointer"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id} className="bg-slate-900 text-slate-200">
                    {r.label} ({r.domain})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
