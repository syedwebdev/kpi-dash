import {
  DualAxisDataPoint,
  DeploymentDataPoint,
  LeadTimeDataPoint,
  SprintVelocityPoint,
  UserEngagementPoint,
  ResponseTimePoint,
  QuartileData,
  IntegrationSource,
  RoleConfig,
  TimeRange,
} from '../types/dashboard';

export const USER_ROLES: RoleConfig[] = [
  {
    id: 'executive',
    label: 'C-Suite / Executive',
    domain: 'exec.company.com',
    canViewFinancials: true,
    canViewEngineering: true,
    canViewCustomerSuccess: true,
    canTriggerSync: true,
  },
  {
    id: 'vp_eng',
    label: 'VP Engineering',
    domain: 'engineering.company.com',
    canViewFinancials: false, // limited financial visibility
    canViewEngineering: true,
    canViewCustomerSuccess: true,
    canTriggerSync: true,
  },
  {
    id: 'head_cs',
    label: 'Head of Customer Success',
    domain: 'cs.company.com',
    canViewFinancials: false,
    canViewEngineering: false,
    canViewCustomerSuccess: true,
    canTriggerSync: true,
  },
  {
    id: 'board_investor',
    label: 'Board Member / Investor',
    domain: 'board.ventures.com',
    canViewFinancials: true,
    canViewEngineering: true,
    canViewCustomerSuccess: true,
    canTriggerSync: false,
  },
];

export const INITIAL_INTEGRATIONS: IntegrationSource[] = [
  {
    id: 'stripe',
    category: 'Financials',
    systemName: 'Stripe / Billing Engine',
    extractionMethod: 'Webhooks & Stripe Billing API (v2024-11)',
    status: 'connected',
    lastSync: '2 minutes ago',
    recordsProcessed: '14,290 invoices & events',
    apiLatency: '42ms',
    webhookStatus: 'active',
  },
  {
    id: 'github_jira',
    category: 'Engineering / DevOps',
    systemName: 'GitHub & Jira Cloud',
    extractionMethod: 'GitHub Actions Log API & Jira REST API v3',
    status: 'connected',
    lastSync: '4 minutes ago',
    recordsProcessed: '1,428 workflow runs & commits',
    apiLatency: '68ms',
    webhookStatus: 'active',
  },
  {
    id: 'hubspot_zendesk',
    category: 'Customer Success',
    systemName: 'HubSpot CRM & Zendesk',
    extractionMethod: 'CRM Webhooks & Ticket Analytics API v2',
    status: 'connected',
    lastSync: '1 minute ago',
    recordsProcessed: '892 customer tickets & NPS events',
    apiLatency: '55ms',
    webhookStatus: 'active',
  },
  {
    id: 'segment_db',
    category: 'Product Engagement',
    systemName: 'Segment & Read Replica DB',
    extractionMethod: 'Direct Read Replica Database Connection (Postgres SSL)',
    status: 'connected',
    lastSync: 'Just now',
    recordsProcessed: '1.24M telemetry events ingested',
    apiLatency: '18ms',
    webhookStatus: 'active',
  },
];

// 12-Month Financial Series (Gross Churn vs NRR)
export const FINANCIAL_12M_SERIES: DualAxisDataPoint[] = [
  { period: 'Nov 25', grossChurn: 2.4, nrr: 112.5 },
  { period: 'Dec 25', grossChurn: 2.1, nrr: 114.2 },
  { period: 'Jan 26', grossChurn: 2.3, nrr: 113.8 },
  { period: 'Feb 26', grossChurn: 1.9, nrr: 116.0 },
  { period: 'Mar 26', grossChurn: 1.8, nrr: 117.4 },
  { period: 'Apr 26', grossChurn: 2.0, nrr: 116.8 },
  { period: 'May 26', grossChurn: 1.7, nrr: 118.5 },
  { period: 'Jun 26', grossChurn: 1.6, nrr: 120.1 },
  { period: 'Jul 26', grossChurn: 1.8, nrr: 119.4 },
  { period: 'Aug 26', grossChurn: 1.5, nrr: 121.2 },
  { period: 'Sep 26', grossChurn: 1.4, nrr: 122.8 },
  { period: 'Oct 26', grossChurn: 1.3, nrr: 123.6 },
];

