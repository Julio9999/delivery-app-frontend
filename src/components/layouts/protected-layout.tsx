import { useMemo, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router';
import axios from 'axios';
import { HomeIcon, LayersIcon, BoxIcon, MenuIcon, PercentIcon } from 'lucide-react';

import { authApi } from '@/api/auth/auth';
import { useAuthSession } from '@/hooks/use-auth-session';
import { useMediaQuery } from '@/hooks/use-media-query';
import Sidebar, { type SidebarItem } from './Sidebar';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { showErrorToast } from '@/lib/utils';

export default function ProtectedLayout() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuthSession();

  const navItems = useMemo<SidebarItem[]>(
    () => [
      { label: 'Inicio', to: '/', icon: HomeIcon },
      { label: 'Categorias', to: '/categories', icon: LayersIcon },
      { label: 'Productos', to: '/products', icon: BoxIcon },
      { label: 'Ofertas', to: '/offers', icon: PercentIcon },
    ],
    [],
  );

  const handleLogout = async () => {
    try {
      await authApi.logout();
      navigate('/login', { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate('/login', { replace: true });
        return;
      }

      showErrorToast('No se pudo cerrar sesion');
    }
  };

  if (isLoading) {
    return <div className="h-screen w-full grid place-items-center">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (isDesktop) {
    return (
      <div className="h-screen w-full grid grid-cols-[auto_1fr] overflow-hidden">
        <Sidebar
          items={navItems}
          isExpanded={isExpanded}
          currentPath={location.pathname}
          onToggle={() => setIsExpanded((value) => !value)}
          onLogout={handleLogout}
        />

        <main className="h-full flex flex-col bg-background overflow-hidden">
          <div id="layout-page-title" className="bg-primary px-4 py-4 text-white shadow-sm h-16 border-white/10" />
          <div className="flex-1 overflow-auto px-4 py-4">
            <Outlet />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <Sidebar
            items={navItems}
            isExpanded={true}
            currentPath={location.pathname}
            onToggle={() => setIsExpanded((value) => !value)}
            onLogout={handleLogout}
            onNavigate={() => setMobileSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <main className="h-full flex flex-col bg-background overflow-hidden">
        <div id="layout-page-title" className="bg-primary px-4 py-4 text-white shadow-sm h-16 border-white/10 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileSheetOpen(true)}
            className="rounded-md bg-white/10 p-2 text-white transition hover:bg-white/20 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Abrir menú"
          >
            <MenuIcon className="size-6" />
            <span className="sr-only">Abrir menú</span>
          </button>
        </div>
        <div className="flex-1 overflow-auto px-4 py-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
