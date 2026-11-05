import React from 'react';
import { UserRole, RoleConfig } from '../../types/dashboard';
import { Lock, ShieldAlert, ArrowRight } from 'lucide-react';

interface RestrictedViewProps {
  currentRole: RoleConfig;
  requiredRoleName: string;
  onSwitchToExecutive: () => void;
}

export const RestrictedView: React.FC<RestrictedViewProps> = ({
  currentRole,
  requiredRoleName,
  onSwitchToExecutive,
}) => {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-10 text-center max-w-xl mx-auto my-12 space-y-4 card-shadow">
      <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-500">
        <Lock className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-extrabold text-slate-950">
          Access Restricted by Domain RBAC Policy
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Your current active session (<span className="text-slate-900 font-mono font-medium">{currentRole.domain}</span>) does not possess executive clearance to view unredacted financial ledgers.
        </p>
      </div>

      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 max-w-md mx-auto text-left space-y-1">
        <div className="flex justify-between">
          <span>Active Role:</span>
          <span className="font-semibold text-slate-900">{currentRole.label}</span>
        </div>
        <div className="flex justify-between">
          <span>Required Clearance:</span>
          <span className="font-semibold text-amber-600">{requiredRoleName}</span>
        </div>
        <div className="flex justify-between">
          <span>Enforcement:</span>
          <span className="font-mono text-slate-400">NextAuth / Clerk Domain Verified</span>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={onSwitchToExecutive}
          className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-[#FACC15] hover:bg-amber-400 rounded-full transition-colors inline-flex items-center gap-2 shadow-xs"
        >
          <span>Simulate Switch to C-Suite / Executive</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

