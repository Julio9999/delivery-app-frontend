import { categoriesApi } from '@/api/categories/categories';
import type { Category } from '@/api/interfaces/category';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

export const MainCategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await categoriesApi.getAll();
        setCategories(data);
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
        <h1 className="text-2xl font-bold">Categorías</h1>
        <Link
          to="/categories/new"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Nueva categoría
        </Link>
      </div>

      {loading && <p>Cargando categorías...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && !error && (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Padre
              </th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {cat.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {cat.parentId || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/categories/${cat.id}/edit`}
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