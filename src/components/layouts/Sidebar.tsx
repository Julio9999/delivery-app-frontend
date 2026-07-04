import { type ComponentType, type SVGProps } from 'react';
import { LogOutIcon, MenuIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarNavItem } from './SidebarNavItem';
import { BuildVersionBadge } from './build-version-badge';

export interface SidebarItem {
  label: string;
  to: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

interface SidebarProps {
  items: SidebarItem[];
  isExpanded: boolean;
  currentPath: string;
  onToggle: () => void;
  onLogout: () => Promise<void>;
  onNavigate?: () => void;
}

function isItemActive(currentPath: string, itemPath: string): boolean {
  if (itemPath === '/') {
    return currentPath === '/';
  }

  return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
}

export default function Sidebar({ items, isExpanded, currentPath, onToggle, onLogout, onNavigate }: SidebarProps) {
  const isMobileSheet = !!onNavigate;
  const effectiveExpanded = isMobileSheet ? true : isExpanded;

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-white/10 bg-primary text-white transition-all duration-200',
        effectiveExpanded ? 'w-64' : 'w-16',
      )}
    >
      <div className={cn('flex items-center gap-2 border-b border-white/10 px-4 py-2 transition-all duration-500 h-16', effectiveExpanded ? 'justify-start' : 'justify-center')}>
        {!isMobileSheet && (
          <button
            type="button"
            onClick={onToggle}
            title={effectiveExpanded ? 'Colapsar menú' : 'Expandir menú'}
            className="rounded-md bg-white/10 p-2 text-white transition hover:bg-white/20 cursor-pointer"
          >
            <MenuIcon className="size-6" />
            <span className="sr-only">Toggle sidebar</span>
          </button>
        )}
        {effectiveExpanded && <span className="text-lg font-semibold">Panel</span>}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="space-y-1">
          {items.map((item) => (
            <SidebarNavItem
              key={item.to}
              label={item.label}
              to={item.to}
              icon={item.icon}
              isExpanded={effectiveExpanded}
              isActive={isItemActive(currentPath, item.to)}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={onLogout}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 px-3 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10 cursor-pointer',
            !effectiveExpanded && 'justify-center',
          )}
          title="Cerrar sesión"
        >
          <LogOutIcon className="size-5" />
          {effectiveExpanded && <span>Cerrar sesión</span>}
        </button>
        <BuildVersionBadge />
      </div>
    </aside>
  );
}
