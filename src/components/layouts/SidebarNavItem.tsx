import { Link } from 'react-router';
import { type ComponentType, type SVGProps } from 'react';
import { cn } from '@/lib/utils';

interface SidebarNavItemProps {
  label: string;
  to: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  isActive: boolean;
  isExpanded: boolean;
}

export function SidebarNavItem({ label, to, icon: Icon, isActive, isExpanded }: SidebarNavItemProps) {
  return (
    <li>
      <Link
        to={to}
        title={label}
        className={cn(
          'group flex items-center gap-3 rounded-xl py-3 text-sm transition-colors hover:bg-white/10',
          isExpanded ? 'justify-start px-3' : 'justify-center px-0',
          isActive ? 'bg-primary/90 text-white' : 'text-slate-200',
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
        {isExpanded && <span className="font-medium">{label}</span>}
      </Link>
    </li>
  );
}
