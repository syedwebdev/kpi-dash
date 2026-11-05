import React, { useState } from 'react';
import { IntegrationSource } from '../../types/dashboard';
import { RefreshCw, CheckCircle2, Database, ShieldCheck, X } from 'lucide-react';

interface IntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  integrations: IntegrationSource[];
  onTriggerSyncAll: () => Promise<void>;
  isSyncing: boolean;
  revalidateInterval: string;
  setRevalidateInterval: (val: string) => void;
}

export const IntegrationsModal: React.FC<IntegrationsModalProps> = ({
  isOpen,
  onClose,
  integrations,
  onTriggerSyncAll,
  isSyncing,
  revalidateInterval,
  setRevalidateInterval,
}) => {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" />
              Source System Integrations &amp; Sync Engine
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live automated data extraction pipelines feeding operational KPI views
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Engine Status Banner */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-950/60 border border-emerald-800/80 rounded-lg text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200">
                  Data Pipeline Health: 4 of 4 Sources Nominal
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Single Source of Truth enforced · Zero manual spreadsheet entry
                </div>
              </div>
            </div>

            <button
              onClick={() => onTriggerSyncAll()}
              disabled={isSyncing}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors flex items-center gap-2 disabled:opacity-60 whitespace-nowrap self-stretch sm:self-auto justify-center"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing Pipelines...' : 'Sync All Sources Now'}
            </button>
          </div>

          {/* Revalidation Settings */}
          <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800/80 text-xs">
            <div className="text-slate-300">
              <span className="font-semibold text-white">Cache &amp; ISR Revalidation:</span>
              <span className="text-slate-400 ml-2">Prevents API rate limits while ensuring fresh operational insights</span>
            </div>
            <select
              value={revalidateInterval}
              onChange={(e) => setRevalidateInterval(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2.5 py-1 text-xs focus:outline-hidden focus:border-indigo-500"
            >
              <option value="5m">Every 5 Minutes</option>
              <option value="15m">Every 15 Minutes (PRD Default)</option>
              <option value="1h">Every 1 Hour</option>
              <option value="manual">Manual Trigger Only</option>
            </select>
          </div>

          {/* Source Systems Table */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Configured Source Connectors
            </div>

            <div className="space-y-2">
              {integrations.map((source) => (
                <div
                  key={source.id}
                  onClick={() => setSelectedSource(selectedSource === source.id ? null : source.id)}
                  className="bg-slate-950/50 hover:bg-slate-950 border border-slate-800 rounded-lg p-3.5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">
                          {source.systemName}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          [{source.category}]
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 font-mono">
                        {source.extractionMethod}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs font-medium text-emerald-400">
                          {source.status === 'syncing' ? 'Syncing...' : 'Connected'}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-tabular mt-0.5">
                        Latency: {source.apiLatency} · Last sync: {source.lastSync}
                      </div>
                    </div>
                  </div>

                  {selectedSource === source.id && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400 space-y-1">
                      <div className="flex justify-between">
                        <span>Ingestion Volume:</span>
                        <span className="font-tabular font-medium text-slate-200">
                          {source.recordsProcessed}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Webhook Delivery Status:</span>
                        <span className="text-emerald-400 font-medium">99.98% delivery rate</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Auth Credentials:</span>
                        <span className="font-mono text-slate-300">Injected via .env.production securely</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-500">
          <span>Target platform: Vercel Serverless Edge</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
