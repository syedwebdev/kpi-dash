export type DashboardTab = 'financial' | 'engineering' | 'customer_success';

export type TimeRange = '30d' | '90d' | '12m' | 'ytd';

export type UserRole = 'executive' | 'vp_eng' | 'head_cs' | 'board_investor';

export interface RoleConfig {
  id: UserRole;
  label: string;
  domain: string;
  canViewFinancials: boolean;
  canViewEngineering: boolean;
  canViewCustomerSuccess: boolean;
  canTriggerSync: boolean;
}

export interface MetricCardData {
  title: string;
  value: string;
  subValue?: string;
  changePercent: number;
  changeDirection: 'up' | 'down';
  changeLabel: string;
  isPositive: boolean;
  targetBenchmark?: string;
  status: 'healthy' | 'warning' | 'critical';
  trendData: number[];
}

export interface DualAxisDataPoint {
  period: string;
  grossChurn: number; // e.g. 1.8%
  nrr: number; // e.g. 118%
}

export interface DeploymentDataPoint {
  period: string;
  production: number;
  hotfix: number;
}

export interface LeadTimeDataPoint {
  period: string;
  hours: number;
  targetHours: number;
}

export interface SprintVelocityPoint {
  sprint: string;
  planned: number;
  completed: number;
  completionRate: number;
}

export interface UserEngagementPoint {
  date: string;
  dau: number;
  mau: number;
  stickiness: number;
}

export interface ResponseTimePoint {
  period: string;
  chat: number; // in mins
  email: number; // in mins
  slackConnect: number; // in mins
}

export interface QuartileData {
  metric: string;
  current: number;
  unit: string;
  q1: number;
  median: number;
  q3: number;
  topBenchmark: number;
  previousPeriod: number;
  change: number;
  status: 'healthy' | 'warning' | 'critical';
}

export interface IntegrationSource {
  id: string;
  category: 'Financials' | 'Engineering / DevOps' | 'Customer Success' | 'Product Engagement';
  systemName: string;
  extractionMethod: string;
  status: 'connected' | 'syncing' | 'healthy' | 'error';
  lastSync: string;
  recordsProcessed: string;
  apiLatency: string;
  webhookStatus: 'active' | 'degraded';
}

export interface FinancialDataState {
  arr: number; // e.g. 14280000
  mrr: number; // e.g. 1190000
  totalRevenue: number; // Total Recognized Revenue, e.g. 13850000
  grossMarginPercent: number; // e.g. 78.5%
  grossProfit: number; // e.g. 10872250
  customerCount: number; // e.g. 1420 active paying customers/logos
  netNewCustomers: number; // e.g. 64 new logos this cycle
  arpu: number; // Average Revenue Per User/Customer, e.g. 10056
  churnRate: number; // Gross Revenue Churn %, e.g. 1.3
  logoChurnRate: number; // Logo Churn %, e.g. 1.8
  growthRate: number; // e.g. 52.8
  netNewMrr: number; // e.g. 412000
  newBookings: number; // e.g. 62400
  expansion: number; // e.g. 28100
  churnContraction: number; // e.g. 47000
  ltv: number; // e.g. 22800
  cac: number; // e.g. 6000
  cashOnHand: number; // Cash on Hand / liquid reserves, e.g. 8200000
  cashReserves: number; // Alias / total treasury
  monthlyNetBurn: number; // e.g. 345000
  monthlyGrossBurn: number; // e.g. 520000
  operatingCashFlow: number; // e.g. -210000
  freeCashFlow: number; // e.g. -245000
  cashFlowSeries?: { period: string; inflow: number; outflow: number; netCashFlow: number }[];
  rollingSeries: DualAxisDataPoint[];
}

export interface EngineeringDataState {
  deploysPerDay: number; // e.g. 4.8
  leadTimeHours: number; // e.g. 17.6
  changeFailureRate: number; // e.g. 3.2
  mttrHours: number; // e.g. 0.7
  mttrChangePercent: number; // e.g. -28
  totalDeployments: number; // e.g. 359
  deploymentsSeries: DeploymentDataPoint[];
  leadTimeSeries: LeadTimeDataPoint[];
  sprintSeries: SprintVelocityPoint[];
}

export interface CustomerSuccessDataState {
  dau: number; // e.g. 22450
  mau: number; // e.g. 42500
  nps: number; // e.g. 62
  npsChange: number; // e.g. 8
  csat: number; // e.g. 94.6
  csatChange: number; // e.g. 2.8
  chatFrtMins: number; // e.g. 1.2
  slackFrtMins: number; // e.g. 5.9
  emailFrtMins: number; // e.g. 31.0
  openTickets: number; // e.g. 42
  closedTickets: number; // e.g. 320
  slaRate: number; // e.g. 96.2
  engagementSeries: UserEngagementPoint[];
  responseTimeSeries: ResponseTimePoint[];
}

export interface DashboardDataset {
  financials: FinancialDataState;
  engineering: EngineeringDataState;
  customerSuccess: CustomerSuccessDataState;
  lastUpdated: string;
  sourceType: 'user_custom' | 'csv_import' | 'webhook_ingest' | 'template';
}

