import { useState, useMemo } from 'react';
import { useFetch } from './useFetch';

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface UseDataTableOptions {
  initialPage?: number;
  initialPageSize?: number;
  queryKey?: readonly unknown[];
  enabled?: boolean;
}

export function useDataTable<T>(
  fetcher: (params: { page: number; pageSize: number }) => Promise<PaginatedResult<T>>,
  {
    initialPage = 0,
    initialPageSize = 10,
    queryKey = [],
    enabled = true,
  }: UseDataTableOptions = {},
) {
  const [pageIndex, setPageIndex] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const keyString = useMemo(
    () => JSON.stringify([...queryKey, pageIndex, pageSize, fetchTrigger]),
    [queryKey, pageIndex, pageSize, fetchTrigger],
  );

  const { data: result, isLoading, error } = useFetch<PaginatedResult<T>>({
    key: keyString,
    enabled,
    fetcher: () => fetcher({ page: pageIndex + 1, pageSize }),
  });


  const data = result?.items ?? [];
  const totalPages = result?.totalPages ?? 0;

  return {
    data,
    isLoading,
    error,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
    totalPages,
    refetch: () => setFetchTrigger((t) => t + 1),
  };
}
