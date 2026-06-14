import { useMemo } from 'react';
import { useParams } from 'react-router';
import type { SaleDetail, SaleListItem } from '@/api/interfaces/sale';
import { useMainStore } from '@/stores/main-store';

interface UseSaleDetailResult {
  sale: SaleDetail | SaleListItem | null;
  isLoading: boolean;
  isFromCache: boolean;
  notFound: boolean;
}

function loadSale(id: string | undefined): {
  sale: SaleDetail | SaleListItem | null;
  isFromCache: boolean;
  notFound: boolean;
} {
  if (!id) return { sale: null, isFromCache: false, notFound: true };

  // 1. Try POST cache from sessionStorage
  try {
    const cached = sessionStorage.getItem(`sale-${id}`);
    if (cached) {
      const parsed: SaleDetail = JSON.parse(cached);
      if (parsed && parsed.id === id) {
        return { sale: parsed, isFromCache: true, notFound: false };
      }
    }
  } catch {
    // Invalid JSON in cache — ignore and fall through
  }

  // 2. Fallback to list store data
  const salesStore = useMainStore.getState().sales;
  const listData = salesStore.getState().data;
  const listItem = listData.find((item) => item.id === id);

  if (listItem) {
    return { sale: listItem, isFromCache: false, notFound: false };
  }

  // 3. Not found in either source
  return { sale: null, isFromCache: false, notFound: true };
}

export function useSaleDetail(): UseSaleDetailResult {
  const { id } = useParams<{ id: string }>();

  const result = useMemo(() => loadSale(id), [id]);

  return { ...result, isLoading: false };
}
