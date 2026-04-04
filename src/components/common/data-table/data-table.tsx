import React, { useEffect } from "react"
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { useDataTable, type PaginatedResult } from "@/hooks/useDataTable"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react"
import { DataTableBase } from "./data-table-base"
import { Button } from "@/components/ui/button"


interface DataTableAction<TData> {
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    onClick: (row: TData) => void;
    variant?: "default" | "destructive";
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    queryKey?: unknown[]
    enablePagination?: boolean;
    onDataChange?: (payload: { data: TData[]; pageIndex: number; totalPages: number }) => void;
    fetcher: (params: { page: number; pageSize: number }) => Promise<PaginatedResult<TData>>
    actions?: DataTableAction<TData>[];
    refetchCallback?: (refetch: () => void) => void;
    refreshKey?: unknown;
    maxBodyHeight?: string;
}

export function DataTable<TData, TValue>({
    columns,
    queryKey,
    enablePagination = true,
    onDataChange,
    fetcher,
    actions,
    refetchCallback,
    refreshKey,
    maxBodyHeight,
}: DataTableProps<TData, TValue>) {

    const {
        data,
        isLoading,
        error,
        pageIndex,
        totalPages,
        setPageIndex,
        refetch,
    } = useDataTable<TData>(fetcher, { queryKey });

    const allColumns = React.useMemo(() => {
        if (!actions || actions.length === 0) return columns;

        const actionCol: ColumnDef<TData, TValue> = {
            id: 'actions',
            header: '',
            size: 26,
            minSize: 26,
            maxSize: 26,
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
        <>
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
        </>
    )
}