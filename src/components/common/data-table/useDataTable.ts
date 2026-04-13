import { useEffect, useMemo, useRef } from "react";
import { useStore } from "zustand";
import type {
  PaginatedResult,
  PaginationParams,
} from "@/api/interfaces/pagination";
import {
  type DataTableStoreApi,
  type DataTableFilters,
} from "@/stores/data-table-store";

export type { PaginatedResult };

export type DataTableBaseParams = Required<Pick<PaginationParams, "page" | "pageSize">>;

export type DataTableFilterValues = DataTableFilters;

type UseDataTableOptions<T,TFilterParams extends DataTableFilters> = {
  store: DataTableStoreApi<T, TFilterParams>;
  queryKey?: readonly unknown[];
  enabled?: boolean;
};

export const useDataTableSideFiltersState = <T,TFilterParams extends DataTableFilters>(store: DataTableStoreApi<T, TFilterParams>) => {
  const {
    sideFiltersOpen,
    hasAppliedFilters,
    setSideFiltersOpen,
    toggleSideFiltersOpen,
  } = useStore(store);

  return {
    sideFiltersOpen,
    hasAppliedFilters,
    setSideFiltersOpen,
    toggleSideFiltersOpen,
  };
};

export const useDataTable = <T,TFilterParams extends DataTableFilters = Record<string, never>>(fetcher: (params: DataTableBaseParams & TFilterParams) => Promise<PaginatedResult<T>>,
  {
    store,
    queryKey = [],
    enabled = true,
  }: UseDataTableOptions<T, TFilterParams>,
) => {
  const {
    pageIndex,
    pageSize,
    appliedFilters,
    hasAppliedFilters,
    data,
    totalPages,
    isLoading,
    error,
    fetchTrigger,
    setPageIndex,
    setPageSize,
    applyFilters,
    clearFilters,
    draftValues,
    draftLabels,
    setDraftValue,
    setDraftLabel,
    clearDraftState,
    refetch,
    sideFiltersOpen,
    setSideFiltersOpen,
    startFetch,
    completeFetch,
    failFetch,
  } = useStore(store);

  const requestIdRef = useRef(0);
  const serializedQueryKey = useMemo(
    () => JSON.stringify(queryKey),
    [queryKey],
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    startFetch();

    void fetcher({
      page: pageIndex + 1,
      pageSize,
      ...appliedFilters,
    } as DataTableBaseParams & TFilterParams)
      .then((result) => {
        if (requestIdRef.current !== requestId) {
          return;
        }

        completeFetch({
          data: result.items,
          totalPages: result.totalPages,
        });
      })
      .catch((fetchError: unknown) => {
        if (requestIdRef.current !== requestId) {
          return;
        }

        failFetch(fetchError);
      });
  }, [
    appliedFilters,
    completeFetch,
    enabled,
    failFetch,
    fetchTrigger,
    fetcher,
    pageIndex,
    pageSize,
    serializedQueryKey,
    startFetch,
  ]);

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
    draftValues,
    draftLabels,
    setDraftValue,
    setDraftLabel,
    clearDraftState,
    totalPages,
    hasAppliedFilters,
    refetch,
    sideFiltersOpen,
    setSideFiltersOpen,
  };
};
