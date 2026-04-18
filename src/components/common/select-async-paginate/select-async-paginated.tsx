import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CheckIcon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

import {
	useSelectAsyncPaginated,
	type SelectAsyncPaginatedFetcher,
	type SelectAsyncPaginatedItem,
} from './use-select-async-paginated';

export interface SelectAsyncPaginatedProps {
	fetcher: SelectAsyncPaginatedFetcher;
	onValueChange?: (id: string | null, label: string | null) => void;
	multiple?: boolean;
	selectedItems?: SelectAsyncPaginatedItem[];
	onValuesChange?: (items: SelectAsyncPaginatedItem[]) => void;
	value?: string | null;
	queryParams?: Record<string, string | number | boolean | undefined>;
	pageSize?: number;
	searchParamName?: string;
	debounceMs?: number;
	placeholder?: string;
	searchPlaceholder?: string;
	selectedLabel?: string | null;
	allowClear?: boolean;
	clearLabel?: string;
	disabled?: boolean;
	className?: string;
	listClassName?: string;
	emptyMessage?: string;
	loadingMessage?: string;
	loadingMoreMessage?: string;
}

export const SelectAsyncPaginated = ({
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
	searchPlaceholder = 'Buscar...',
	selectedLabel = null,
	allowClear = false,
	clearLabel = 'Sin padre',
	disabled = false,
	className,
	listClassName,
	emptyMessage = 'Sin resultados',
	loadingMessage = 'Cargando...',
	loadingMoreMessage = 'Cargando más...',
}: SelectAsyncPaginatedProps) => {
	const {
		setOpen,
		setSearchTerm,
		handleListScroll,
		handleSelect,
		open,
		searchTerm,
		items,
		selectedItems: currentSelectedItems,
		isLoading,
		isLoadingMore,
		error,
		selectedLabelToShow,
		triggerRef,
		triggerWidth,
		selectedValue,
	} = useSelectAsyncPaginated({
		fetcher,
		onValueChange,
		multiple,
		selectedItems,
		onValuesChange,
		value,
		queryParams,
		pageSize,
		searchParamName,
		debounceMs,
		placeholder,
		selectedLabel,
	});

	const selectedIds = new Set(currentSelectedItems.map((item) => String(item.id)));
	const showClear = multiple
		? currentSelectedItems.length > 0
		: selectedValue != null;

	const renderTriggerContent = () => {
		if (!multiple) {
			return <span className="truncate">{selectedLabelToShow}</span>;
		}

		if (currentSelectedItems.length === 0) {
			return <span className="text-muted-foreground">{placeholder}</span>;
		}

		return (
			<div className="flex w-full flex-wrap items-center gap-1">
				{currentSelectedItems.map((item) => (
					<span
						key={item.id}
						className="inline-flex max-w-44 items-center gap-1 rounded-md border bg-muted px-2 py-0.5 text-xs"
					>
						<span className="truncate">{item.label}</span>
						<span
							role="button"
							tabIndex={0}
							className="cursor-pointer rounded-sm opacity-70 hover:opacity-100"
							onPointerDown={(event) => {
								event.preventDefault();
								event.stopPropagation();
							}}
							onMouseDown={(event) => {
								event.preventDefault();
								event.stopPropagation();
							}}
							onClick={(event) => {
								event.preventDefault();
								event.stopPropagation();
								handleSelect(item);
							}}
							onKeyDown={(event) => {
								if (event.key === 'Enter' || event.key === ' ') {
									event.preventDefault();
									event.stopPropagation();
									handleSelect(item);
								}
							}}
						>
							<XIcon className="size-3" />
						</span>
					</span>
				))}
			</div>
		);
	};
	return (
		<div className={cn('space-y-1', className)}>
			<DropdownMenu open={open} onOpenChange={setOpen}>
				<DropdownMenuTrigger asChild>
					{multiple ? (
						<div
							ref={(element) => {
								triggerRef.current = element;
							}}
							role="button"
							tabIndex={disabled ? -1 : 0}
							aria-disabled={disabled}
							className={cn(
								buttonVariants({ variant: 'outline', size: 'default' }),
								'h-auto min-h-9 w-full justify-between',
								disabled && 'pointer-events-none opacity-50',
							)}
						>
							{renderTriggerContent()}
						</div>
					) : (
						<Button
							ref={(element) => {
								triggerRef.current = element;
							}}
							disabled={disabled}
							variant="outline"
							className="h-auto min-h-9 w-full justify-between"
						>
							{renderTriggerContent()}
						</Button>
					)}
				</DropdownMenuTrigger>

				<DropdownMenuContent
					className={cn(listClassName)}
					style={{ width: triggerWidth ? `${triggerWidth}px` : 'auto' }}
				>
					<div className="p-2">
						<Input
							placeholder={searchPlaceholder}
							value={searchTerm}
							onChange={(event) => setSearchTerm(event.currentTarget.value)}
						/>
					</div>

					<div
						className="max-h-60 overflow-y-auto table-scroll-primary"
						onScroll={handleListScroll}
					>
						{isLoading ? (
							<div className="px-2 py-2 text-sm text-muted-foreground">
								{loadingMessage}
							</div>
						) : null}

						{!isLoading && items.length === 0 ? (
							<div className="px-2 py-2 text-sm text-muted-foreground">
								{emptyMessage}
							</div>
						) : null}

						{!isLoading && allowClear && showClear ? (
							<DropdownMenuItem
								onSelect={(event) => {
									if (multiple) {
										event.preventDefault();
									}
									handleSelect(null);
								}}
							>
								{clearLabel}
							</DropdownMenuItem>
						) : null}

						{!isLoading &&
							items.map((item) => (
								<DropdownMenuItem
									key={item.id}
									onSelect={(event) => {
										if (multiple) {
											event.preventDefault();
										}
										handleSelect(item);
									}}
								>
									{item.label}
									{multiple && selectedIds.has(String(item.id)) ? (
										<CheckIcon className="ml-auto size-4" />
									) : null}
								</DropdownMenuItem>
							))}

						{isLoadingMore ? (
							<div className="px-2 py-2 text-sm text-muted-foreground">
								{loadingMoreMessage}
							</div>
						) : null}
					</div>
				</DropdownMenuContent>
			</DropdownMenu>

			{error ? <p className="text-xs text-destructive">{error}</p> : null}
		</div>
	);
}
