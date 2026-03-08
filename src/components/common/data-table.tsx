import React, { useEffect } from "react"
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { useDataTable, type PaginatedResult } from "@/hooks/useDataTable"
import { DataTableBase } from "./data-table-base"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react"


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
}

export function DataTable<TData, TValue>({
    columns,
    queryKey,
    enablePagination = true,
    onDataChange,
    fetcher,
    actions,
}: DataTableProps<TData, TValue>) {

    const {
        data,
        isLoading,
        error,
        pageIndex,
        totalPages,
        setPageIndex,
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