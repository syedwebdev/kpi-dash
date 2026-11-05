import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DashboardDataset,
  FinancialDataState,
  EngineeringDataState,
  CustomerSuccessDataState,
  DualAxisDataPoint,
  DeploymentDataPoint,
  LeadTimeDataPoint,
  SprintVelocityPoint,
  UserEngagementPoint,
  ResponseTimePoint,
} from '../types/dashboard';
import { DEFAULT_DATASET, BLANK_DATASET } from '../data/mockData';

const STORAGE_KEY = 'saas_operational_kpi_dataset_v2';

interface DashboardDataContextType {
  dataset: DashboardDataset;
  updateFinancials: (partial: Partial<FinancialDataState>) => void;
  updateEngineering: (partial: Partial<EngineeringDataState>) => void;
  updateCustomerSuccess: (partial: Partial<CustomerSuccessDataState>) => void;
  setDataset: (dataset: DashboardDataset) => void;
  clearToBlank: () => void;
  restoreSampleData: () => void;
  importCsvData: (csvText: string, targetType: 'financials' | 'engineering' | 'customersuccess' | 'all') => { success: boolean; message: string; rowsParsed: number };
  ingestWebhookPayload: (payload: Record<string, any>) => { success: boolean; message: string };
  isUsingCustomData: boolean;
  isAllBlank: boolean;
}

const DashboardDataContext = createContext<DashboardDataContextType | undefined>(undefined);

