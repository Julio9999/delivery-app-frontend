import { Outlet } from 'react-router';

export default function Layout() {
  return (
    <div className="min-h-screen ">
      <main className='w-full border-red-500 border flex items-center justify-center'>
        <Outlet />
      </main>
    </div>
  );
}
