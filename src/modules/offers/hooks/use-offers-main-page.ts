import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { EditIcon, TrashIcon } from 'lucide-react';

import type { Offer } from '@/api/interfaces/offer';
import { offersApi } from '@/api/offers/offers';
import { defineColumns } from '@/components/common/data-table/data-table-utils';
import { showSuccessToast } from '@/lib/utils';
import { useMainStore, useOffersStoreState } from '@/stores/main-store';

const formatDate = (value?: string | null) => {
  if (!value) {
    return '-';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '-';
  }

  return parsed.toLocaleString('es-ES');
};

const offerColumns = defineColumns<Offer>([
  {
    accessorKey: 'name',
    header: 'Nombre',
    cell: ({ row }) => row.original.name || '-',
  },
  {
    accessorKey: 'discountPercentage',
    header: 'Descuento',
    cell: ({ row }) =>
      typeof row.original.discountPercentage === 'number'
        ? `${row.original.discountPercentage}%`
        : '-',
  },
  {
    accessorKey: 'offerStartsAt',
    header: 'Inicio',
    cell: ({ row }) => formatDate(row.original.offerStartsAt),
  },
  {
    accessorKey: 'offerEndsAt',
    header: 'Fin',
    cell: ({ row }) => formatDate(row.original.offerEndsAt),
  },
  {
    accessorKey: 'isOnOffer',
    header: 'Estado',
    cell: ({ row }) => (row.original.isOnOffer ? 'Activa' : 'Inactiva'),
  },
  {
    accessorKey: 'productsCount',
    header: 'Productos',
    cell: ({ row }) => row.original.productsCount ?? 0,
  },
]);

const sideFilters = [
  {
    label: 'Solo activas',
    key: 'isOnOffer',
    type: 'boolean' as const,
  },
];

export const useOffersMainPage = () => {
  const navigate = useNavigate();
  const offersDataTableStore = useMainStore((state) => state.offers);
  const sideFiltersOpen = useOffersStoreState((state) => state.sideFiltersOpen);
  const toggleSideFiltersOpen = useOffersStoreState(
    (state) => state.toggleSideFiltersOpen,
  );
  const hasAppliedFilters = useOffersStoreState((state) => state.hasAppliedFilters);

  const [rowToDelete, setRowToDelete] = useState<Offer | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const goToCreateOffer = useCallback(() => {
    navigate('/offers/create');
  }, [navigate]);

  const handleCloseDeleteModal = useCallback(() => {
    setRowToDelete(null);
  }, []);

  const handleDeleteModalOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        handleCloseDeleteModal();
      }
    },
    [handleCloseDeleteModal],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!rowToDelete) return;

    setDeleting(true);
    try {
      await offersApi.remove(rowToDelete.id);
      showSuccessToast('Oferta eliminada');
      setRefreshKey((value) => value + 1);
    } catch (error) {
      console.error(error);
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
        onClick: (row: Offer) => navigate(`/offers/${row.id}`),
      },
      {
        label: 'Eliminar',
        icon: TrashIcon,
        variant: 'destructive' as const,
        onClick: (row: Offer) => setRowToDelete(row),
      },
    ],
    [navigate],
  );

  return {
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
    fetchOffers: offersApi.getAll,
  };
};
