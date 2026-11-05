import React, { useState } from 'react';
import { DashboardTab, TimeRange, UserRole, IntegrationSource } from './types/dashboard';
import { USER_ROLES, INITIAL_INTEGRATIONS } from './data/mockData';
import { DashboardDataProvider, useDashboardData } from './context/DashboardDataContext';
import { SidebarRail } from './components/layout/SidebarRail';
import { Header } from './components/layout/Header';
import { HeroTitleBar } from './components/layout/HeroTitleBar';
import { FinancialView } from './components/views/FinancialView';
import { EngineeringView } from './components/views/EngineeringView';
import { CustomerSuccessView } from './components/views/CustomerSuccessView';
import { IntegrationsModal } from './components/modals/IntegrationsModal';
import { ExportModal } from './components/modals/ExportModal';
import { DataManagementModal } from './components/modals/DataManagementModal';
import { RestrictedView } from './components/common/RestrictedView';

function DashboardContent() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('financial');
  const [timeRange, setTimeRange] = useState<TimeRange>('12m');
  const [currentRole, setCurrentRole] = useState<UserRole>('executive');
  const [integrations, setIntegrations] = useState<IntegrationSource[]>(INITIAL_INTEGRATIONS);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [revalidateInterval, setRevalidateInterval] = useState<string>('15m');

  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState<boolean>(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const { isUsingCustomData } = useDashboardData();
  const activeRoleConfig = USER_ROLES.find((r) => r.id === currentRole) || USER_ROLES[0];

  // Pipeline Sync Handler
  const handleTriggerSync = async () => {
    setIsSyncing(true);
    setSyncToast('Extracting automated Stripe, GitHub, and CRM webhook pipelines...');

    await new Promise((resolve) => setTimeout(resolve, 800));

    setIntegrations((prev) =>
      prev.map((item) => ({
        ...item,
        status: 'connected',
        lastSync: 'Just now',
        apiLatency: `${Math.floor(Math.random() * 25 + 18)}ms`,
      }))
    );

    setIsSyncing(false);
    setLastSyncTime('Just now');
    setSyncToast('All source systems synchronized successfully');
    setTimeout(() => setSyncToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#E9EEF2] text-slate-900 py-3 sm:py-6 px-2 sm:px-4 lg:px-6 flex flex-col justify-center items-center">
      {/* The Master Rounded Dashboard Canvas from image.png */}
      <div className="w-full max-w-[1440px] bg-white rounded-[28px] sm:rounded-[36px] shadow-2xl shadow-slate-300/60 border border-slate-200/60 p-4 sm:p-6 lg:p-7 flex flex-col md:flex-row gap-4 sm:gap-6 min-h-[92vh]">
        {/* Left Vertical Icon Rail from image.png */}
        <SidebarRail
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenDataModal={() => setIsDataModalOpen(true)}
          onOpenIntegrations={() => setIsIntegrationsOpen(true)}
        />

        {/* Right Main Dashboard Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar matching image.png (profile, icons, date pill, greeting) */}
          <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenIntegrations={() => setIsIntegrationsOpen(true)}
            onOpenExport={() => setIsExportOpen(true)}
            onOpenDataModal={() => setIsDataModalOpen(true)}
            isUsingCustomData={isUsingCustomData}
            onQuickSync={handleTriggerSync}
            isSyncing={isSyncing}
            currentRole={currentRole}
            setCurrentRole={setCurrentRole}
          />

          {/* Hero Title Row (Two-tone headline + yellow sunburst + pill dropdowns) */}
          <HeroTitleBar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />

          {/* Sync Toast Feedback */}
          {syncToast && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2 rounded-xl text-xs font-semibold my-2 flex items-center justify-between animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                <span>{syncToast}</span>
              </div>
              <span className="text-[10px] text-amber-700 font-mono">ISR Cache Revalidated</span>
            </div>
          )}

          {/* Main Operational View Content */}
          <main className="mt-3 flex-1">
            {activeTab === 'financial' && (
              activeRoleConfig.canViewFinancials ? (
                <FinancialView
                  timeRange={timeRange}
                  onOpenDataModal={() => setIsDataModalOpen(true)}
                  onOpenIntegrations={() => setIsIntegrationsOpen(true)}
                  onOpenExport={() => setIsExportOpen(true)}
                />
              ) : (
                <RestrictedView
                  currentRole={activeRoleConfig}
                  requiredRoleName="C-Suite / Executive or Board Clearance"
                  onSwitchToExecutive={() => setCurrentRole('executive')}
                />
              )
            )}

            {activeTab === 'engineering' && (
              activeRoleConfig.canViewEngineering ? (
                <EngineeringView
                  timeRange={timeRange}
                  onOpenDataModal={() => setIsDataModalOpen(true)}
                  onOpenIntegrations={() => setIsIntegrationsOpen(true)}
                  onOpenExport={() => setIsExportOpen(true)}
                />
              ) : (
                <RestrictedView
                  currentRole={activeRoleConfig}
                  requiredRoleName="VP Engineering or Executive Clearance"
                  onSwitchToExecutive={() => setCurrentRole('executive')}
                />
              )
            )}

            {activeTab === 'customer_success' && (
              activeRoleConfig.canViewCustomerSuccess ? (
                <CustomerSuccessView
                  timeRange={timeRange}
                  onOpenDataModal={() => setIsDataModalOpen(true)}
                  onOpenIntegrations={() => setIsIntegrationsOpen(true)}
                  onOpenExport={() => setIsExportOpen(true)}
                />
              ) : (
                <RestrictedView
                  currentRole={activeRoleConfig}
                  requiredRoleName="Head of Customer Success or Executive Clearance"
                  onSwitchToExecutive={() => setCurrentRole('executive')}
                />
              )
            )}
          </main>
        </div>
      </div>

      {/* Data Management Modal */}
      <DataManagementModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
      />

      {/* Integrations Modal */}
      <IntegrationsModal
        isOpen={isIntegrationsOpen}
        onClose={() => setIsIntegrationsOpen(false)}
        integrations={integrations}
        onTriggerSyncAll={handleTriggerSync}
        isSyncing={isSyncing}
        revalidateInterval={revalidateInterval}
        setRevalidateInterval={setRevalidateInterval}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        timeRange={timeRange}
        currentRole={currentRole}
      />
    </div>
  );
}

export default function App() {
  return (
    <DashboardDataProvider>
      <DashboardContent />
    </DashboardDataProvider>
  );
}
