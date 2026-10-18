import React from 'react';
import { AlertCircle, RefreshCw, FolderSearch, WifiOff, Clock } from 'lucide-react';

/* 1. Loading Skeleton */
export function LoadingSkeleton({ count = 3, type = 'card' }: { count?: number; type?: 'card' | 'row' | 'chart' }) {
  if (type === 'chart') {
    return (
      <div className="w-full h-64 bg-surface-1 border border-border-subtle rounded-lg p-4 animate-pulse flex flex-col justify-between">
        <div className="flex justify-between">
          <div className="h-4 bg-surface-2 rounded w-32"></div>
          <div className="h-4 bg-surface-2 rounded w-16"></div>
        </div>
        <div className="h-40 bg-surface-2/60 rounded flex items-center justify-center text-xs text-gray-500">
          Loading Telemetry Stream...
        </div>
        <div className="flex justify-between">
          <div className="h-3 bg-surface-2 rounded w-20"></div>
          <div className="h-3 bg-surface-2 rounded w-20"></div>
        </div>
      </div>
    );
  }

  if (type === 'row') {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-12 bg-surface-1 border border-border-subtle rounded flex items-center px-4 justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-surface-2 rounded-full"></div>
              <div className="w-40 h-4 bg-surface-2 rounded"></div>
            </div>
            <div className="w-24 h-4 bg-surface-2 rounded"></div>
            <div className="w-16 h-4 bg-surface-2 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-surface-1 border border-border-subtle rounded-lg p-4 animate-pulse space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-3 bg-surface-2 rounded w-24"></div>
            <div className="h-3 bg-surface-2 rounded w-8"></div>
          </div>
          <div className="h-8 bg-surface-2 rounded w-20"></div>
          <div className="h-3 bg-surface-2 rounded w-32"></div>
        </div>
      ))}
    </div>
  );
}

/* 2. Empty State */
export function EmptyState({
  title = 'No Incidents Found',
  description = 'All monitored network devices are operating within normal baseline parameters.',
  actionText = 'Inject Demo Anomaly',
  onAction,
  icon,
}: {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-surface-1 border border-border-subtle rounded-lg p-10 text-center flex flex-col items-center justify-center my-4">
      <div className="w-12 h-12 rounded-full bg-surface-2 border border-border-strong flex items-center justify-center mb-3 text-blue-400">
        {icon || <FolderSearch className="w-6 h-6 text-gray-400" />}
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="text-sm text-gray-400 mt-1 max-w-md">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {actionText}
        </button>
      )}
    </div>
  );
}

/* 3. Error State Banner */
export function ErrorState({
  message = 'Failed to load live telemetry from backend service.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="bg-red-950/40 border border-red-500/50 rounded-lg p-4 flex items-center justify-between text-xs text-red-200 gap-3 my-3">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-2.5 py-1 rounded bg-red-900/60 hover:bg-red-800/80 text-white font-medium border border-red-500/50 flex items-center gap-1 shrink-0"
        >
          <RefreshCw className="w-3 h-3" /> Retry Connection
        </button>
      )}
    </div>
  );
}

/* 4. Not-Yet-Connected Banner */
export function NotConnectedBanner({
  isLiveConnected = false,
  onConnect,
}: {
  isLiveConnected?: boolean;
  onConnect?: () => void;
}) {
  if (isLiveConnected) return null;

  return (
    <div className="bg-blue-950/30 border-b border-blue-900/50 px-4 py-1.5 flex items-center justify-between text-[11px] text-blue-300">
      <div className="flex items-center gap-2">
        <WifiOff className="w-3.5 h-3.5 text-blue-400" />
        <span>
          <strong className="text-white">Standalone Simulated Prototype:</strong> Live backend REST polling is dormant. Operating with client-side physics simulation.
        </span>
      </div>
      {onConnect && (
        <button
          onClick={onConnect}
          className="px-2 py-0.5 rounded bg-blue-900/50 hover:bg-blue-800/60 text-blue-200 border border-blue-700/50 text-[10px]"
        >
          Connect to FastAPI
        </button>
      )}
    </div>
  );
}

/* 5. Stale Data Badge */
export function StaleDataBadge({ isStale = false, lastSeenSeconds = 12 }: { isStale?: boolean; lastSeenSeconds?: number }) {
  if (!isStale) return null;

  return (
    <span 
      className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-500/50"
      title={`Telemetry stream paused. Last sample received ${lastSeenSeconds}s ago.`}
    >
      <Clock className="w-3 h-3 text-amber-400" />
      <span>STALE TELEMETRY ({lastSeenSeconds}s)</span>
    </span>
  );
}
