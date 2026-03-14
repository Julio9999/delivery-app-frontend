import { useState } from 'react';
import { useNavigate } from 'react-router';
import { productsApi } from '../../api/products/products';
import type { Product } from '../../api/interfaces/product';
import { DataTable } from '@/components/common/data-table/data-table';
import { defineColumns } from '@/components/common/data-table/data-table-utils';
import { EditIcon, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeleteModal } from '@/components/common/delete-modal';
import { showSuccessToast } from '@/lib/utils';

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

  const [rowToDelete, setRowToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);


  const handleConfirmDelete = async () => {
    if (!rowToDelete) return;
    setDeleting(true);
    try {
      await productsApi.remove(rowToDelete.id);
      showSuccessToast('Producto eliminado');
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
      setRowToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className='flex justify-between'>
        <h1 className="text-2xl font-bold">Productos</h1>
        <Button onClick={() => navigate('/products/create')}>Crear producto</Button>
      </div>
      <div className=" border-blue-500  flex-1 h-full">
        <DataTable<Product, Product[]>
          columns={productColumns}
          fetcher={productsApi.getAll}
          refreshKey={refreshKey}
          actions={[
            {
              label: "Editar",
              icon: EditIcon,
              onClick: (row) => navigate(`/products/${row.id}`),
            },
            {
              label: "Eliminar",
              icon: TrashIcon,
              variant: "destructive",
              onClick: (row) => setRowToDelete(row),
            },
          ]}
        />
      </div>

      {rowToDelete && (
        <DeleteModal
          open={!!rowToDelete}
          onOpenChange={(o) => !o && setRowToDelete(null)}
          trigger={null}
          title="Eliminar producto"
          description={`¿Deseas eliminar "${rowToDelete.name}"? Esta acción no se puede deshacer.`}
          onConfirm={handleConfirmDelete}
          loading={deleting}
        />
      )}
    </div>
  );
};