export const FINANCIAL_90D_SERIES: DualAxisDataPoint[] = [
  { period: 'Aug W1', grossChurn: 1.6, nrr: 120.5 },
  { period: 'Aug W3', grossChurn: 1.5, nrr: 121.2 },
  { period: 'Sep W1', grossChurn: 1.5, nrr: 122.0 },
  { period: 'Sep W3', grossChurn: 1.4, nrr: 122.8 },
  { period: 'Oct W1', grossChurn: 1.3, nrr: 123.2 },
  { period: 'Oct W3', grossChurn: 1.3, nrr: 123.6 },
];

export const FINANCIAL_30D_SERIES: DualAxisDataPoint[] = [
  { period: 'Oct 05', grossChurn: 1.4, nrr: 123.0 },
  { period: 'Oct 12', grossChurn: 1.3, nrr: 123.2 },
  { period: 'Oct 19', grossChurn: 1.3, nrr: 123.4 },
  { period: 'Oct 26', grossChurn: 1.2, nrr: 123.6 },
  { period: 'Nov 02', grossChurn: 1.3, nrr: 123.6 },
];

// Deployment Frequency (Engineering View)
export const DEPLOYMENTS_DATA = {
  '30d': [
    { period: 'Oct 06', production: 18, hotfix: 2 },
    { period: 'Oct 13', production: 24, hotfix: 1 },
    { period: 'Oct 20', production: 22, hotfix: 3 },
    { period: 'Oct 27', production: 29, hotfix: 1 },
    { period: 'Nov 03', production: 27, hotfix: 2 },
  ] as DeploymentDataPoint[],
  '90d': [
    { period: 'Aug W1', production: 14, hotfix: 3 },
    { period: 'Aug W2', production: 17, hotfix: 2 },
    { period: 'Aug W3', production: 19, hotfix: 2 },
    { period: 'Aug W4', production: 21, hotfix: 1 },
    { period: 'Sep W1', production: 20, hotfix: 2 },
    { period: 'Sep W2', production: 25, hotfix: 1 },
    { period: 'Sep W3', production: 23, hotfix: 2 },
    { period: 'Sep W4', production: 26, hotfix: 1 },
    { period: 'Oct W1', production: 24, hotfix: 1 },
    { period: 'Oct W2', production: 28, hotfix: 2 },
    { period: 'Oct W3', production: 27, hotfix: 1 },
    { period: 'Oct W4', production: 31, hotfix: 1 },
  ] as DeploymentDataPoint[],
  '12m': [
    { period: 'Nov', production: 52, hotfix: 12 },
    { period: 'Dec', production: 48, hotfix: 9 },
    { period: 'Jan', production: 64, hotfix: 11 },
    { period: 'Feb', production: 71, hotfix: 8 },
    { period: 'Mar', production: 82, hotfix: 7 },
    { period: 'Apr', production: 89, hotfix: 6 },
    { period: 'May', production: 96, hotfix: 8 },
    { period: 'Jun', production: 104, hotfix: 5 },
    { period: 'Jul', production: 110, hotfix: 6 },
    { period: 'Aug', production: 118, hotfix: 5 },
    { period: 'Sep', production: 124, hotfix: 4 },
    { period: 'Oct', production: 132, hotfix: 4 },
  ] as DeploymentDataPoint[],
  'ytd': [
    { period: 'Q1', production: 217, hotfix: 26 },
    { period: 'Q2', production: 289, hotfix: 19 },
    { period: 'Q3', production: 352, hotfix: 15 },
    { period: 'Q4 (Est)', production: 390, hotfix: 12 },
  ] as DeploymentDataPoint[],
};

