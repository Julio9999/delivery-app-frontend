import { Link, Outlet } from 'react-router';
import { authClient } from '@/lib/auth-client';

export default function ProtectedLayout() {
  // const location = useLocation();
  // const { data: session, isPending } = authClient.useSession();

  // if (isPending) {
  //   return (
  //     <div className="h-screen w-full flex items-center justify-center">
  //       <p className="text-sm text-muted-foreground">Verificando sesion...</p>
  //     </div>
  //   );
  // }

  // if (!session) {
  //   return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  // }

  return (
    <div className="h-screen  w-full grid grid-rows-12">
      <div className='row-span-1 bg-gray-800 text-white'>
        <nav className="bg-gray-800 text-white  flex items-center justify-between xl:container mx-auto h-full">
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
      <div className='row-span-11 w-full h-full'>
        <main className='row-span-11 w-full p-1  h-full xl:container mx-auto grid  '>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
