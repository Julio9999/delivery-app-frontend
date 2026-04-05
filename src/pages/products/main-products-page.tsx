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
import { PageTitlePortal } from '@/components/layouts/page-title-portal';

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
    header: "Precio base",
  },
  {
    accessorKey: "currentPrice",
    header: "Precio vigente",
    cell: ({ row }) => row.original.currentPrice ?? row.original.price,
  },
  {
    accessorKey: "isOnOffer",
    header: "Oferta",
    cell: ({ row }) => row.original.isOnOffer ? 'Activa' : '-',
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "category.name",
    header: "Categoría",
    cell: ({ row }) => row.original.category?.name || '-',
  }
]);

export const MainPage = () => {
  const navigate = useNavigate();

  const [rowToDelete, setRowToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [offerFilter, setOfferFilter] = useState<'all' | 'active'>('all');


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
    <>
      <PageTitlePortal>
        <h1 className="text-xl font-semibold tracking-tight">Productos</h1>
      </PageTitlePortal>
      <div className="flex h-full min-h-0 flex-col gap-2 overflow-hidden ">
        <div className='flex justify-end items-center gap-2'>
          <select
            className="border rounded-md px-2 py-1 text-sm"
            value={offerFilter}
            onChange={(event) => setOfferFilter(event.target.value as 'all' | 'active')}
          >
            <option value="all">Todos</option>
            <option value="active">Solo en oferta</option>
          </select>
          <Button onClick={() => navigate('/products/create')}>Crear producto</Button>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">
          <DataTable
            columns={productColumns}
            fetcher={(params) =>
              productsApi.getAll({
                ...params,
                isOnOffer: offerFilter === 'active' ? true : undefined,
              })
            }
            queryKey={[offerFilter]}
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
    </>
  );
};