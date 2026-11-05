import React, { useState } from 'react';
import { TimeRange } from '../../types/dashboard';
import { useDashboardData } from '../../context/DashboardDataContext';
import { PillBarChart } from '../charts/PillBarChart';
import { ConcentricRings } from '../charts/ConcentricRings';
import { WeeklyStemChart } from '../charts/WeeklyStemChart';
import {
  Folder,
  Plus,
  Minus,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  ArrowRight,
  ShieldCheck,
  Edit3,
  Sparkles,
  Star,
  Check,
} from 'lucide-react';

interface FinancialViewProps {
  timeRange: TimeRange;
  onOpenDataModal?: () => void;
  onOpenIntegrations?: () => void;
  onOpenExport?: () => void;
}

export const FinancialView: React.FC<FinancialViewProps> = ({
  timeRange,
  onOpenDataModal,
  onOpenIntegrations,
  onOpenExport,
}) => {
  const { dataset } = useDashboardData();
  const fin = dataset.financials;

  const [activeSubTab, setActiveSubTab] = useState<'revenue' | 'churn' | 'cashflow' | 'unit_econ'>('revenue');

  const formatCurrency = (val: number) => {
    if (Math.abs(val) >= 1_000_000) return `${val < 0 ? '-' : ''}$${(Math.abs(val) / 1_000_000).toFixed(2)}M`;
    if (Math.abs(val) >= 1_000) return `${val < 0 ? '-' : ''}$${(Math.abs(val) / 1_000).toFixed(0)}k`;
    return `${val < 0 ? '-' : ''}$${Math.abs(val).toLocaleString()}`;
  };

  const effectiveRevenue = fin.totalRevenue || fin.arr;
  const ltvCacRatio = fin.cac > 0 ? parseFloat((fin.ltv / fin.cac).toFixed(1)) : 0;
  const cashOnHandVal = fin.cashOnHand || fin.cashReserves;
  const runwayMonths = fin.monthlyNetBurn > 0 ? parseFloat((cashOnHandVal / fin.monthlyNetBurn).toFixed(1)) : 0;
  const grossProfitVal = fin.grossProfit || effectiveRevenue * (fin.grossMarginPercent / 100);

  // Map rolling series to pill bar chart
  const barData = fin.rollingSeries && fin.rollingSeries.length > 0
    ? fin.rollingSeries.map((s, idx) => ({
        label: idx % 3 === 0 ? s.period.split(' ')[0] : '',
        value: s.grossChurn,
        isHighlight: idx === fin.rollingSeries.length - 2 || idx === fin.rollingSeries.length - 1,
        tooltipText: `${s.nrr}% NRR`,
      }))
    : undefined;

  return (
    <div className="space-y-4">
      {/* Top Grid: Card 1 (Wellness/Financials), Card 2 (Analytics Bar Chart), Card 3 (Progress) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Card 1 (Left): "Wellness / Financials" (like top-left in image) */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 card-shadow flex flex-col justify-between relative group">
          <div>
            {/* Folder badge & category pills */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-slate-800 text-xs font-bold">
                <Folder className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>Financials</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Churn: {fin.churnRate}%</span>
              </div>
            </div>

            {/* Big Headline Metric */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-tabular text-slate-950 tracking-tight">
                {formatCurrency(effectiveRevenue)}
              </span>
              <span className="text-[11px] font-bold text-slate-950 bg-amber-300 px-2 py-0.5 rounded-full">
                +{fin.growthRate}%
              </span>
            </div>
            <div className="text-xs font-medium text-slate-400 mt-1">
              ARR Total · Recognized Revenue
            </div>

            {/* Section Divider: CORE METRICS + - */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                <span>Core Operations Metrics</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={onOpenDataModal} className="p-0.5 text-slate-400 hover:text-slate-900">
                    <Plus className="w-3 h-3" />
                  </button>
                  <button onClick={onOpenDataModal} className="p-0.5 text-slate-400 hover:text-slate-900">
                    <Minus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Two Column Sub-stats */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold font-tabular text-slate-950">
                    {formatCurrency(fin.mrr)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Monthly MRR
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-tabular text-slate-950">
                    {fin.customerCount.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Active Customers ({fin.netNewCustomers > 0 ? `+${fin.netNewCustomers}` : fin.netNewCustomers} net)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Edit affordance */}
          {onOpenDataModal && (
            <button
              onClick={onOpenDataModal}
              className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center justify-between"
            >
              <span>Net New: <strong className="text-emerald-600 font-tabular">+{formatCurrency(fin.netNewMrr)}</strong></span>
              <Edit3 className="w-3.5 h-3.5 text-slate-400 hover:text-slate-900" />
            </button>
          )}
        </div>

        {/* Card 2 (Center): "Analytics / Signature Bar Chart" (like center card in image) */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 card-shadow flex flex-col justify-between relative">
          <div>
            {/* Header with yellow folder category tab & plus/minus */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-slate-800 text-xs font-bold">
                <Folder className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>Analytics</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <button onClick={onOpenDataModal} className="p-1 hover:text-slate-900">
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button onClick={onOpenDataModal} className="p-1 hover:text-slate-900">
                  <Minus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Top Dual Metrics: e.g. 123.6% NRR and 1.3% Churn */}
            <div className="flex items-baseline gap-6 mb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold font-tabular text-slate-950">
                    123.6%
                  </span>
                  <span className="text-[10px] font-bold text-slate-950 bg-amber-300 px-1.5 py-0.2 rounded-full">
                    NRR
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Net Retention Rate
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold font-tabular text-slate-950">
                    {fin.churnRate}%
                  </span>
                  <span className="text-[10px] font-bold text-slate-950 bg-amber-300 px-1.5 py-0.2 rounded-full">
                    Churn
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Gross Revenue Churn
                </div>
              </div>
            </div>

            {/* Signature Capsule/Pill Bar Chart from Image */}
            <div className="my-2">
              <PillBarChart data={barData} height={140} />
            </div>
          </div>

          {/* Bottom Category Filter Tabs matching image */}
          <div className="flex items-center gap-1 overflow-x-auto pt-3 border-t border-slate-100 text-[11px]">
            <button
              onClick={() => setActiveSubTab('revenue')}
              className={`px-3 py-1 rounded-md font-bold transition-colors whitespace-nowrap ${
                activeSubTab === 'revenue'
                  ? 'bg-amber-300 text-slate-950 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 bg-slate-50'
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setActiveSubTab('churn')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors whitespace-nowrap ${
                activeSubTab === 'churn'
                  ? 'bg-amber-300 text-slate-950 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 bg-slate-50'
              }`}
            >
              Gross Margin
            </button>
            <button
              onClick={() => setActiveSubTab('cashflow')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors whitespace-nowrap ${
                activeSubTab === 'cashflow'
                  ? 'bg-amber-300 text-slate-950 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 bg-slate-50'
              }`}
            >
              Cash Flow
            </button>
            <button
              onClick={() => setActiveSubTab('unit_econ')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors whitespace-nowrap ${
                activeSubTab === 'unit_econ'
                  ? 'bg-amber-300 text-slate-950 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 bg-slate-50'
              }`}
            >
              LTV:CAC
            </button>
          </div>
        </div>

        {/* Card 3 (Right): "Progress & Integrations Status" (like top-right in image) */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 card-shadow flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-slate-800 text-xs font-bold">
                <Folder className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>Progress</span>
              </div>
              <div className="w-5 h-5 rounded-full border-2 border-slate-200 border-t-amber-400" />
            </div>

            {/* Visual Thumbnail & Metric */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl mb-4 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-300 font-bold flex flex-col items-center justify-center shadow-xs">
                <Users className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-semibold text-slate-500">Active</span>
                  <span className="text-xl font-extrabold font-tabular text-slate-950">
                    {fin.customerCount}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Logo Accounts Verified
                </div>
              </div>
            </div>

            {/* Checkbox / Automated Pipeline Checklist */}
            <div className="space-y-2.5 text-xs">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Data Pipelines
              </div>

              <div
                onClick={onOpenIntegrations}
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="w-4 h-4 rounded-md bg-slate-900 text-amber-400 flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-slate-900 block">Stripe Billing API</span>
                  <span className="text-[10px] text-slate-400">Webhooks Active · 42ms</span>
                </div>
              </div>

              <div
                onClick={onOpenIntegrations}
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="w-4 h-4 rounded-md bg-slate-900 text-amber-400 flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-slate-900 block">GitHub CI/CD Engine</span>
                  <span className="text-[10px] text-slate-400">4.8 deploys/day · Elite</span>
                </div>
              </div>

              <div
                onClick={onOpenIntegrations}
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="w-4 h-4 rounded-md bg-slate-900 text-amber-400 flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-slate-900 block">HubSpot / Zendesk</span>
                  <span className="text-[10px] text-slate-400">96.2% SLA Adherence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Card 4 (Concentric Radar Rings), Card 5 (Yellow Highlight Box & Stems), Card 6 (Unit Econ & Velocity) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Card 4 (Bottom Left): "Get more exposure and monitor with precision" with yellow concentric rings */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 card-shadow flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-950 tracking-tight leading-snug">
              Get more exposure and monitor with precision
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Experience a unified view of your SaaS operations with automated pipelines. Keep a watchful eye on cash burn and retention with zero manual input.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={onOpenDataModal}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white rounded-full text-xs font-bold transition-colors shadow-xs"
              >
                Add Real Data
              </button>
              {onOpenExport && (
                <button
                  onClick={onOpenExport}
                  className="text-xs font-bold text-slate-600 hover:text-slate-950 transition-colors"
                >
                  Export Brief
                </button>
              )}
            </div>
          </div>

          {/* Yellow Concentric Radar Rings graphic from image */}
          <div className="shrink-0">
            <ConcentricRings value={fin.grossMarginPercent.toFixed(1)} unit="%" size={120} />
            <div className="text-center text-[10px] font-semibold text-slate-400 mt-1">
              Gross Margin
            </div>
          </div>
        </div>

        {/* Card 5 (Bottom Center): "Take a Breath Now / Yellow Highlight Box & Weekly Stems" */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 card-shadow flex flex-col justify-between">
          {/* Top Banner */}
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-extrabold text-slate-950 uppercase tracking-wider">
                Take a Breath Now
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Runway: <span className="font-semibold text-slate-900">{runwayMonths.toFixed(1)} months</span> · Net Burn {formatCurrency(fin.monthlyNetBurn)}/mo
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-900 bg-amber-300 px-2 py-0.5 rounded-full">
              Safe
            </span>
          </div>

          {/* Dual Split: Bright Yellow Box & Weekly Candlestick Stems */}
          <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-slate-100">
            {/* The signature bright yellow box from image.png */}
            <div
              onClick={onOpenDataModal}
              className="bg-[#FACC15] hover:bg-amber-400 text-slate-950 p-4 rounded-2xl flex-1 cursor-pointer transition-colors shadow-xs"
            >
              <div className="flex items-center justify-between text-[10px] font-extrabold">
                <span className="uppercase">Cash on Hand</span>
                <div className="flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-slate-950" />
                  <Star className="w-2.5 h-2.5 fill-slate-950" />
                </div>
              </div>
              <div className="text-2xl font-black font-tabular tracking-tight mt-1">
                {formatCurrency(cashOnHandVal)}
              </div>
              <div className="text-[10px] font-semibold text-slate-800 mt-0.5">
                {runwayMonths.toFixed(1)} mo Survival Runway
              </div>
            </div>

            {/* S M T W T F S Stem Pins */}
            <div className="shrink-0 flex flex-col items-center">
              <WeeklyStemChart />
              <span className="text-[9px] text-slate-400 font-medium mt-1">Daily Cadence</span>
            </div>
          </div>
        </div>

        {/* Card 6 (Bottom Right): "Velocity, LTV:CAC & Support" */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 card-shadow flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-slate-800 text-xs font-bold">
              <Folder className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>Unit Economics</span>
            </div>
            <span className="text-xs font-bold text-emerald-600 font-tabular">3.8:1</span>
          </div>

          {/* Metrics grid matching bottom-right of image */}
          <div className="space-y-3 my-auto">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 block">Operating Cash Flow</span>
                <span className="text-sm font-extrabold font-tabular text-slate-950">
                  {formatCurrency(fin.operatingCashFlow)}/mo
                </span>
              </div>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                OCF
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 block">LTV / CAC</span>
                <span className="text-sm font-extrabold font-tabular text-slate-950">
                  {ltvCacRatio}:1
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 block">Payback</span>
                <span className="text-sm font-extrabold font-tabular text-emerald-600">
                  8.2 mo
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Free Cash Margin:</span>
            <span className="font-bold font-tabular text-slate-900">48.6%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
