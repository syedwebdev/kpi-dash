import React, { useState } from 'react';
import { useDashboardData } from '../../context/DashboardDataContext';
import {
  X,
  Upload,
  Download,
  Database,
  FileSpreadsheet,
  Check,
  AlertCircle,
  RefreshCw,
  Trash2,
  Sliders,
  DollarSign,
  Cpu,
  Users,
  Code2,
} from 'lucide-react';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'form' | 'csv' | 'webhook';
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'form',
}) => {
  const {
    dataset,
    updateFinancials,
    updateEngineering,
    updateCustomerSuccess,
    clearToBlank,
    restoreSampleData,
    importCsvData,
    ingestWebhookPayload,
  } = useDashboardData();

  const [activeTab, setActiveTab] = useState<'form' | 'csv' | 'webhook'>(initialTab);
  const [formSection, setFormSection] = useState<'financials' | 'engineering' | 'customersuccess'>('financials');

  // Form local state
  const [formFin, setFormFin] = useState(dataset.financials);
  const [formEng, setFormEng] = useState(dataset.engineering);
  const [formCS, setFormCS] = useState(dataset.customerSuccess);

  // CSV local state
  const [csvTarget, setCsvTarget] = useState<'financials' | 'engineering' | 'customersuccess'>('financials');
  const [csvText, setCsvText] = useState('');
  const [csvStatus, setCsvStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  // Webhook local state
  const [webhookJson, setWebhookJson] = useState(`{
  "arr": 15500000,
  "mrr": 1290000,
  "growthRate": 58.4,
  "cashReserves": 9500000,
  "deploysPerDay": 5.2,
  "leadTimeHours": 14.8,
  "changeFailureRate": 2.8,
  "dau": 24800,
  "mau": 46200,
  "nps": 68,
  "csat": 95.8
}`);
  const [webhookStatus, setWebhookStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    updateFinancials(formFin);
    updateEngineering(formEng);
    updateCustomerSuccess(formCS);
    setSavedFeedback('Real data saved successfully to dashboard and localStorage');
    setTimeout(() => {
      setSavedFeedback(null);
      onClose();
    }, 1200);
  };

  const handleCsvImport = () => {
    if (!csvText.trim()) {
      setCsvStatus({ success: false, message: 'Please paste CSV content or upload a .csv file' });
      return;
    }
    const result = importCsvData(csvText, csvTarget);
    setCsvStatus(result);
    if (result.success) {
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvText(text);
      const result = importCsvData(text, csvTarget);
      setCsvStatus(result);
    };
    reader.readAsText(file);
  };

  const handleDownloadCsvTemplate = () => {
    let template = '';
    let filename = '';

    if (csvTarget === 'financials') {
      template = `period,revenue,arr,mrr,grossmargin,customers,churn,cashonhand,cashflow,netburn,nrr
Nov 25,12200000,12200000,1016666,77.5,1240,2.4,8500000,-350000,340000,112.5
Dec 25,12600000,12600000,1050000,77.8,1285,2.1,8450000,-310000,342000,114.2
Jan 26,13100000,13100000,1091666,78.0,1330,2.3,8400000,-280000,345000,113.8
Feb 26,13600000,13600000,1133333,78.2,1380,1.9,8350000,-255000,344000,116.0
Mar 26,14280000,14280000,1190000,78.5,1420,1.3,8200000,-210000,345000,123.6`;
      filename = 'saas_financials_template.csv';
    } else if (csvTarget === 'engineering') {
      template = `period,production,hotfix,leadtime\nWeek 1,18,2,22.4\nWeek 2,24,1,20.8\nWeek 3,22,3,19.5\nWeek 4,29,1,18.9\nWeek 5,27,2,17.6`;
      filename = 'engineering_dora_template.csv';
    } else {
      template = `date,dau,mau,nps,csat\nOct 06,18400,38200,58,92.5\nOct 13,19500,39600,60,93.2\nOct 20,20800,41000,61,94.0\nOct 27,22450,42500,62,94.6`;
      filename = 'customer_success_template.csv';
    }

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleWebhookIngest = () => {
    try {
      const parsed = JSON.parse(webhookJson);
      const res = ingestWebhookPayload(parsed);
      setWebhookStatus(res);
      if (res.success) {
        setTimeout(() => onClose(), 1500);
      }
    } catch (e: any) {
      setWebhookStatus({ success: false, message: `Invalid JSON syntax: ${e.message}` });
    }
  };

  const handleClearAll = () => {
    if (confirm('Clear all sample data and set the dashboard to a blank state? You can input your real numbers immediately.')) {
      clearToBlank();
      setSavedFeedback('Dashboard cleared to blank state');
      setTimeout(() => {
        setSavedFeedback(null);
        onClose();
      }, 1000);
    }
  };

  const handleRestoreDefaults = () => {
    restoreSampleData();
    setSavedFeedback('Restored default baseline template');
    setTimeout(() => {
      setSavedFeedback(null);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold text-white">
                Add &amp; Manage Real Operational Data
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Input your real figures directly, import via CSV spreadsheet, or ingest live webhook payloads
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Method Tabs */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950 px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('form')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'form'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Manual Form Input</span>
          </button>

          <button
            onClick={() => setActiveTab('csv')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'csv'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>CSV File Import</span>
          </button>

          <button
            onClick={() => setActiveTab('webhook')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'webhook'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>JSON / Webhook Ingest</span>
          </button>
        </div>

        {/* Tab 1: Form Input */}
        {activeTab === 'form' && (
          <form onSubmit={handleSaveForm} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Section Switcher */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 max-w-fit">
              <button
                type="button"
                onClick={() => setFormSection('financials')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  formSection === 'financials'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Financials &amp; Revenue
              </button>
              <button
                type="button"
                onClick={() => setFormSection('engineering')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  formSection === 'engineering'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                DevOps &amp; DORA
              </button>
              <button
                type="button"
                onClick={() => setFormSection('customersuccess')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  formSection === 'customersuccess'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-sky-400" />
                Customer Success
              </button>
            </div>

            {/* Financials Form Fields */}
            {formSection === 'financials' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {/* Revenue */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Total Recognized Revenue ($)
                    </label>
                    <input
                      type="number"
                      value={formFin.totalRevenue || formFin.arr}
                      onChange={(e) => setFormFin({ ...formFin, totalRevenue: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                      placeholder="e.g. 13850000"
                    />
                  </div>

                  {/* ARR */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Annual Recurring Revenue (ARR in $)
                    </label>
                    <input
                      type="number"
                      value={formFin.arr}
                      onChange={(e) => setFormFin({ ...formFin, arr: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                      placeholder="e.g. 14280000"
                    />
                  </div>

                  {/* MRR */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Monthly Recurring Revenue (MRR in $)
                    </label>
                    <input
                      type="number"
                      value={formFin.mrr}
                      onChange={(e) => setFormFin({ ...formFin, mrr: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                      placeholder="e.g. 1190000"
                    />
                  </div>

                  {/* Gross Margin % */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Gross Margin (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formFin.grossMarginPercent}
                      onChange={(e) => setFormFin({ ...formFin, grossMarginPercent: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                      placeholder="e.g. 78.5"
                    />
                  </div>

                  {/* Customer Count */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Active Customer Count (Logos)
                    </label>
                    <input
                      type="number"
                      value={formFin.customerCount}
                      onChange={(e) => setFormFin({ ...formFin, customerCount: parseInt(e.target.value, 10) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                      placeholder="e.g. 1420"
                    />
                  </div>

                  {/* Net New Customers */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Net New Customers / Logos Added
                    </label>
                    <input
                      type="number"
                      value={formFin.netNewCustomers}
                      onChange={(e) => setFormFin({ ...formFin, netNewCustomers: parseInt(e.target.value, 10) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                      placeholder="e.g. 64"
                    />
                  </div>

                  {/* Churn Rate % */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Gross Revenue Churn (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formFin.churnRate}
                      onChange={(e) => setFormFin({ ...formFin, churnRate: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                      placeholder="e.g. 1.3"
                    />
                  </div>

                  {/* Logo Churn % */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Logo Churn Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formFin.logoChurnRate}
                      onChange={(e) => setFormFin({ ...formFin, logoChurnRate: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                      placeholder="e.g. 1.8"
                    />
                  </div>

                  {/* Cash on Hand */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Cash on Hand / Liquid Treasury ($)
                    </label>
                    <input
                      type="number"
                      value={formFin.cashOnHand || formFin.cashReserves}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setFormFin({ ...formFin, cashOnHand: val, cashReserves: val });
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                      placeholder="e.g. 8200000"
                    />
                  </div>

                  {/* Operating Cash Flow */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Operating Cash Flow ($/month)
                    </label>
                    <input
                      type="number"
                      value={formFin.operatingCashFlow}
                      onChange={(e) => setFormFin({ ...formFin, operatingCashFlow: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                      placeholder="e.g. -210000"
                    />
                  </div>

                  {/* Free Cash Flow */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Free Cash Flow ($/month)
                    </label>
                    <input
                      type="number"
                      value={formFin.freeCashFlow}
                      onChange={(e) => setFormFin({ ...formFin, freeCashFlow: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                      placeholder="e.g. -245000"
                    />
                  </div>

                  {/* Monthly Net Burn */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Monthly Net Burn ($/month)
                    </label>
                    <input
                      type="number"
                      value={formFin.monthlyNetBurn}
                      onChange={(e) => setFormFin({ ...formFin, monthlyNetBurn: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                      placeholder="e.g. 345000"
                    />
                  </div>

                  {/* LTV */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Customer Lifetime Value (LTV in $)
                    </label>
                    <input
                      type="number"
                      value={formFin.ltv}
                      onChange={(e) => setFormFin({ ...formFin, ltv: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                      placeholder="e.g. 22800"
                    />
                  </div>

                  {/* CAC */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Customer Acquisition Cost (CAC in $)
                    </label>
                    <input
                      type="number"
                      value={formFin.cac}
                      onChange={(e) => setFormFin({ ...formFin, cac: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                      placeholder="e.g. 6000"
                    />
                  </div>

                  {/* Growth Rate */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      MRR Growth Rate (% YoY or MoM)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formFin.growthRate}
                      onChange={(e) => setFormFin({ ...formFin, growthRate: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                      placeholder="e.g. 52.8"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-md border border-slate-800 text-xs text-slate-400 flex flex-wrap gap-4">
                  <div>
                    <span className="font-semibold text-slate-200">Survival Runway:</span>{' '}
                    <span className="font-mono text-emerald-400 font-bold">
                      {formFin.monthlyNetBurn > 0 ? ((formFin.cashOnHand || formFin.cashReserves) / formFin.monthlyNetBurn).toFixed(1) : '∞'} months
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-200">LTV:CAC Ratio:</span>{' '}
                    <span className="font-mono text-emerald-400 font-bold">
                      {formFin.cac > 0 ? (formFin.ltv / formFin.cac).toFixed(1) : 0}:1
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-200">Gross Profit:</span>{' '}
                    <span className="font-mono text-slate-200 font-bold">
                      ${Math.round((formFin.totalRevenue || formFin.arr) * (formFin.grossMarginPercent / 100)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Engineering Form Fields */}
            {formSection === 'engineering' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Deployment Frequency (deploys per day)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formEng.deploysPerDay}
                    onChange={(e) => setFormEng({ ...formEng, deploysPerDay: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                    placeholder="e.g. 4.8"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Lead Time for Changes (hours to production)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formEng.leadTimeHours}
                    onChange={(e) => setFormEng({ ...formEng, leadTimeHours: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                    placeholder="e.g. 17.6"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Change Failure Rate (% of releases needing patch)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formEng.changeFailureRate}
                    onChange={(e) => setFormEng({ ...formEng, changeFailureRate: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                    placeholder="e.g. 3.2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Mean Time to Recovery (MTTR hours)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formEng.mttrHours}
                    onChange={(e) => setFormEng({ ...formEng, mttrHours: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                    placeholder="e.g. 0.7"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Total Deployments Count
                  </label>
                  <input
                    type="number"
                    value={formEng.totalDeployments}
                    onChange={(e) => setFormEng({ ...formEng, totalDeployments: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                    placeholder="e.g. 359"
                  />
                </div>
              </div>
            )}

            {/* Customer Success Form Fields */}
            {formSection === 'customersuccess' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Daily Active Users (DAU)
                  </label>
                  <input
                    type="number"
                    value={formCS.dau}
                    onChange={(e) => setFormCS({ ...formCS, dau: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                    placeholder="e.g. 22450"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Monthly Active Users (MAU)
                  </label>
                  <input
                    type="number"
                    value={formCS.mau}
                    onChange={(e) => setFormCS({ ...formCS, mau: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                    placeholder="e.g. 42500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Net Promoter Score (NPS points)
                  </label>
                  <input
                    type="number"
                    value={formCS.nps}
                    onChange={(e) => setFormCS({ ...formCS, nps: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                    placeholder="e.g. 62"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Customer Satisfaction (CSAT %)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formCS.csat}
                    onChange={(e) => setFormCS({ ...formCS, csat: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                    placeholder="e.g. 94.6"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Live Chat Response Time (mins)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formCS.chatFrtMins}
                    onChange={(e) => setFormCS({ ...formCS, chatFrtMins: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                    placeholder="e.g. 1.2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Open Tickets Backlog
                  </label>
                  <input
                    type="number"
                    value={formCS.openTickets}
                    onChange={(e) => setFormCS({ ...formCS, openTickets: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                    placeholder="e.g. 42"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Closed / Resolved Tickets
                  </label>
                  <input
                    type="number"
                    value={formCS.closedTickets}
                    onChange={(e) => setFormCS({ ...formCS, closedTickets: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                    placeholder="e.g. 320"
                  />
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/60 rounded-md transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear All to Blank Slate
                </button>
                <button
                  type="button"
                  onClick={handleRestoreDefaults}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
                >
                  Restore Baseline Sample
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Real Metrics
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: CSV Import */}
        {activeTab === 'csv' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300">Target Category:</span>
                <select
                  value={csvTarget}
                  onChange={(e) => setCsvTarget(e.target.value as any)}
                  className="bg-slate-950 border border-slate-700 text-xs text-white rounded px-2.5 py-1 focus:outline-hidden"
                >
                  <option value="financials">Financials &amp; ARR/MRR Series</option>
                  <option value="engineering">Engineering &amp; DORA Deployments</option>
                  <option value="customersuccess">Customer Success &amp; DAU/MAU</option>
                </select>
              </div>

              <button
                onClick={handleDownloadCsvTemplate}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                Download CSV Sample Template
              </button>
            </div>

            {/* Drag & drop / file picker */}
            <div className="border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-lg p-5 text-center transition-colors">
              <Upload className="w-6 h-6 text-slate-500 mx-auto mb-2" />
              <label className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer">
                <span>Upload a .CSV file</span>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-slate-500 mt-1">or paste raw CSV text below</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Raw CSV Data
              </label>
              <textarea
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="period,arr,mrr,grosschurn,nrr,netburn,cash&#10;Nov 25,12200000,1016666,2.4,112.5,340000,8500000"
                rows={7}
                className="w-full bg-slate-950 border border-slate-700 rounded-md p-3 text-xs text-slate-200 font-mono focus:border-indigo-500 focus:outline-hidden"
              />
            </div>

            {csvStatus && (
              <div
                className={`p-3 rounded-md text-xs flex items-center gap-2 ${
                  csvStatus.success
                    ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                    : 'bg-rose-950/60 border border-rose-800 text-rose-300'
                }`}
              >
                {csvStatus.success ? (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{csvStatus.message}</span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleCsvImport}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Apply Imported CSV Data
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Webhook / JSON Ingest */}
        {activeTab === 'webhook' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div>
              <span className="text-xs font-semibold text-white block">
                Live Data Ingestion Simulator
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Paste JSON payloads from Stripe, GitHub Actions, Jira, or custom API endpoints to push metrics directly into your live dashboard.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                JSON Metric Override Payload
              </label>
              <textarea
                value={webhookJson}
                onChange={(e) => setWebhookJson(e.target.value)}
                rows={9}
                className="w-full bg-slate-950 border border-slate-700 rounded-md p-3 text-xs text-emerald-400 font-mono focus:border-indigo-500 focus:outline-hidden"
              />
            </div>

            {webhookStatus && (
              <div
                className={`p-3 rounded-md text-xs flex items-center gap-2 ${
                  webhookStatus.success
                    ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                    : 'bg-rose-950/60 border border-rose-800 text-rose-300'
                }`}
              >
                {webhookStatus.success ? (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{webhookStatus.message}</span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleWebhookIngest}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Ingest &amp; Update Live State
              </button>
            </div>
          </div>
        )}

        {/* Global Feedback Toast */}
        {savedFeedback && (
          <div className="bg-emerald-950 border-t border-emerald-800 px-6 py-2.5 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in duration-150">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{savedFeedback}</span>
          </div>
        )}
      </div>
    </div>
  );
};
