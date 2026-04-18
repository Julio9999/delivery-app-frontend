import { DataTable } from '@/components/common/data-table/data-table';
import { Button } from '@/components/ui/button';
import { DeleteModal } from '@/components/common/delete-modal';
import { PageTitlePortal } from '@/components/layouts/page-title-portal';
import { SideFiltersToggleButton } from '@/components/common/side-filters/side-filters-toggle-button';
import { useOffersMainPage } from '@/modules/offers/hooks/use-offers-main-page';

export const MainOffersPage = () => {
  const {
    offersDataTableStore,
    sideFiltersOpen,
    toggleSideFiltersOpen,
    hasAppliedFilters,
    rowToDelete,
    deleting,
    refreshKey,
    goToCreateOffer,
    handleDeleteModalOpenChange,
    handleConfirmDelete,
    offerColumns,
    sideFilters,
    tableActions,
    fetchOffers,
  } = useOffersMainPage();

  return (
    <>
      <PageTitlePortal title="Ofertas" />
      <div className="flex h-full min-h-0 flex-col gap-2 overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <SideFiltersToggleButton
            open={sideFiltersOpen}
            onToggle={toggleSideFiltersOpen}
            hasAppliedFilters={hasAppliedFilters}
          />
          <Button onClick={goToCreateOffer}>Crear oferta</Button>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          <DataTable
            store={offersDataTableStore}
            columns={offerColumns}
            fetcher={fetchOffers}
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
          title="Eliminar oferta"
          description={`Deseas eliminar la oferta ${rowToDelete.name || rowToDelete.id}? Esta accion no se puede deshacer.`}
          onConfirm={handleConfirmDelete}
          loading={deleting}
        />
      )}
    </>
  );
};
