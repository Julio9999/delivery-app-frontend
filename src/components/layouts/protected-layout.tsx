import { Navigate, Outlet, useLocation, useNavigate } from 'react-router';
import { useMemo, useState } from 'react';
import { HomeIcon, LayersIcon, BoxIcon } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { authApi } from '@/api/auth/auth';
import { useAuthSession } from '@/hooks/use-auth-session';
import Sidebar, { type SidebarItem } from './Sidebar';

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

      <main className="min-h-full overflow-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
