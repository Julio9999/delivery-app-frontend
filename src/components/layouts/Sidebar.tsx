import { type ComponentType, type SVGProps } from 'react';
import { LogOutIcon, MenuIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarNavItem } from './SidebarNavItem';

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
}

export default function Sidebar({ items, isExpanded, currentPath, onToggle, onLogout }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-white/10 bg-primary text-white transition-all duration-200',
        isExpanded ? 'w-64' : 'w-16',
      )}
    >
      <div className={cn('flex items-center gap-2 border-b border-white/10 p-4 transition-all duration-500', isExpanded ? 'justify-start' : 'justify-center')}>
        <button
          type="button"
          onClick={onToggle}
          title={isExpanded ? 'Colapsar menú' : 'Expandir menú'}
          className="rounded-md bg-white/10 p-2 text-white transition hover:bg-white/20"
        >
          <MenuIcon className="size-6" />
          <span className="sr-only">Toggle sidebar</span>
        </button>
        {isExpanded && <span className="text-lg font-semibold">Panel</span>}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="space-y-1">
          {items.map((item) => (
            <SidebarNavItem
              key={item.to}
              label={item.label}
              to={item.to}
              icon={item.icon}
              isExpanded={isExpanded}
              isActive={currentPath === item.to}
            />
          ))}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={onLogout}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 px-3 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10',
            !isExpanded && 'justify-center',
          )}
          title="Cerrar sesión"
        >
          <LogOutIcon className="size-5" />
          {isExpanded && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}
