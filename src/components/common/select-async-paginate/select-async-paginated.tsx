import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import { useSelectAsyncPaginated, type SelectAsyncPaginatedFetcher } from './use-select-async-paginated';


export interface SelectAsyncPaginatedProps {
	fetcher: SelectAsyncPaginatedFetcher;
	onValueChange: (id: string | null, label: string | null) => void;
	value?: string | null;
	queryParams?: Record<string, string | number | boolean | undefined>;
	pageSize?: number;
	searchParamName?: string;
	debounceMs?: number;
	placeholder?: string;
	searchPlaceholder?: string;
	selectedLabel?: string | null;
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
	queryParams,
	pageSize = 10,
	searchParamName = 'search',
	debounceMs = 500,
	placeholder = 'Selecciona una opción',
	searchPlaceholder = 'Buscar...',
	selectedLabel = null,
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
		isLoading,
		isLoadingMore,
		error,
		selectedLabelToShow,
		triggerRef,
		triggerWidth,
	} = useSelectAsyncPaginated({
		fetcher,
		onValueChange,
		value,
		queryParams,
		pageSize,
		searchParamName,
		debounceMs,
		placeholder,
		selectedLabel,
	});
	return (
		<div className={cn('space-y-1', className)}>
			<DropdownMenu open={open} onOpenChange={setOpen}>
				<DropdownMenuTrigger asChild>
					<Button
						ref={triggerRef}
						disabled={disabled}
						variant="outline"
						className="justify-between w-full"
					>
						{selectedLabelToShow}
					</Button>
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

						{!isLoading &&
							items.map((item) => (
								<DropdownMenuItem
									key={item.id}
									onSelect={() => handleSelect(item)}
								>
									{item.label}
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
