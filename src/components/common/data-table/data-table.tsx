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
    /** optional callback that receives the refetch function returned by useDataTable */
    refetchCallback?: (refetch: () => void) => void;
    /** a value that when changed will trigger an automatic refetch */
    refreshKey?: unknown;
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
            header: 'Acciones',
            cell: ({ row }) => {
                const rowData = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="cursor-pointer flex justify-center w-full">
                            <MoreHorizontalIcon className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {actions.map((act, idx) => (
                                <DropdownMenuItem
                                    key={idx}
                                    onSelect={() => act.onClick(rowData)}
                                    variant={act.variant}
                                    className="cursor-pointer"
                                >
                                    <act.icon className="size-4" />
                                    {act.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        };

        return [...columns, actionCol];
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
                />
            )
            }
        </>
    )
}