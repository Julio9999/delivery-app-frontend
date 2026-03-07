import { Link } from 'react-router';
import { productsApi } from '../api/products/products';
import type { Product } from '../api/interfaces/product';
import { DataTable } from '@/components/common/data-table';
import { defineColumns } from '@/components/common/data-table-utils';

const productColumns = defineColumns<Product>([
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "price",
    header: "Precio",
  },
  {
    accessorKey: "stock",
    header: "Stock",
  }
]);

export const MainPage = () => {


  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Productos</h1>
        <div className="space-x-2">
          <Link
            to="/categories"
            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Categorías
          </Link>
          <Link
            to="/products/new"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Nuevo producto
          </Link>
        </div>
      </div>

      <DataTable<Product, Product[]>
        columns={productColumns}
        fetcher={productsApi.getAll}
      />
    </div>
  );
};