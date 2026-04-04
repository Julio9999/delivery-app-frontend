import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';
import axios from 'axios';
import { authApi } from '@/api/auth/auth';
import { useAuthSession } from '@/hooks/use-auth-session';

export default function ProtectedLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuthSession();

  if (isLoading) {
    return <div className="h-screen w-full grid place-items-center">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return (
    <div className="h-screen w-full grid grid-rows-12 overflow-hidden">
      <div className='row-span-1 bg-primary text-white'>
        <nav className=" text-white  flex items-center justify-between xl:container mx-auto h-full">
          <div className="text-lg font-bold">Panel de Administración</div>
          <ul className="flex gap-2">
            <li><Link to="/" className="hover:underline">Inicio</Link></li>
            <li><Link to="/categories" className="hover:underline">Categorias</Link></li>
            <li><Link to="/products" className="hover:underline">Productos</Link></li>
            <li>
              <button
                className="hover:underline cursor-pointer"
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
                type="button"
              >
                Cerrar sesion
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <div className='row-span-11 w-full h-full min-h-0 overflow-hidden'>
        <main className='row-span-11 w-full p-1 h-full min-h-0  mx-auto grid overflow-hidden'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
