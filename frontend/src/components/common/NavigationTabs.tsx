import { Activity, Server, ShieldAlert, History } from 'lucide-react';

export type NavTabId = 'dashboard' | 'devices' | 'incidents' | 'history';

interface NavigationTabsProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  activeIncidentsCount: number;
}

export function NavigationTabs({
  activeTab,
  onSelectTab,
  activeIncidentsCount,
}: NavigationTabsProps) {
  const tabs: { id: NavTabId; label: string; icon: typeof Activity; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'devices', label: 'Devices & Topology', icon: Server },
    { id: 'incidents', label: 'Incident Triage', icon: ShieldAlert, badge: activeIncidentsCount },
    { id: 'history', label: 'Audit History', icon: History },
  ];

  return (
    <nav className="bg-surface-0 border-b border-border-subtle px-4 flex gap-6 text-sm font-medium overflow-x-auto" aria-label="Main Navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`py-2.5 border-b-2 flex items-center gap-2 transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-t ${
              isActive
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-gray-500'}`} />
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-red-950 text-red-300 border border-red-500/70 shadow-[0_0_6px_rgba(239,68,68,0.3)]">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
