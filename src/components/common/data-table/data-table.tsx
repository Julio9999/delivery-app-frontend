import React, { useEffect } from "react"
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { useDataTable, type DataTableBaseParams, type DataTableFilterValues, type PaginatedResult } from "@/components/common/data-table/useDataTable"
import type { DataTableFilters, DataTableStoreApi } from "@/stores/data-table-store"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react"
import { DataTableBase } from "./data-table-base"
import { Button } from "@/components/ui/button"
import {
    SideFiltersPanel,
    type SideFilterDefinition,
    type SideFilterValues,
} from "@/components/common/side-filters/side-filters-panel"


interface DataTableAction<TData> {
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    onClick: (row: TData) => void;
    variant?: "default" | "destructive";
}

export type DataTableSideFilter = SideFilterDefinition;

type FetcherParams = DataTableBaseParams & DataTableFilterValues;

interface DataTableProps<TData, TValue> {
    store: DataTableStoreApi<TData, DataTableFilters>;
    columns: ColumnDef<TData, TValue>[]
    queryKey?: unknown[]
    enablePagination?: boolean;
    onDataChange?: (payload: { data: TData[]; pageIndex: number; totalPages: number }) => void;
    fetcher: (params: FetcherParams) => Promise<PaginatedResult<TData>>
    actions?: DataTableAction<TData>[];
    refetchCallback?: (refetch: () => void) => void;
    refreshKey?: unknown;
    maxBodyHeight?: string;
    sideFilters?: SideFilterDefinition[];
    showSideFiltersToggle?: boolean;
}

export function DataTable<TData, TValue>({
    store,
    columns,
    queryKey,
    enablePagination = true,
    onDataChange,
    fetcher,
    actions,
    refetchCallback,
    refreshKey,
    maxBodyHeight,
    sideFilters = [],
    showSideFiltersToggle = true,
}: DataTableProps<TData, TValue>) {
    const {
        data,
        isLoading,
        error,
        pageIndex,
        totalPages,
        setPageIndex,
        appliedFilters,
        applyFilters,
        clearFilters,
        draftValues,
        draftLabels,
        setDraftValue,
        setDraftLabel,
        hasAppliedFilters,
        refetch,
        sideFiltersOpen,
        setSideFiltersOpen,
    } = useDataTable<TData, DataTableFilterValues>(
        fetcher,
        { store, queryKey },
    );

    const isMobile = !useMediaQuery('(min-width: 768px)');
    const [columnSizing, setColumnSizing] = React.useState<Record<string, number>>({});

    const allColumns = React.useMemo(() => {
        if (!actions || actions.length === 0) return columns;

        const actionCol: ColumnDef<TData, TValue> = {
            id: 'actions',
            header: '',
            size: 26,
            minSize: 26,
            maxSize: 26,
            enableResizing: false,
            cell: ({ row }) => {
                const rowData = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="cursor-pointer flex justify-center items-center" asChild>
                            <Button variant="ghost" className="p-0 m-0 w-5 h-5">
                                <MoreHorizontalIcon />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {actions.map((act, idx) => (
                                <DropdownMenuItem
                                    key={idx}
                                    onSelect={() => act.onClick(rowData)}
                                    variant={act.variant}
                                    className="cursor-pointer"
                                >
                                    <act.icon />
                                    {act.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        };

        return [actionCol, ...columns];
    }, [columns, actions]);

    const table = useReactTable({
        data,
        columns: allColumns,
        state: { columnSizing },
        onColumnSizingChange: setColumnSizing,
        columnResizeMode: 'onChange',
        defaultColumn: {
            enableResizing: !isMobile,
        },
        getCoreRowModel: getCoreRowModel(),
        manualPagination: enablePagination,
    });

    useEffect(() => {
        onDataChange?.({ data, pageIndex, totalPages });
    }, [data, onDataChange, pageIndex, totalPages]);

    useEffect(() => {
        if (refetchCallback) {
            refetchCallback(refetch);
        }
    }, [refetchCallback, refetch]);

    useEffect(() => {
        if (refreshKey !== undefined) {
            refetch();
        }
    }, [refreshKey, refetch]);

    return (
        <div className="flex h-full min-h-0 gap-2">
            {sideFilters.length > 0 && (
                <SideFiltersPanel
                    filters={sideFilters}
                    onApply={applyFilters}
                    onClear={clearFilters}
                    open={sideFiltersOpen}
                    onOpenChange={setSideFiltersOpen}
                    appliedValues={appliedFilters as SideFilterValues}
                    draftValues={draftValues}
                    draftLabels={draftLabels}
                    onDraftValueChange={setDraftValue}
                    onDraftLabelChange={setDraftLabel}
                    showToggleButton={showSideFiltersToggle}
                    hasAppliedFilters={hasAppliedFilters}
                />
            )}

            <div className="min-h-0 min-w-0 flex-1">
                {!error && (
                    <DataTableBase<TData, TValue>
                        columns={allColumns}
                        enablePagination={enablePagination}
                        totalPages={totalPages}
                        pageIndex={pageIndex}
                        onPageChange={setPageIndex}
                        isLoading={isLoading}
                        table={table}
                        maxBodyHeight={maxBodyHeight}
                    />
                )
                }
            </div>
        </div>
    )
}