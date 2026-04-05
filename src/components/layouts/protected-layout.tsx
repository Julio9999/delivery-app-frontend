import { Navigate, Outlet, useLocation, useNavigate } from 'react-router';
import { useMemo, useState } from 'react';
import { HomeIcon, LayersIcon, BoxIcon } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { authApi } from '@/api/auth/auth';
import { useAuthSession } from '@/hooks/use-auth-session';
import Sidebar, { type SidebarItem } from './Sidebar';
import { PageTitlePortalProvider } from './page-title-portal';

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

      toast.error('No se pudo cerrar sesion');
    }
  };

  const [hasPortalTitle, setHasPortalTitle] = useState(false);

  const pageTitle = useMemo(() => {
    if (location.pathname.startsWith('/products')) {
      if (location.pathname.endsWith('/create')) return 'Crear producto';
      if (/^\/products\/[\w-]+$/.test(location.pathname)) return 'Editar producto';
      return 'Productos';
    }

    if (location.pathname.startsWith('/categories')) {
      if (location.pathname.endsWith('/create')) return 'Crear categoría';
      if (/^\/categories\/[\w-]+$/.test(location.pathname)) return 'Editar categoría';
      return 'Categorías';
    }

    return 'Inicio';
  }, [location.pathname]);

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

      <PageTitlePortalProvider
        onPortalTitleMount={() => setHasPortalTitle(true)}
        onPortalTitleUnmount={() => setHasPortalTitle(false)}
      >
        <main className="min-h-full overflow-auto bg-background">
          <div id="layout-page-title" className="mb-4 bg-primary px-4 py-3 text-white shadow-sm">
            {!hasPortalTitle && (
              <h1 className="text-xl font-semibold tracking-tight">{pageTitle}</h1>
            )}
          </div>
          <div className="px-4 py-4">
            <Outlet />
          </div>
        </main>
      </PageTitlePortalProvider>
    </div>
  );
}
