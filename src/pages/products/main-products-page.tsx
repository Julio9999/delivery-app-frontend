import { DataTable } from '@/components/common/data-table/data-table';
import { Button } from '@/components/ui/button';
import { DeleteModal } from '@/components/common/delete-modal';
import { PageTitlePortal } from '@/components/layouts/page-title-portal';
import { SideFiltersToggleButton } from '@/components/common/side-filters/side-filters-toggle-button';
import { useProductsMainPage } from '@/modules/products/hooks/use-products-main-page';

export const MainPage = () => {
  const {
    productsDataTableStore,
    sideFiltersOpen,
    toggleSideFiltersOpen,
    hasAppliedFilters,
    rowToDelete,
    deleting,
    refreshKey,
    goToCreateProduct,
    handleDeleteModalOpenChange,
    handleConfirmDelete,
    productColumns,
    sideFilters,
    tableActions,
    fetchProducts,
  } = useProductsMainPage();

  return (
    <>
      <PageTitlePortal title="Productos" />
      <div className="flex h-full min-h-0 flex-col gap-2 overflow-hidden ">
        <div className='flex items-center justify-between gap-2'>
          <SideFiltersToggleButton
            open={sideFiltersOpen}
            onToggle={toggleSideFiltersOpen}
            hasAppliedFilters={hasAppliedFilters}
          />
          <Button onClick={goToCreateProduct}>Crear producto</Button>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">
          <DataTable
            store={productsDataTableStore}
            columns={productColumns}
            fetcher={fetchProducts}
            refreshKey={refreshKey}
            showSideFiltersToggle={false}
            sideFilters={sideFilters}
            actions={tableActions}
          />
        </div>
      </div>

      {rowToDelete && (
        <DeleteModal
          open={!!rowToDelete}
          onOpenChange={handleDeleteModalOpenChange}
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