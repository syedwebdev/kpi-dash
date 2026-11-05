import React from 'react';
import { DashboardTab, UserRole } from '../../types/dashboard';
import {
  Activity,
  RefreshCw,
  Check,
  Heart,
  Star,
  Bell,
  Grid,
  Sparkles,
  Download,
  Plus,
  Shield,
} from 'lucide-react';

interface HeaderProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  onOpenIntegrations: () => void;
  onOpenExport: () => void;
  onOpenDataModal: () => void;
  isUsingCustomData?: boolean;
  onQuickSync?: () => Promise<void>;
  isSyncing?: boolean;
  currentRole: UserRole;
  setCurrentRole: (r: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenIntegrations,
  onOpenExport,
  onOpenDataModal,
  isUsingCustomData = false,
  onQuickSync,
  isSyncing = false,
  currentRole,
  setCurrentRole,
}) => {
  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100 select-none">
      {/* Left zone: Activity icon, Sync, Check, and User Profile Lockup */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Quick action buttons */}
        <div className="flex items-center gap-1.5 text-slate-400">
          <button
            onClick={() => setActiveTab('financial')}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            title="Operational Pulse"
          >
            <Activity className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onQuickSync}
            disabled={isSyncing}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors disabled:opacity-50"
            title="Sync Source Systems"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-500' : ''}`} />
          </button>
          <button
            onClick={onOpenDataModal}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            title="Verified Data Status"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* User profile avatar lockup (matching Celeste T. Koch lockup in image) */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-300 font-bold text-xs flex items-center justify-center ring-2 ring-amber-100">
            CT
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900">
                Celeste T. Koch
              </span>
              <div className="flex items-center gap-1 text-slate-400">
                <Heart className="w-2.5 h-2.5 fill-slate-300 text-slate-300" />
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              @Executive · {currentRole === 'executive' ? 'C-Suite Access' : currentRole}
            </div>
          </div>
        </div>
      </div>

      {/* Right zone: Greeting, Date Pill, Grid Switcher, Add Data & Export */}
      <div className="flex items-center gap-3 ml-auto flex-wrap">
        {/* Subtle Greeting with sparkle */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Hi Celeste,</span>
          <span className="text-slate-400">Welcome back</span>
        </div>

        {/* Date pill badge like [ Sat, 29 Aug · 3 ] in image */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-xs text-slate-700 font-medium border border-slate-200/60 shadow-2xs">
          <Bell className="w-3.5 h-3.5 text-slate-500" />
          <span>Thu, 05 Nov</span>
          <span className="w-4 h-4 rounded-full bg-slate-900 text-amber-300 text-[10px] font-bold flex items-center justify-center">
            3
          </span>
        </div>

        {/* Role Selector Trigger */}
        <div className="flex items-center bg-slate-100 rounded-full px-2.5 py-1 text-xs border border-slate-200/60">
          <Shield className="w-3 h-3 text-amber-500 mr-1" />
          <select
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value as UserRole)}
            className="bg-transparent text-slate-800 text-xs font-semibold focus:outline-hidden cursor-pointer"
          >
            <option value="executive">Executive</option>
            <option value="vp_eng">VP Eng</option>
            <option value="head_cs">Head CS</option>
            <option value="board_investor">Board</option>
          </select>
        </div>

        {/* Add Real Data & Export buttons */}
        <button
          onClick={onOpenDataModal}
          className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-[#FACC15] hover:bg-amber-400 rounded-full transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{isUsingCustomData ? 'Manage Data' : 'Add Real Data'}</span>
        </button>

        <button
          onClick={onOpenExport}
          className="p-2 rounded-full bg-slate-950 hover:bg-slate-800 text-white transition-colors"
          title="Export KPI Brief"
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        {/* 4-dot Grid icon button like in image */}
        <button
          onClick={onOpenIntegrations}
          className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          title="Pipeline Connectors"
        >
          <Grid className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