export const DashboardDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dataset, setDatasetState] = useState<DashboardDataset>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure any new metrics are present
        return {
          ...DEFAULT_DATASET,
          ...parsed,
          financials: {
            ...DEFAULT_DATASET.financials,
            ...(parsed.financials || {}),
          },
          engineering: {
            ...DEFAULT_DATASET.engineering,
            ...(parsed.engineering || {}),
          },
          customerSuccess: {
            ...DEFAULT_DATASET.customerSuccess,
            ...(parsed.customerSuccess || {}),
          },
        };
      }
    } catch (e) {
      console.error('Failed to parse saved dataset from localStorage', e);
    }
    return DEFAULT_DATASET;
  });

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataset));
    } catch (e) {
      console.error('Failed to save dataset to localStorage', e);
    }
  }, [dataset]);

  const updateFinancials = (partial: Partial<FinancialDataState>) => {
    setDatasetState((prev) => ({
      ...prev,
      financials: { ...prev.financials, ...partial },
      lastUpdated: new Date().toISOString(),
      sourceType: 'user_custom',
    }));
  };

  const updateEngineering = (partial: Partial<EngineeringDataState>) => {
    setDatasetState((prev) => ({
      ...prev,
      engineering: { ...prev.engineering, ...partial },
      lastUpdated: new Date().toISOString(),
      sourceType: 'user_custom',
    }));
  };

  const updateCustomerSuccess = (partial: Partial<CustomerSuccessDataState>) => {
    setDatasetState((prev) => ({
      ...prev,
      customerSuccess: { ...prev.customerSuccess, ...partial },
      lastUpdated: new Date().toISOString(),
      sourceType: 'user_custom',
    }));
  };

  const setDataset = (newDataset: DashboardDataset) => {
    setDatasetState({
      ...newDataset,
      lastUpdated: new Date().toISOString(),
      sourceType: 'user_custom',
    });
  };

  const clearToBlank = () => {
    setDatasetState(BLANK_DATASET);
  };

  const restoreSampleData = () => {
    setDatasetState(DEFAULT_DATASET);
  };

  // CSV Import Parser
  const importCsvData = (csvText: string, targetType: 'financials' | 'engineering' | 'customersuccess' | 'all') => {
    try {
      const lines = csvText.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length < 2) {
        return { success: false, message: 'CSV file must have a header row and at least 1 data row.', rowsParsed: 0 };
      }

      const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, '').toLowerCase());

      if (targetType === 'financials' || headers.includes('arr') || headers.includes('grosschurn') || headers.includes('nrr') || headers.includes('revenue') || headers.includes('cashonhand')) {
        const rollingSeries: DualAxisDataPoint[] = [];
        let latestArr = dataset.financials.arr;
        let latestMrr = dataset.financials.mrr;
        let latestRev = dataset.financials.totalRevenue;
        let latestGm = dataset.financials.grossMarginPercent;
        let latestCust = dataset.financials.customerCount;
        let latestChurn = dataset.financials.churnRate;
        let latestCashOnHand = dataset.financials.cashOnHand;
        let latestCashFlow = dataset.financials.operatingCashFlow;
        let latestGrowth = dataset.financials.growthRate;
        let latestNetBurn = dataset.financials.monthlyNetBurn;
        let latestReserves = dataset.financials.cashReserves;

        for (let i = 1; i < lines.length; i++) {
          const cells = lines[i].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
          const row: Record<string, string> = {};
          headers.forEach((h, idx) => {
            row[h] = cells[idx] || '';
          });

          const period = row['period'] || row['month'] || row['date'] || `M${i}`;
          const grossChurn = parseFloat(row['grosschurn'] || row['churn'] || row['gross_churn'] || '1.3');
          const nrr = parseFloat(row['nrr'] || row['netretention'] || '115');
          if (!isNaN(grossChurn) && !isNaN(nrr)) {
            rollingSeries.push({ period, grossChurn, nrr });
          }

          if (row['arr']) latestArr = parseFloat(row['arr'].replace(/[^0-9.]/g, '')) || latestArr;
          if (row['mrr']) latestMrr = parseFloat(row['mrr'].replace(/[^0-9.]/g, '')) || latestMrr;
          if (row['revenue']) latestRev = parseFloat(row['revenue'].replace(/[^0-9.]/g, '')) || latestRev;
          if (row['grossmargin'] || row['gm']) latestGm = parseFloat(row['grossmargin'] || row['gm']) || latestGm;
          if (row['customers'] || row['customercount'] || row['logos']) latestCust = parseInt(row['customers'] || row['customercount'] || row['logos'], 10) || latestCust;
          if (row['churn'] || row['grosschurn']) latestChurn = parseFloat(row['churn'] || row['grosschurn']) || latestChurn;
          if (row['cashonhand'] || row['cash']) latestCashOnHand = parseFloat((row['cashonhand'] || row['cash']).replace(/[^0-9.]/g, '')) || latestCashOnHand;
          if (row['cashflow'] || row['ocf']) latestCashFlow = parseFloat((row['cashflow'] || row['ocf']).replace(/[^0-9.-]/g, '')) || latestCashFlow;
          if (row['growth']) latestGrowth = parseFloat(row['growth'].replace(/[^0-9.]/g, '')) || latestGrowth;
          if (row['netburn'] || row['burn']) latestNetBurn = parseFloat((row['netburn'] || row['burn']).replace(/[^0-9.]/g, '')) || latestNetBurn;
          if (row['reserves']) latestReserves = parseFloat((row['reserves']).replace(/[^0-9.]/g, '')) || latestReserves;
        }

        updateFinancials({
          arr: latestArr,
          mrr: latestMrr,
          totalRevenue: latestRev || latestArr,
          grossMarginPercent: latestGm,
          customerCount: latestCust,
          churnRate: latestChurn,
          cashOnHand: latestCashOnHand,
          operatingCashFlow: latestCashFlow,
          growthRate: latestGrowth,
          monthlyNetBurn: latestNetBurn,
          cashReserves: latestCashOnHand || latestReserves,
          ...(rollingSeries.length > 0 ? { rollingSeries } : {}),
        });

        return { success: true, message: `Successfully parsed ${lines.length - 1} financial records`, rowsParsed: lines.length - 1 };
      }

      if (targetType === 'engineering' || headers.includes('production') || headers.includes('leadtime')) {
        const deploymentsSeries: DeploymentDataPoint[] = [];
        const leadTimeSeries: LeadTimeDataPoint[] = [];

        for (let i = 1; i < lines.length; i++) {
          const cells = lines[i].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
          const row: Record<string, string> = {};
          headers.forEach((h, idx) => {
            row[h] = cells[idx] || '';
          });

          const period = row['period'] || row['date'] || `W${i}`;
          const production = parseInt(row['production'] || row['prod'] || '10', 10);
          const hotfix = parseInt(row['hotfix'] || '1', 10);
          const hours = parseFloat(row['leadtime'] || row['hours'] || '20');

          deploymentsSeries.push({ period, production, hotfix });
          leadTimeSeries.push({ period, hours, targetHours: 24.0 });
        }

        updateEngineering({
          deploymentsSeries,
          leadTimeSeries,
        });

        return { success: true, message: `Successfully parsed ${lines.length - 1} engineering deployment records`, rowsParsed: lines.length - 1 };
      }

      if (targetType === 'customersuccess' || headers.includes('dau') || headers.includes('mau') || headers.includes('nps')) {
        const engagementSeries: UserEngagementPoint[] = [];

        for (let i = 1; i < lines.length; i++) {
          const cells = lines[i].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
          const row: Record<string, string> = {};
          headers.forEach((h, idx) => {
            row[h] = cells[idx] || '';
          });

          const date = row['date'] || row['period'] || `Day ${i}`;
          const dau = parseInt(row['dau'] || '1000', 10);
          const mau = parseInt(row['mau'] || '5000', 10);
          const stickiness = mau > 0 ? (dau / mau) * 100 : 0;

          engagementSeries.push({ date, dau, mau, stickiness });
        }

        const latest = engagementSeries[engagementSeries.length - 1];
        updateCustomerSuccess({
          engagementSeries,
          ...(latest ? { dau: latest.dau, mau: latest.mau } : {}),
        });

        return { success: true, message: `Successfully parsed ${lines.length - 1} engagement records`, rowsParsed: lines.length - 1 };
      }

      return { success: false, message: 'Could not automatically match columns. Ensure headers include period, churn, nrr, dau, or deployments.', rowsParsed: 0 };
    } catch (e: any) {
      return { success: false, message: `CSV Parse error: ${e.message}`, rowsParsed: 0 };
    }
  };

  // Webhook JSON ingestion
  const ingestWebhookPayload = (payload: Record<string, any>) => {
    try {
      // Stripe invoice / subscription event
      if (payload.type && payload.type.startsWith('invoice.') || payload.event === 'subscription_updated') {
        const amount = payload.data?.object?.amount_paid || payload.amount;
        if (amount) {
          const addedMrr = typeof amount === 'number' ? amount / 100 : parseFloat(amount);
          const newMrr = dataset.financials.mrr + addedMrr;
          updateFinancials({
            mrr: Math.round(newMrr),
            arr: Math.round(newMrr * 12),
            netNewMrr: dataset.financials.netNewMrr + Math.round(addedMrr),
          });
          return { success: true, message: `Stripe event ingested: Added $${addedMrr.toFixed(2)} to MRR` };
        }
      }

      // GitHub deployment event
      if (payload.action === 'published' || payload.event === 'workflow_run' || payload.deployment) {
        updateEngineering({
          totalDeployments: dataset.engineering.totalDeployments + 1,
          deploysPerDay: parseFloat((dataset.engineering.deploysPerDay + 0.1).toFixed(1)),
        });
        return { success: true, message: 'GitHub deployment event ingested: Incrementing deployment metrics' };
      }

      // Direct metric override payload
      if (payload.arr !== undefined || payload.mrr !== undefined || payload.dau !== undefined || payload.leadTimeHours !== undefined) {
        if (payload.arr !== undefined || payload.mrr !== undefined) {
          updateFinancials({
            ...(payload.arr !== undefined ? { arr: Number(payload.arr) } : {}),
            ...(payload.mrr !== undefined ? { mrr: Number(payload.mrr) } : {}),
            ...(payload.growthRate !== undefined ? { growthRate: Number(payload.growthRate) } : {}),
            ...(payload.cashReserves !== undefined ? { cashReserves: Number(payload.cashReserves) } : {}),
          });
        }
        if (payload.deploysPerDay !== undefined || payload.leadTimeHours !== undefined) {
          updateEngineering({
            ...(payload.deploysPerDay !== undefined ? { deploysPerDay: Number(payload.deploysPerDay) } : {}),
            ...(payload.leadTimeHours !== undefined ? { leadTimeHours: Number(payload.leadTimeHours) } : {}),
            ...(payload.changeFailureRate !== undefined ? { changeFailureRate: Number(payload.changeFailureRate) } : {}),
          });
        }
        if (payload.dau !== undefined || payload.mau !== undefined || payload.nps !== undefined) {
          updateCustomerSuccess({
            ...(payload.dau !== undefined ? { dau: Number(payload.dau) } : {}),
            ...(payload.mau !== undefined ? { mau: Number(payload.mau) } : {}),
            ...(payload.nps !== undefined ? { nps: Number(payload.nps) } : {}),
            ...(payload.csat !== undefined ? { csat: Number(payload.csat) } : {}),
          });
        }
        return { success: true, message: 'Custom KPI payload ingested successfully' };
      }

      return { success: false, message: 'Unrecognized webhook format. Include standard Stripe/GitHub event or KPI fields (arr, mrr, dau, deploys).' };
    } catch (e: any) {
      return { success: false, message: `Webhook ingestion failed: ${e.message}` };
    }
  };

  const isUsingCustomData = dataset.sourceType !== 'template';
  const isAllBlank = dataset.financials.arr === 0 && dataset.engineering.totalDeployments === 0 && dataset.customerSuccess.dau === 0;

  return (
    <DashboardDataContext.Provider
      value={{
        dataset,
        updateFinancials,
        updateEngineering,
        updateCustomerSuccess,
        setDataset,
        clearToBlank,
        restoreSampleData,
        importCsvData,
        ingestWebhookPayload,
        isUsingCustomData,
        isAllBlank,
      }}
    >
      {children}
    </DashboardDataContext.Provider>
  );
};

export const useDashboardData = () => {
  const context = useContext(DashboardDataContext);
  if (!context) {
    throw new Error('useDashboardData must be used within a DashboardDataProvider');
  }
  return context;
};