// Lead Time for Changes (Engineering View)
export const LEAD_TIME_DATA = {
  '30d': [
    { period: 'Oct 05', hours: 22.4, targetHours: 24.0 },
    { period: 'Oct 12', hours: 20.8, targetHours: 24.0 },
    { period: 'Oct 19', hours: 19.5, targetHours: 24.0 },
    { period: 'Oct 26', hours: 18.9, targetHours: 24.0 },
    { period: 'Nov 02', hours: 17.6, targetHours: 24.0 },
  ] as LeadTimeDataPoint[],
  '90d': [
    { period: 'Aug W1', hours: 29.5, targetHours: 24.0 },
    { period: 'Aug W3', hours: 26.2, targetHours: 24.0 },
    { period: 'Sep W1', hours: 24.1, targetHours: 24.0 },
    { period: 'Sep W3', hours: 21.5, targetHours: 24.0 },
    { period: 'Oct W1', hours: 19.8, targetHours: 24.0 },
    { period: 'Oct W3', hours: 18.2, targetHours: 24.0 },
    { period: 'Nov W1', hours: 17.6, targetHours: 24.0 },
  ] as LeadTimeDataPoint[],
  '12m': [
    { period: 'Nov 25', hours: 44.2, targetHours: 24.0 },
    { period: 'Jan 26', hours: 38.6, targetHours: 24.0 },
    { period: 'Mar 26', hours: 32.1, targetHours: 24.0 },
    { period: 'May 26', hours: 26.4, targetHours: 24.0 },
    { period: 'Jul 26', hours: 21.8, targetHours: 24.0 },
    { period: 'Sep 26', hours: 19.2, targetHours: 24.0 },
    { period: 'Oct 26', hours: 17.6, targetHours: 24.0 },
  ] as LeadTimeDataPoint[],
  'ytd': [
    { period: 'Jan', hours: 38.6, targetHours: 24.0 },
    { period: 'Mar', hours: 32.1, targetHours: 24.0 },
    { period: 'May', hours: 26.4, targetHours: 24.0 },
    { period: 'Jul', hours: 21.8, targetHours: 24.0 },
    { period: 'Sep', hours: 19.2, targetHours: 24.0 },
    { period: 'Oct', hours: 17.6, targetHours: 24.0 },
  ] as LeadTimeDataPoint[],
};

// Sprint Velocity (Last 6 Sprints)
export const SPRINT_VELOCITY_DATA: SprintVelocityPoint[] = [
  { sprint: 'Sprint 41', planned: 120, completed: 108, completionRate: 90.0 },
  { sprint: 'Sprint 42', planned: 125, completed: 118, completionRate: 94.4 },
  { sprint: 'Sprint 43', planned: 130, completed: 121, completionRate: 93.1 },
  { sprint: 'Sprint 44', planned: 135, completed: 132, completionRate: 97.8 },
  { sprint: 'Sprint 45', planned: 140, completed: 134, completionRate: 95.7 },
  { sprint: 'Sprint 46', planned: 145, completed: 141, completionRate: 97.2 },
];

