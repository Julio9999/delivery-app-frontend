import { useCallback, useEffect, useRef, useState } from 'react';
import type { PaginatedResult, PaginationParams } from '@/api/interfaces/pagination';

export type SelectAsyncPaginatedItem = { id: string; label: string };

export type SelectAsyncPaginatedFetcher = (
	params: PaginationParams & Record<string, string | number | boolean | undefined>,
) => Promise<PaginatedResult<SelectAsyncPaginatedItem>>;

export interface UseSelectAsyncPaginatedOptions {
	fetcher: SelectAsyncPaginatedFetcher;
	value?: string | null;
	onValueChange?: (id: string | null, label: string | null) => void;
	multiple?: boolean;
	selectedItems?: SelectAsyncPaginatedItem[];
	onValuesChange?: (items: SelectAsyncPaginatedItem[]) => void;
	queryParams?: Record<string, string | number | boolean | undefined>;
	pageSize?: number;
	searchParamName?: string;
	debounceMs?: number;
	placeholder?: string;
	selectedLabel?: string | null;
}

export function useSelectAsyncPaginated({
	fetcher,
	value,
	onValueChange,
	multiple = false,
	selectedItems,
	onValuesChange,
	queryParams,
	pageSize = 10,
	searchParamName = 'search',
	debounceMs = 500,
	placeholder = 'Selecciona una opción',
	selectedLabel = null,
}: UseSelectAsyncPaginatedOptions) {
	const [open, setOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');

	const [items, setItems] = useState<SelectAsyncPaginatedItem[]>([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [internalValue, setInternalValue] = useState<string | null>(value ?? null);
	const [internalSelectedItems, setInternalSelectedItems] = useState<
		SelectAsyncPaginatedItem[]
	>([]);
	const [triggerWidth, setTriggerWidth] = useState<number | undefined>(undefined);
	const triggerRef = useRef<HTMLElement | null>(null);

	const debouncedSearch = useDebouncedValue(searchTerm, debounceMs);

	const hasMore = currentPage < totalPages;
	const queryParamsKey = JSON.stringify(queryParams ?? {});

	useEffect(() => {
		if (value !== undefined) {
			setInternalValue(value);
		}
	}, [value]);

	useEffect(() => {
		if (!open || !triggerRef.current) return;
		setTriggerWidth(triggerRef.current.offsetWidth);
	}, [open]);

	const selectedValue = value ?? internalValue;
	const selectedItemsValue = selectedItems ?? internalSelectedItems;

	const resolvedSelectedLabel =
		selectedLabel?.trim() ? selectedLabel : undefined;

	const selectedLabelToShow = multiple
		? selectedItemsValue.length === 0
			? placeholder
			: selectedItemsValue.length === 1
				? selectedItemsValue[0].label
				: `${selectedItemsValue.length} seleccionados`
		: selectedValue === null
			? placeholder
			: items.find((item) => String(item.id) === String(selectedValue))?.label ?? resolvedSelectedLabel ?? placeholder;

	const fetchPage = useCallback(
		async (page: number, append: boolean) => {
			if (append) {
				setIsLoadingMore(true);
			} else {
				setIsLoading(true);
			}

			setError(null);

			try {
				const params: Parameters<SelectAsyncPaginatedFetcher>[0] = {
					...(queryParams ?? {}),
					page,
					pageSize,
					[searchParamName]: debouncedSearch.trim() ? debouncedSearch.trim() : undefined,
				};

				const result = await fetcher(params);

				setItems((prev) => (append ? [...prev, ...result.items] : result.items));
				setCurrentPage(result.page);
				setTotalPages(result.totalPages);
			} catch (err) {
				const message = err instanceof Error ? err.message : String(err);
				setError(message);
			} finally {
				if (append) {
					setIsLoadingMore(false);
				} else {
					setIsLoading(false);
				}
			}
		},
		[debouncedSearch, pageSize, queryParams, searchParamName, fetcher],
	);

	useEffect(() => {
		void fetchPage(1, false);
	}, [fetchPage, queryParamsKey]);

	const handleListScroll = useCallback(
		(event: React.UIEvent<HTMLElement>) => {
			if (isLoading || isLoadingMore || !hasMore) return;

			const target = event.currentTarget;
			const distanceToBottom = target.scrollHeight - target.scrollTop - target.clientHeight;

			if (distanceToBottom <= 24) {
				void fetchPage(currentPage + 1, true);
			}
		},
		[currentPage, fetchPage, hasMore, isLoading, isLoadingMore],
	);

	const handleSelect = useCallback(
		(item: SelectAsyncPaginatedItem | null) => {
			if (multiple) {
				if (!item) {
					if (selectedItems === undefined) {
						setInternalSelectedItems([]);
					}
					onValuesChange?.([]);
					return;
				}

				const exists = selectedItemsValue.some(
					(selectedItem) => String(selectedItem.id) === String(item.id),
				);

				const nextItems = exists
					? selectedItemsValue.filter(
						(selectedItem) => String(selectedItem.id) !== String(item.id),
					)
					: [...selectedItemsValue, item];

				if (selectedItems === undefined) {
					setInternalSelectedItems(nextItems);
				}

				onValuesChange?.(nextItems);
				return;
			}

			setOpen(false);
			if (!item) {
				setInternalValue(null);
				onValueChange?.(null, null);
				return;
			}
			setInternalValue(item.id);
			onValueChange?.(item.id, item.label);
		},
		[multiple, onValueChange, onValuesChange, selectedItems, selectedItemsValue],
	);

	return {
		open,
		setOpen,
		searchTerm,
		setSearchTerm,
		items,
		isLoading,
		isLoadingMore,
		error,
		selectedLabelToShow,
		handleListScroll,
		handleSelect,
		triggerRef,
		triggerWidth,
		selectedValue,
		selectedItems: selectedItemsValue,
	};
}

const useDebouncedValue = <T,>(value: T, delayMs: number) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedValue(value), delayMs);
		return () => window.clearTimeout(id);
	}, [value, delayMs]);

	return debouncedValue;
};
