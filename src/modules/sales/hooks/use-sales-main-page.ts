import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { EyeIcon } from 'lucide-react';
import { format } from 'date-fns';
import type { SaleListItem } from '@/api/interfaces/sale';
import { salesApi } from '@/api/sales/sales';
import { searchApi } from '@/api/search/search';
import { defineColumns } from '@/components/common/data-table/data-table-utils';
import { useMainStore, useSalesStoreState } from '@/stores/main-store';

const saleColumns = defineColumns<SaleListItem>([
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => row.original.id.slice(0, 8) + '…',
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ row }) =>
      row.original.total.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }),
  },
  {
    accessorKey: 'itemCount',
    header: 'Items',
  },
  {
    accessorKey: 'createdAt',
    header: 'Fecha',
    cell: ({ row }) => {
      try {
        return format(new Date(row.original.createdAt), 'dd/MM/yyyy HH:mm');
      } catch {
        return row.original.createdAt;
      }
    },
  },
]);

const sideFilters = [
  {
    label: 'Rango de fechas',
    key: 'from',
    toKey: 'to',
    type: 'date-range' as const,
    rangePlaceholder: 'Selecciona un rango de fechas',
  },
  {
    label: 'Producto',
    key: 'productId',
    type: 'async-select' as const,
    fetcher: searchApi.searchProducts,
    placeholder: 'Selecciona un producto',
    searchPlaceholder: 'Buscar producto...',
  },
];

export const useSalesMainPage = () => {
  const navigate = useNavigate();
  const salesDataTableStore = useMainStore((s) => s.sales);
  const sideFiltersOpen = useSalesStoreState((s) => s.sideFiltersOpen);
  const toggleSideFiltersOpen = useSalesStoreState((s) => s.toggleSideFiltersOpen);
  const hasAppliedFilters = useSalesStoreState((s) => s.hasAppliedFilters);

  const tableActions = useMemo(
    () => [
      {
        label: 'Ver detalle',
        icon: EyeIcon,
        onClick: (row: SaleListItem) => navigate(`/sales/${row.id}`),
      },
    ],
    [navigate],
  );

  return {
    salesDataTableStore,
    sideFiltersOpen,
    toggleSideFiltersOpen,
    hasAppliedFilters,
    saleColumns,
    sideFilters,
    tableActions,
    fetchSales: salesApi.getAll,
  };
};