// Active Users DAU / MAU (Customer Success View)
export const USER_ENGAGEMENT_DATA = {
  '30d': [
    { date: 'Oct 06', dau: 18400, mau: 38200, stickiness: 48.1 },
    { date: 'Oct 11', dau: 19100, mau: 38900, stickiness: 49.1 },
    { date: 'Oct 16', dau: 19850, mau: 39600, stickiness: 50.1 },
    { date: 'Oct 21', dau: 20400, mau: 40200, stickiness: 50.7 },
    { date: 'Oct 26', dau: 21100, mau: 41000, stickiness: 51.4 },
    { date: 'Oct 31', dau: 21800, mau: 41800, stickiness: 52.1 },
    { date: 'Nov 04', dau: 22450, mau: 42500, stickiness: 52.8 },
  ] as UserEngagementPoint[],
  '90d': [
    { date: 'Aug 05', dau: 14200, mau: 31000, stickiness: 45.8 },
    { date: 'Aug 20', dau: 15600, mau: 33400, stickiness: 46.7 },
    { date: 'Sep 05', dau: 17100, mau: 35800, stickiness: 47.7 },
    { date: 'Sep 20', dau: 18900, mau: 38100, stickiness: 49.6 },
    { date: 'Oct 05', dau: 20200, mau: 40100, stickiness: 50.3 },
    { date: 'Oct 20', dau: 21500, mau: 41600, stickiness: 51.6 },
    { date: 'Nov 04', dau: 22450, mau: 42500, stickiness: 52.8 },
  ] as UserEngagementPoint[],
  '12m': [
    { date: 'Nov 25', dau: 9800, mau: 24200, stickiness: 40.4 },
    { date: 'Jan 26', dau: 11500, mau: 26800, stickiness: 42.9 },
    { date: 'Mar 26', dau: 13400, mau: 29500, stickiness: 45.4 },
    { date: 'May 26', dau: 15800, mau: 33200, stickiness: 47.5 },
    { date: 'Jul 26', dau: 18100, mau: 36900, stickiness: 49.0 },
    { date: 'Sep 26', dau: 20800, mau: 40500, stickiness: 51.3 },
    { date: 'Oct 26', dau: 22450, mau: 42500, stickiness: 52.8 },
  ] as UserEngagementPoint[],
  'ytd': [
    { date: 'Jan', dau: 11500, mau: 26800, stickiness: 42.9 },
    { date: 'Mar', dau: 13400, mau: 29500, stickiness: 45.4 },
    { date: 'May', dau: 15800, mau: 33200, stickiness: 47.5 },
    { date: 'Jul', dau: 18100, mau: 36900, stickiness: 49.0 },
    { date: 'Sep', dau: 20800, mau: 40500, stickiness: 51.3 },
    { date: 'Oct', dau: 22450, mau: 42500, stickiness: 52.8 },
  ] as UserEngagementPoint[],
};

// First Response Time by Support Channel
export const RESPONSE_TIME_DATA = {
  '30d': [
    { period: 'Oct 05', chat: 1.8, email: 48, slackConnect: 8.5 },
    { period: 'Oct 12', chat: 1.6, email: 42, slackConnect: 7.8 },
    { period: 'Oct 19', chat: 1.5, email: 38, slackConnect: 7.2 },
    { period: 'Oct 26', chat: 1.3, email: 34, slackConnect: 6.5 },
    { period: 'Nov 02', chat: 1.2, email: 31, slackConnect: 5.9 },
  ] as ResponseTimePoint[],
  '90d': [
    { period: 'Aug W1', chat: 2.8, email: 64, slackConnect: 12.4 },
    { period: 'Aug W3', chat: 2.4, email: 58, slackConnect: 11.0 },
    { period: 'Sep W1', chat: 2.1, email: 50, slackConnect: 9.6 },
    { period: 'Sep W3', chat: 1.7, email: 44, slackConnect: 8.2 },
    { period: 'Oct W1', chat: 1.5, email: 38, slackConnect: 7.1 },
    { period: 'Oct W3', chat: 1.3, email: 32, slackConnect: 6.2 },
    { period: 'Nov W1', chat: 1.2, email: 31, slackConnect: 5.9 },
  ] as ResponseTimePoint[],
  '12m': [
    { period: 'Nov 25', chat: 4.2, email: 98, slackConnect: 18.0 },
    { period: 'Jan 26', chat: 3.6, email: 82, slackConnect: 15.5 },
    { period: 'Mar 26', chat: 3.1, email: 70, slackConnect: 13.8 },
    { period: 'May 26', chat: 2.5, email: 58, slackConnect: 11.2 },
    { period: 'Jul 26', chat: 1.9, email: 46, slackConnect: 8.9 },
    { period: 'Sep 26', chat: 1.4, email: 36, slackConnect: 6.8 },
    { period: 'Oct 26', chat: 1.2, email: 31, slackConnect: 5.9 },
  ] as ResponseTimePoint[],
  'ytd': [
    { period: 'Jan', chat: 3.6, email: 82, slackConnect: 15.5 },
    { period: 'Mar', chat: 3.1, email: 70, slackConnect: 13.8 },
    { period: 'May', chat: 2.5, email: 58, slackConnect: 11.2 },
    { period: 'Jul', chat: 1.9, email: 46, slackConnect: 8.9 },
    { period: 'Sep', chat: 1.4, email: 36, slackConnect: 6.8 },
    { period: 'Oct', chat: 1.2, email: 31, slackConnect: 5.9 },
  ] as ResponseTimePoint[],
};

