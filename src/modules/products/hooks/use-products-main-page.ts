import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { EditIcon, TrashIcon } from 'lucide-react';
import type { Product } from '@/api/interfaces/product';
import { productsApi } from '@/api/products/products';
import { searchApi } from '@/api/search/search';
import { defineColumns } from '@/components/common/data-table/data-table-utils';
import { showSuccessToast } from '@/lib/utils';
import { useMainStore, useProductsStoreState } from '@/stores/main-store';

const productColumns = defineColumns<Product>([
  {
    accessorKey: 'name',
    header: 'Nombre',
  },
  {
    accessorKey: 'description',
    header: 'Descripción',
  },
  {
    accessorKey: 'price',
    header: 'Precio base',
  },
  {
    accessorKey: 'currentPrice',
    header: 'Precio vigente',
    cell: ({ row }) => row.original.currentPrice ?? row.original.price,
  },
  {
    accessorKey: 'isOnOffer',
    header: 'Oferta',
    cell: ({ row }) => (row.original.isOnOffer ? 'Activa' : '-'),
  },
  {
    accessorKey: 'discountPercentage',
    header: 'Descuento',
    cell: ({ row }) =>
      row.original.isOnOffer && typeof row.original.discountPercentage === 'number'
        ? `${row.original.discountPercentage}%`
        : '-',
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
  },
  {
    accessorKey: 'category.name',
    header: 'Categoría',
    cell: ({ row }) => row.original.category?.name || '-',
  },
]);

const sideFilters = [
  {
    label: 'En oferta',
    key: 'isOnOffer',
    type: 'boolean' as const,
  },
  {
    label: 'Categoría',
    key: 'categoryId',
    type: 'async-select' as const,
    fetcher: searchApi.searchCategories,
    placeholder: 'Selecciona una categoría',
    searchPlaceholder: 'Buscar categoría...',
  },
];

export const useProductsMainPage = () => {
  const navigate = useNavigate();
  const productsDataTableStore = useMainStore((s) => s.products);
  const sideFiltersOpen = useProductsStoreState((s) => s.sideFiltersOpen);
  const toggleSideFiltersOpen = useProductsStoreState((s) => s.toggleSideFiltersOpen);
  const hasAppliedFilters = useProductsStoreState((s) => s.hasAppliedFilters);

  const [rowToDelete, setRowToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const goToCreateProduct = useCallback(() => {
    navigate('/products/create');
  }, [navigate]);

  const handleCloseDeleteModal = useCallback(() => {
    setRowToDelete(null);
  }, []);

  const handleDeleteModalOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen) {
      handleCloseDeleteModal();
    }
  }, [handleCloseDeleteModal]);

  const handleConfirmDelete = useCallback(async () => {
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
  }, [rowToDelete]);

  const tableActions = useMemo(
    () => [
      {
        label: 'Editar',
        icon: EditIcon,
        onClick: (row: Product) => navigate(`/products/${row.id}`),
      },
      {
        label: 'Eliminar',
        icon: TrashIcon,
        variant: 'destructive' as const,
        onClick: (row: Product) => setRowToDelete(row),
      },
    ],
    [navigate],
  );


  return {
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
    fetchProducts: productsApi.getAll,
  };
};
