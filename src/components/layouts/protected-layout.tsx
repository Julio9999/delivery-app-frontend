import { Link, Outlet } from 'react-router';
import { authClient } from '@/lib/auth-client';

export default function ProtectedLayout() {
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
                  await authClient.signOut();
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
        <main className='row-span-11 w-full p-1 h-full min-h-0 xl:container mx-auto grid overflow-hidden'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