// NPS & CSAT Quartile Distribution Data
export const NPS_QUARTILE_DATA: QuartileData = {
  metric: 'Net Promoter Score (NPS)',
  current: 62,
  unit: 'points',
  q1: 34,
  median: 48,
  q3: 58,
  topBenchmark: 70,
  previousPeriod: 54,
  change: +8,
  status: 'healthy',
};

export const CSAT_QUARTILE_DATA: QuartileData = {
  metric: 'Customer Satisfaction (CSAT)',
  current: 94.6,
  unit: '%',
  q1: 82.0,
  median: 88.5,
  q3: 92.0,
  topBenchmark: 95.0,
  previousPeriod: 91.8,
  change: +2.8,
  status: 'healthy',
};

// Summary metrics helper by time range
export function getFinancialKPIs(range: TimeRange) {
  const multipliers: Record<TimeRange, { arr: string; mrr: string; growth: number; netNew: string; burnRate: string; runway: number; cashReserves: string }> = {
    '30d': {
      arr: '$14.28M',
      mrr: '$1,190,000',
      growth: 3.8,
      netNew: '+$43,500',
      burnRate: '$345,000/mo',
      runway: 23.8,
      cashReserves: '$8.20M',
    },
    '90d': {
      arr: '$14.28M',
      mrr: '$1,190,000',
      growth: 11.4,
      netNew: '+$122,000',
      burnRate: '$352,000/mo',
      runway: 23.3,
      cashReserves: '$8.20M',
    },
    '12m': {
      arr: '$14.28M',
      mrr: '$1,190,000',
      growth: 52.8,
      netNew: '+$412,000',
      burnRate: '$368,000/mo',
      runway: 22.3,
      cashReserves: '$8.20M',
    },
    'ytd': {
      arr: '$14.28M',
      mrr: '$1,190,000',
      growth: 44.2,
      netNew: '+$364,000',
      burnRate: '$358,000/mo',
      runway: 22.9,
      cashReserves: '$8.20M',
    },
  };
  return multipliers[range];
}

export function getEngineeringKPIs(range: TimeRange) {
  const metrics: Record<TimeRange, { deploysPerDay: string; leadTime: string; cfr: number; mttrHours: number; mttrChange: number }> = {
    '30d': { deploysPerDay: '4.8 / day', leadTime: '17.6 hrs', cfr: 3.2, mttrHours: 0.7, mttrChange: -28 },
    '90d': { deploysPerDay: '4.2 / day', leadTime: '19.4 hrs', cfr: 3.8, mttrHours: 0.9, mttrChange: -22 },
    '12m': { deploysPerDay: '3.6 / day', leadTime: '24.2 hrs', cfr: 4.5, mttrHours: 1.4, mttrChange: -45 },
    'ytd': { deploysPerDay: '3.9 / day', leadTime: '21.5 hrs', cfr: 4.1, mttrHours: 1.1, mttrChange: -35 },
  };
  return metrics[range];
}

import { DashboardDataset } from '../types/dashboard';

