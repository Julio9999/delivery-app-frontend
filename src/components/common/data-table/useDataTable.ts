import { useState, useMemo } from 'react';
import { useFetch } from '../../../hooks/useFetch';

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type DataTableBaseParams = {
  page: number;
  pageSize: number;
};

export type DataTableFilterValues = Record<string, string | number | boolean>;

interface UseDataTableOptions<TFilterParams extends Record<string, unknown>> {
  initialPage?: number;
  initialPageSize?: number;
  queryKey?: readonly unknown[];
  enabled?: boolean;
  initialFilters?: TFilterParams;
}

export function useDataTable<
  T,
  TFilterParams extends Record<string, unknown> = Record<string, never>,
>(
  fetcher: (params: DataTableBaseParams & TFilterParams) => Promise<PaginatedResult<T>>,
  {
    initialPage = 0,
    initialPageSize = 20,
    queryKey = [],
    enabled = true,
    initialFilters,
  }: UseDataTableOptions<TFilterParams> = {},
) {
  const [pageIndex, setPageIndex] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [appliedFilters, setAppliedFilters] = useState<TFilterParams>(
    initialFilters ?? ({} as TFilterParams),
  );
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const keyString = useMemo(
    () => JSON.stringify([...queryKey, pageIndex, pageSize, appliedFilters, fetchTrigger]),
    [queryKey, pageIndex, pageSize, appliedFilters, fetchTrigger],
  );

  const { data: result, isLoading, error } = useFetch<PaginatedResult<T>>({
    key: keyString,
    enabled,
    fetcher: () =>
      fetcher({
        page: pageIndex + 1,
        pageSize,
        ...appliedFilters,
      } as DataTableBaseParams & TFilterParams),
  });


  const data = result?.items ?? [];
  const totalPages = result?.totalPages ?? 0;

  const applyFilters = (nextFilters: TFilterParams) => {
    setAppliedFilters(nextFilters);
    setPageIndex(0);
  };

  const clearFilters = () => {
    setAppliedFilters({} as TFilterParams);
    setPageIndex(0);
  };

  return {
    data,
    isLoading,
    error,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
    appliedFilters,
    applyFilters,
    clearFilters,
    totalPages,
    refetch: () => setFetchTrigger((t) => t + 1),
  };
}
