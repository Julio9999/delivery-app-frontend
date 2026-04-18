import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { categoriesApi } from '@/api/categories/categories';
import type { Category } from '@/api/interfaces/category';
import { DataTable } from '@/components/common/data-table/data-table';
import { defineColumns } from '@/components/common/data-table/data-table-utils';
import { EditIcon, TrashIcon } from 'lucide-react';
import { DeleteModal } from '@/components/common/delete-modal';
import { showSuccessToast } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PageTitlePortal } from '@/components/layouts/page-title-portal';
import { useMainStore } from '@/stores/main-store';

export const MainCategoriesPage = () => {
  const navigate = useNavigate();
  const categoriesDataTableStore = useMainStore((state) => state.categories);
  const [rowToDelete, setRowToDelete] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const categoryColumns = useMemo(
    () =>
      defineColumns<Category>([
        { accessorKey: 'name', header: 'Nombre' },
        {
          accessorKey: 'parentName',
          header: 'Padre',
          cell: ({ getValue }) => {
            const parentName = getValue() as string | undefined;
            return parentName ?? '';
          },
        },
      ]),
    [],
  );


  const handleConfirmDelete = async () => {
    if (!rowToDelete) return;
    setDeleting(true);
    try {
      await categoriesApi.remove(rowToDelete.id);
      showSuccessToast('Categoría eliminada');
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
      <PageTitlePortal title="Categorías" />
      <div className="flex h-full min-h-0 flex-col gap-2 overflow-hidden ">
        <div className="flex justify-end">
          <Button onClick={() => navigate('/categories/create')}>Crear categoría</Button>
        </div>

        <div className="border-blue-500 flex-1 h-full">
          <DataTable
            store={categoriesDataTableStore}
            columns={categoryColumns}
            fetcher={categoriesApi.getAll}
            refreshKey={refreshKey}
            actions={[
              {
                label: 'Editar',
                icon: EditIcon,
                onClick: (row) => navigate(`/categories/${row.id}`),
              },
              {
                label: 'Eliminar',
                icon: TrashIcon,
                variant: 'destructive',
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
          title="Eliminar categoría"
          description={`¿Deseas eliminar "${rowToDelete.name}"? Esta acción no se puede deshacer.`}
          onConfirm={handleConfirmDelete}
          loading={deleting}
        />
      )}
    </>
  );
};