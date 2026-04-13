import { createStore, type StoreApi } from "zustand/vanilla";

export type DataTableFilters = Record<string, unknown>;

export interface DataTableStoreConfig<TFilterParams extends DataTableFilters> {
  initialPage?: number;
  initialPageSize?: number;
  initialFilters?: TFilterParams;
  initialSideFiltersOpen?: boolean;
}

export interface DataTableStoreState<TData,TFilterParams extends DataTableFilters> {
  pageIndex: number;
  pageSize: number;
  appliedFilters: TFilterParams;
  hasAppliedFilters: boolean;
  draftValues: Record<string, string>;
  draftLabels: Record<string, string>;
  data: TData[];
  totalPages: number;
  isLoading: boolean;
  error: unknown;
  fetchTrigger: number;
  sideFiltersOpen: boolean;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  applyFilters: (nextFilters: TFilterParams) => void;
  clearFilters: () => void;
  setDraftValue: (key: string, value: string) => void;
  setDraftLabel: (key: string, value: string) => void;
  clearDraftState: () => void;
  setSideFiltersOpen: (isOpen: boolean) => void;
  toggleSideFiltersOpen: () => void;
  startFetch: () => void;
  completeFetch: (result: { data: TData[]; totalPages: number }) => void;
  failFetch: (error: unknown) => void;
  refetch: () => void;
}

export type DataTableStoreApi<TData,TFilterParams extends DataTableFilters> = StoreApi<DataTableStoreState<TData, TFilterParams>>;

// Guarantees that filters are always an object, even when none are provided.
const resolveInitialFilters = <TFilterParams extends DataTableFilters>(initialFilters?: TFilterParams): TFilterParams => initialFilters ?? ({} as TFilterParams);

// Converts applied filters to string drafts so inputs can display and edit values.
const toDraftValues = (filters: DataTableFilters): Record<string, string> =>
  Object.entries(filters).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      if (value === undefined || value === null) {
        return acc;
      }

      acc[key] = String(value);
      return acc;
    },
    {},
  );

// Returns true when at least one filter has a meaningful value.
const hasAnyFilter = (filters: DataTableFilters): boolean =>
  Object.values(filters).some((value) => {
    if (value === undefined || value === null) {
      return false;
    }

    if (typeof value === "string") {
      return value.trim().length > 0;
    }

    return true;
  });

// Creates one isolated DataTable store instance with optional initial config.
export const createDataTableStore = <TData,TFilterParams extends DataTableFilters>(config: DataTableStoreConfig<TFilterParams> = {}): DataTableStoreApi<TData, TFilterParams> => {
  const initialPage = config.initialPage ?? 0;
  const initialPageSize = config.initialPageSize ?? 20;
  const initialFilters = resolveInitialFilters(config.initialFilters);
  const initialHasAppliedFilters = hasAnyFilter(initialFilters);
  const initialDraftValues = toDraftValues(initialFilters);
  const initialSideFiltersOpen = config.initialSideFiltersOpen ?? false;

  return createStore<DataTableStoreState<TData, TFilterParams>>((set) => ({
    pageIndex: initialPage,
    pageSize: initialPageSize,
    appliedFilters: initialFilters,
    hasAppliedFilters: initialHasAppliedFilters,
    draftValues: initialDraftValues,
    draftLabels: {},
    data: [],
    totalPages: 0,
    isLoading: false,
    error: null,
    fetchTrigger: 0,
    sideFiltersOpen: initialSideFiltersOpen,
    // Moves to a specific page.
    setPageIndex: (pageIndex) => set({ pageIndex }),
    // Changes page size and resets to first page to avoid invalid index.
    setPageSize: (pageSize) => set({ pageSize, pageIndex: 0 }),
    // Commits current filters, updates badge state, and resets pagination.
    applyFilters: (nextFilters) =>
      set({
        appliedFilters: nextFilters,
        hasAppliedFilters: hasAnyFilter(nextFilters),
        draftValues: toDraftValues(nextFilters),
        pageIndex: 0,
      }),
    // Restores filters and drafts to initial values.
    clearFilters: () =>
      set({
        appliedFilters: resolveInitialFilters(initialFilters),
        hasAppliedFilters: initialHasAppliedFilters,
        draftValues: initialDraftValues,
        draftLabels: {},
        pageIndex: 0,
      }),
    // Updates one draft input value without applying filters yet.
    setDraftValue: (key, value) =>
      set((state) => ({
        draftValues: {
          ...state.draftValues,
          [key]: value,
        },
      })),
    // Updates one draft label (useful for async select where value and label differ).
    setDraftLabel: (key, value) =>
      set((state) => ({
        draftLabels: {
          ...state.draftLabels,
          [key]: value,
        },
      })),
    // Clears all temporary draft values and labels.
    clearDraftState: () => set({ draftValues: {}, draftLabels: {} }),
    // Opens or closes side filters panel.
    setSideFiltersOpen: (isOpen) => set({ sideFiltersOpen: isOpen }),
    // Toggles side filters panel state.
    toggleSideFiltersOpen: () =>
      set((state) => ({ sideFiltersOpen: !state.sideFiltersOpen })),
    // Marks fetch as running and resets previous error.
    startFetch: () => set({ isLoading: true, error: null }),
    // Stores successful response and clears loading state.
    completeFetch: ({ data, totalPages }) =>
      set({
        data,
        totalPages,
        isLoading: false,
        error: null,
      }),
    // Stores fetch error, stops loading, and clears stale rows.
    failFetch: (error) =>
      set({
        error,
        isLoading: false,
        data: [],
      }),
    // Forces data reload by incrementing a trigger counter.
    refetch: () => set((state) => ({ fetchTrigger: state.fetchTrigger + 1 })),
  }));
};
