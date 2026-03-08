import { useNavigate } from 'react-router';
import { productsApi } from '../../api/products/products';
import type { Product } from '../../api/interfaces/product';
import { DataTable } from '@/components/common/data-table';
import { defineColumns } from '@/components/common/data-table-utils';
import { EditIcon, TrashIcon } from 'lucide-react';

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
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold">Productos</h1>
      <div className=" border-blue-500  flex-1 h-full">
        <DataTable<Product, Product[]>
          columns={productColumns}
          fetcher={productsApi.getAll}
          actions={[
            {
              label: "Editar",
              icon: EditIcon,
              onClick: (row) => navigate(`/products/${row.id}/edit`),
            },
            {
              label: "Eliminar",
              icon: TrashIcon,
              variant: "destructive",
              onClick: (row) => console.log("delete", row.name),
            },
          ]}
        />
      </div>
    </div>
  );
};