import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router';
import { useMemo, useState } from 'react';
import { HomeIcon, LayersIcon, BoxIcon, MenuIcon, LogOutIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { authApi } from '@/api/auth/auth';
import { useAuthSession } from '@/hooks/use-auth-session';

export default function ProtectedLayout() {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuthSession();

  const navItems = useMemo(
    () => [
      { label: 'Inicio', to: '/', icon: HomeIcon },
      { label: 'Categorias', to: '/categories', icon: LayersIcon },
      { label: 'Productos', to: '/products', icon: BoxIcon },
    ],
    [],
  );

  if (isLoading) {
    return <div className="h-screen w-full grid place-items-center">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return (
    <div className="h-screen w-full grid grid-cols-[auto_1fr] overflow-hidden">
      <aside className="flex h-full flex-col border-r border-white/10 bg-primary text-white transition-all duration-200">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 p-4">
          <div className="flex items-center gap-2">
            <MenuIcon className="size-6 cursor-pointer" />
            {isExpanded && <span className="text-lg font-semibold">Panel</span>}
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded((value) => !value)}
            title={isExpanded ? 'Colapsar menú' : 'Expandir menú'}
            className="rounded-md border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10"
          >
            <span className="sr-only">Toggle sidebar</span>
            {isExpanded ? <ChevronLeftIcon className="size-5 cursor-pointer" /> : <ChevronRightIcon className="size-5 cursor-pointer" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              const ItemIcon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    title={item.label}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors hover:bg-white/10 ${
                      isActive ? 'bg-primary/90 text-white' : 'text-slate-200'
                    }`}>
                    <ItemIcon className="size-5" aria-hidden="true" />
                    {isExpanded && <span className="font-medium">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={async () => {
              try {
                await authApi.logout();
                navigate('/login', { replace: true });
              } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                  navigate('/login', { replace: true });
                  return;
                }

                toast.error('No se pudo cerrar sesion');
              }
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 px-3 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10"
            title="Cerrar sesión"
          >
            <LogOutIcon className="size-5" />
            {isExpanded && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      <main className="min-h-full overflow-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
