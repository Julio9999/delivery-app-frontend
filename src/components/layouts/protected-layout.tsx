import { Outlet } from 'react-router';

export default function ProtectedLayout() {
  return (
    <div className="h-screen  w-full grid grid-rows-12">
      <div className='row-span-1 bg-gray-800 text-white'>
        <nav className="bg-gray-800 text-white  flex items-center justify-between xl:container mx-auto h-full">
          <div className="text-lg font-bold">Admin Panel</div>
          <ul className="flex">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/categories" className="hover:underline">Categories</a></li>
            <li><a href="/products" className="hover:underline">Products</a></li>
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
