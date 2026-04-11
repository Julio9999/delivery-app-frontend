import { useMemo, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router';
import axios from 'axios';
import { HomeIcon, LayersIcon, BoxIcon } from 'lucide-react';

import { authApi } from '@/api/auth/auth';
import { useAuthSession } from '@/hooks/use-auth-session';
import Sidebar, { type SidebarItem } from './Sidebar';
import { showErrorToast } from '@/lib/utils';

export default function ProtectedLayout() {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuthSession();

  const navItems = useMemo<SidebarItem[]>(
    () => [
      { label: 'Inicio', to: '/', icon: HomeIcon },
      { label: 'Categorias', to: '/categories', icon: LayersIcon },
      { label: 'Productos', to: '/products', icon: BoxIcon },
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