export const DEFAULT_DATASET: DashboardDataset = {
  financials: {
    arr: 14280000,
    mrr: 1190000,
    totalRevenue: 13850000,
    grossMarginPercent: 78.5,
    grossProfit: 10872250,
    customerCount: 1420,
    netNewCustomers: 64,
    arpu: 10056,
    churnRate: 1.3,
    logoChurnRate: 1.8,
    growthRate: 52.8,
    netNewMrr: 412000,
    newBookings: 62400,
    expansion: 28100,
    churnContraction: 47000,
    ltv: 22800,
    cac: 6000,
    cashOnHand: 8200000,
    cashReserves: 8200000,
    monthlyNetBurn: 345000,
    monthlyGrossBurn: 520000,
    operatingCashFlow: -210000,
    freeCashFlow: -245000,
    cashFlowSeries: [
      { period: 'Jun', inflow: 1040000, outflow: 1390000, netCashFlow: -350000 },
      { period: 'Jul', inflow: 1090000, outflow: 1400000, netCashFlow: -310000 },
      { period: 'Aug', inflow: 1130000, outflow: 1410000, netCashFlow: -280000 },
      { period: 'Sep', inflow: 1160000, outflow: 1415000, netCashFlow: -255000 },
      { period: 'Oct', inflow: 1190000, outflow: 1400000, netCashFlow: -210000 },
    ],
    rollingSeries: FINANCIAL_12M_SERIES,
  },
  engineering: {
    deploysPerDay: 4.8,
    leadTimeHours: 17.6,
    changeFailureRate: 3.2,
    mttrHours: 0.7,
    mttrChangePercent: -28,
    totalDeployments: 359,
    deploymentsSeries: DEPLOYMENTS_DATA['30d'],
    leadTimeSeries: LEAD_TIME_DATA['30d'],
    sprintSeries: SPRINT_VELOCITY_DATA,
  },
  customerSuccess: {
    dau: 22450,
    mau: 42500,
    nps: 62,
    npsChange: 8,
    csat: 94.6,
    csatChange: 2.8,
    chatFrtMins: 1.2,
    slackFrtMins: 5.9,
    emailFrtMins: 31.0,
    openTickets: 42,
    closedTickets: 320,
    slaRate: 96.2,
    engagementSeries: USER_ENGAGEMENT_DATA['30d'],
    responseTimeSeries: RESPONSE_TIME_DATA['30d'],
  },
  lastUpdated: new Date().toISOString(),
  sourceType: 'template',
};

export const BLANK_DATASET: DashboardDataset = {
  financials: {
    arr: 0,
    mrr: 0,
    totalRevenue: 0,
    grossMarginPercent: 0,
    grossProfit: 0,
    customerCount: 0,
    netNewCustomers: 0,
    arpu: 0,
    churnRate: 0,
    logoChurnRate: 0,
    growthRate: 0,
    netNewMrr: 0,
    newBookings: 0,
    expansion: 0,
    churnContraction: 0,
    ltv: 0,
    cac: 0,
    cashOnHand: 0,
    cashReserves: 0,
    monthlyNetBurn: 0,
    monthlyGrossBurn: 0,
    operatingCashFlow: 0,
    freeCashFlow: 0,
    cashFlowSeries: [],
    rollingSeries: [],
  },
  engineering: {
    deploysPerDay: 0,
    leadTimeHours: 0,
    changeFailureRate: 0,
    mttrHours: 0,
    mttrChangePercent: 0,
    totalDeployments: 0,
    deploymentsSeries: [],
    leadTimeSeries: [],
    sprintSeries: [],
  },
  customerSuccess: {
    dau: 0,
    mau: 0,
    nps: 0,
    npsChange: 0,
    csat: 0,
    csatChange: 0,
    chatFrtMins: 0,
    slackFrtMins: 0,
    emailFrtMins: 0,
    openTickets: 0,
    closedTickets: 0,
    slaRate: 0,
    engagementSeries: [],
    responseTimeSeries: [],
  },
  lastUpdated: new Date().toISOString(),
  sourceType: 'user_custom',
};

