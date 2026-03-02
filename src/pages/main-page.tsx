import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { productsApi } from '../api/products/products';
import type { Product } from '../api/interfaces/product';

export const MainPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await productsApi.getAll();
        setProducts(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Link
          to="/products/new"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Nuevo producto
        </Link>
      </div>

      {loading && <p>Cargando productos...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && !error && (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((prod) => (
              <tr key={prod.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {prod.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {prod.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {prod.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/products/${prod.id}/edit`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};