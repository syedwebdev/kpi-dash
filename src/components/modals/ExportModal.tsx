import React, { useState } from 'react';
import { TimeRange, UserRole } from '../../types/dashboard';
import { Download, Copy, Check, FileText, X } from 'lucide-react';
import { useDashboardData } from '../../context/DashboardDataContext';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeRange: TimeRange;
  currentRole: UserRole;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  timeRange,
  currentRole,
}) => {
  const [copied, setCopied] = useState(false);
  const { dataset } = useDashboardData();
  const fin = dataset.financials;
  const eng = dataset.engineering;
  const cs = dataset.customerSuccess;

  if (!isOpen) return null;

  const formatCurrency = (val: number) => {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}k`;
    return `$${val.toLocaleString()}`;
  };

  const ltvCac = fin.cac > 0 ? (fin.ltv / fin.cac).toFixed(1) : '0';
  const runway = fin.monthlyNetBurn > 0 ? (fin.cashReserves / fin.monthlyNetBurn).toFixed(1) : '0';
  const stickiness = cs.mau > 0 ? ((cs.dau / cs.mau) * 100).toFixed(1) : '0';

  const summaryText = `# SaaS Executive & Operations KPI Briefing
Generated: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
Time Horizon: ${timeRange.toUpperCase()}
Access Domain: ${currentRole}
Data Mode: ${dataset.sourceType === 'template' ? 'Baseline Sample' : 'Real Custom Verified Data'}

--- REVENUE & FINANCIAL EFFICIENCY ---
- Total Revenue: ${formatCurrency(fin.totalRevenue || fin.arr)}
- ARR: ${formatCurrency(fin.arr)} · MRR: ${formatCurrency(fin.mrr)} (+${fin.growthRate}% Growth)
- Gross Margin: ${fin.grossMarginPercent.toFixed(1)}% (Gross Profit: ${formatCurrency(fin.grossProfit || (fin.totalRevenue || fin.arr) * (fin.grossMarginPercent / 100))})
- Customer Count: ${fin.customerCount.toLocaleString()} active logos (+${fin.netNewCustomers} net new)
- ARPU / ACV: ${formatCurrency(fin.arpu || (fin.customerCount > 0 ? (fin.totalRevenue || fin.arr) / fin.customerCount : 0))}/yr
- Churn Rate: ${fin.churnRate}% Revenue Churn · ${fin.logoChurnRate || 1.8}% Logo Churn
- Cash on Hand: ${formatCurrency(fin.cashOnHand || fin.cashReserves)} (Runway: ${runway} months)
- Cash Flow: ${formatCurrency(fin.operatingCashFlow)}/mo Operating Cash Flow (Free Cash Flow: ${formatCurrency(fin.freeCashFlow)})
- Monthly Net Burn: ${formatCurrency(fin.monthlyNetBurn)}/mo
- LTV : CAC: ${ltvCac}:1

--- PRODUCT & ENGINEERING (DORA) ---
- Deployment Frequency: ${eng.deploysPerDay} / day
- Lead Time for Changes: ${eng.leadTimeHours} hrs (Target <= 24h)
- Change Failure Rate (CFR): ${eng.changeFailureRate}%
- MTTR: ${eng.mttrHours} hours
- Total Deployments Tracked: ${eng.totalDeployments}

--- CUSTOMER SUCCESS & ENGAGEMENT ---
- Active Users: ${cs.dau.toLocaleString()} DAU / ${cs.mau.toLocaleString()} MAU (${stickiness}% stickiness)
- Net Promoter Score (NPS): ${cs.nps > 0 ? `+${cs.nps}` : cs.nps}
- CSAT Score: ${cs.csat}%
- Open vs Closed Tickets: ${cs.openTickets} Open / ${cs.closedTickets} Closed (${cs.slaRate}% within SLA)
- Chat FRT: ${cs.chatFrtMins} mins · Email FRT: ${cs.emailFrtMins} mins
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const data = {
      exportTimestamp: new Date().toISOString(),
      timeHorizon: timeRange,
      role: currentRole,
      sourceType: dataset.sourceType,
      financials: {
        totalRevenue: fin.totalRevenue || fin.arr,
        arr: fin.arr,
        mrr: fin.mrr,
        grossMarginPercent: fin.grossMarginPercent,
        grossProfit: fin.grossProfit || (fin.totalRevenue || fin.arr) * (fin.grossMarginPercent / 100),
        customerCount: fin.customerCount,
        netNewCustomers: fin.netNewCustomers,
        arpu: fin.arpu,
        churnRate: fin.churnRate,
        logoChurnRate: fin.logoChurnRate,
        growthRate: `${fin.growthRate}%`,
        netNewMrr: fin.netNewMrr,
        ltv: fin.ltv,
        cac: fin.cac,
        ltvCacRatio: ltvCac,
        cashOnHand: fin.cashOnHand || fin.cashReserves,
        monthlyNetBurn: fin.monthlyNetBurn,
        operatingCashFlow: fin.operatingCashFlow,
        freeCashFlow: fin.freeCashFlow,
        runwayMonths: runway,
        cashReserves: fin.cashReserves,
        rollingSeries: fin.rollingSeries,
      },
      engineeringDora: {
        deploysPerDay: eng.deploysPerDay,
        leadTimeHours: eng.leadTimeHours,
        changeFailureRate: `${eng.changeFailureRate}%`,
        mttrHours: eng.mttrHours,
        totalDeployments: eng.totalDeployments,
      },
      customerSuccess: {
        dau: cs.dau,
        mau: cs.mau,
        stickiness: `${stickiness}%`,
        nps: cs.nps,
        csat: cs.csat,
        openTickets: cs.openTickets,
        closedTickets: cs.closedTickets,
        slaRate: `${cs.slaRate}%`,
        chatFrtMins: cs.chatFrtMins,
        emailFrtMins: cs.emailFrtMins,
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saas-kpi-brief-${timeRange}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCsv = () => {
    const rows = [
      ['Metric', 'Value', 'Benchmark / Target', 'Status'],
      ['Total Recognized Revenue', formatCurrency(fin.totalRevenue || fin.arr), 'Primary Topline', fin.arr > 0 ? 'Healthy' : 'Pending'],
      ['Annual Recurring Revenue (ARR)', formatCurrency(fin.arr), '$10M+', fin.arr > 0 ? 'Healthy' : 'Pending'],
      ['Monthly Recurring Revenue (MRR)', formatCurrency(fin.mrr), 'Growth velocity', fin.mrr > 0 ? 'Healthy' : 'Pending'],
      ['Gross Margin (%)', `${fin.grossMarginPercent.toFixed(1)}%`, '>= 75.0%', fin.grossMarginPercent >= 75 ? 'Tier 1' : 'Standard'],
      ['Customer Count (Logos)', `${fin.customerCount.toLocaleString()}`, '+Growth', fin.customerCount > 0 ? 'Active' : 'Pending'],
      ['Gross Revenue Churn (%)', `${fin.churnRate}%`, '< 2.0%', fin.churnRate <= 2.0 ? 'Healthy' : 'Elevated'],
      ['Logo Churn (%)', `${fin.logoChurnRate || 1.8}%`, '< 2.5%', 'Tracked'],
      ['Cash on Hand', formatCurrency(fin.cashOnHand || fin.cashReserves), 'Liquid Reserves', 'Tracked'],
      ['Operating Cash Flow', `${formatCurrency(fin.operatingCashFlow)} / mo`, 'Inflow vs Outflow', 'Tracked'],
      ['Runway Remaining', `${runway} months`, '>= 18 months', Number(runway) >= 18 ? 'Healthy' : 'Caution'],
      ['Monthly Net Burn', formatCurrency(fin.monthlyNetBurn), 'Controlled', 'Tracked'],
      ['LTV : CAC Ratio', `${ltvCac}:1`, '>= 3.0:1', Number(ltvCac) >= 3 ? 'Healthy' : 'Review'],
      ['MRR Growth Rate', `${fin.growthRate}%`, '>30% YoY', fin.growthRate >= 30 ? 'Healthy' : 'Review'],
      ['Deployment Frequency', `${eng.deploysPerDay} / day`, 'Elite (>1/day)', eng.deploysPerDay >= 1 ? 'Elite' : 'Standard'],
      ['Lead Time for Changes', `${eng.leadTimeHours} hrs`, '<= 24 hours', eng.leadTimeHours <= 24 ? 'Elite' : 'Action'],
      ['Change Failure Rate (CFR)', `${eng.changeFailureRate}%`, '< 5.0%', eng.changeFailureRate <= 5 ? 'Elite' : 'Action'],
      ['Mean Time to Recovery (MTTR)', `${eng.mttrHours} hours`, '< 1.0 hour', eng.mttrHours <= 1.0 ? 'Elite' : 'Normal'],
      ['DAU / MAU Stickiness', `${stickiness}%`, '> 40%', Number(stickiness) >= 40 ? 'Elite' : 'Normal'],
      ['Net Promoter Score (NPS)', `${cs.nps > 0 ? `+${cs.nps}` : cs.nps}`, 'Top Decile (>50)', cs.nps >= 50 ? 'Healthy' : 'Review'],
      ['Customer Satisfaction (CSAT)', `${cs.csat}%`, '> 90%', cs.csat >= 90 ? 'Healthy' : 'Review'],
      ['Ticket Resolution SLA', `${cs.slaRate}%`, '>= 90%', cs.slaRate >= 90 ? 'Healthy' : 'Review'],
    ];

    const csvContent = rows.map((r) => r.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saas-operations-kpis-${timeRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              Export Executive KPI Brief
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Export verified metrics for executive staff review or board reporting
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview */}
        <div className="p-6 space-y-4">
          <div className="relative">
            <pre className="p-4 bg-slate-950 rounded-lg text-[11px] font-mono text-slate-300 max-h-60 overflow-y-auto border border-slate-800 whitespace-pre-wrap">
              {summaryText}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 px-2.5 py-1 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied Brief' : 'Copy Text'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleDownloadCsv}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium rounded-lg text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <Download className="w-4 h-4 text-slate-400" />
              Download CSV Spreadsheet
            </button>
            <button
              onClick={handleDownloadJson}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Structured JSON
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
