import React from 'react';
import { DashboardTab } from '../../types/dashboard';
import {
  Sparkles,
  Plus,
  DollarSign,
  Cpu,
  Users,
  Database,
  ArrowLeft,
  Sliders,
  Check,
} from 'lucide-react';

interface SidebarRailProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  onOpenDataModal: () => void;
  onOpenIntegrations: () => void;
}

export const SidebarRail: React.FC<SidebarRailProps> = ({
  activeTab,
  setActiveTab,
  onOpenDataModal,
  onOpenIntegrations,
}) => {
  return (
    <aside className="w-16 shrink-0 flex flex-col items-center justify-between py-6 border-r border-slate-100 select-none">
      {/* Top Logo */}
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-950 hover:rotate-45 transition-transform duration-300 cursor-pointer">
          <Sparkles className="w-5 h-5 fill-slate-950" />
        </div>
        <span className="text-[10px] font-extrabold tracking-wider text-slate-800 uppercase mt-1">
          AI-RL
        </span>
      </div>

      {/* Middle Vertical Icon Navigation */}
      <div className="flex flex-col items-center gap-3.5 my-auto">
        {/* Quick Add Button */}
        <button
          onClick={onOpenDataModal}
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          title="Add Real Data"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* View 1: Financials (Yellow active circular badge like 1x02 in image) */}
        <button
          onClick={() => setActiveTab('financial')}
          className={`w-9 h-9 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
            activeTab === 'financial'
              ? 'bg-[#FACC15] text-slate-950 shadow-sm scale-105 ring-2 ring-amber-200'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
          }`}
          title="Financial Health & Growth"
        >
          <DollarSign className="w-4 h-4" />
        </button>

        {/* View 2: Engineering / DORA */}
        <button
          onClick={() => setActiveTab('engineering')}
          className={`w-9 h-9 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
            activeTab === 'engineering'
              ? 'bg-[#FACC15] text-slate-950 shadow-sm scale-105 ring-2 ring-amber-200'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
          }`}
          title="DevOps & DORA Velocity"
        >
          <Cpu className="w-4 h-4" />
        </button>

        {/* View 3: Customer Success */}
        <button
          onClick={() => setActiveTab('customer_success')}
          className={`w-9 h-9 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
            activeTab === 'customer_success'
              ? 'bg-[#FACC15] text-slate-950 shadow-sm scale-105 ring-2 ring-amber-200'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
          }`}
          title="Customer Success & Support"
        >
          <Users className="w-4 h-4" />
        </button>

        {/* Pipelines Trigger */}
        <button
          onClick={onOpenIntegrations}
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          title="Source System Integrations"
        >
          <Database className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-col items-center gap-2.5">
        <button
          onClick={onOpenDataModal}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          title="Data Manager"
        >
          <Check className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setActiveTab(activeTab === 'financial' ? 'engineering' : activeTab === 'engineering' ? 'customer_success' : 'financial')}
          className="w-9 h-9 rounded-full bg-slate-950 text-white flex items-center justify-center shadow-md hover:bg-slate-800 transition-colors"
          title="Next View"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
