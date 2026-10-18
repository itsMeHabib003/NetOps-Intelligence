import { useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: '?', description: 'Open this keyboard shortcuts dialog' },
    { key: '1 - 4', description: 'Quick-switch navigation tabs (Dashboard, Devices, Incidents, History)' },
    { key: 'J / K', description: 'Navigate down / up in incident triage queue' },
    { key: 'Enter', description: 'Open Evidence Inspector for selected incident' },
    { key: 'R', description: 'Reset all telemetry to healthy normal baseline' },
    { key: 'Esc', description: 'Close active modal, drawer, or dialog' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div className="bg-surface-1 border border-border-strong rounded-xl max-w-md w-full shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-blue-400" />
            <h3 id="shortcuts-title" className="text-base font-bold text-white">NOC Console Keyboard Shortcuts</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-surface-2 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 text-xs">
          {shortcuts.map((sc, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded bg-surface-2/60 border border-border-subtle">
              <span className="text-gray-300">{sc.description}</span>
              <kbd className="px-2 py-0.5 rounded bg-surface-3 border border-border-strong text-blue-300 font-mono font-bold text-[11px] shrink-0">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-border-subtle flex justify-end">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
