import { DataTable } from '@/components/common/data-table/data-table';
import { PageTitlePortal } from '@/components/layouts/page-title-portal';
import { SideFiltersToggleButton } from '@/components/common/side-filters/side-filters-toggle-button';
import { useSalesMainPage } from '@/modules/sales/hooks/use-sales-main-page';

export const MainSalesPage = () => {
  const {
    salesDataTableStore,
    sideFiltersOpen,
    toggleSideFiltersOpen,
    hasAppliedFilters,
    saleColumns,
    sideFilters,
    tableActions,
    fetchSales,
  } = useSalesMainPage();

  return (
    <>
      <PageTitlePortal title="Ventas" />
      <div className="flex h-full min-h-0 flex-col gap-2 overflow-hidden">
        <div className='flex items-center justify-between gap-2'>
          <SideFiltersToggleButton
            open={sideFiltersOpen}
            onToggle={toggleSideFiltersOpen}
            hasAppliedFilters={hasAppliedFilters}
          />
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">
          <DataTable
            store={salesDataTableStore}
            columns={saleColumns}
            fetcher={fetchSales}
            showSideFiltersToggle={false}
            sideFilters={sideFilters}
            actions={tableActions}
          />
        </div>
      </div>
    </>
  );
};
