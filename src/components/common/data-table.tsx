import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { useDataTable, type PaginatedResult } from "@/hooks/useDataTable"
import { DataTableBase } from "./data-table-base"


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    queryKey?: unknown[]
    enablePagination?: boolean;
    fetcher: (params: { page: number; pageSize: number }) => Promise<PaginatedResult<TData>>
}

export function DataTable<TData, TValue>({
    columns,
    queryKey,
    enablePagination = true,
    fetcher,
}: DataTableProps<TData, TValue>) {

    const {
        data,
        isLoading,
        error,
        pageIndex,
        totalPages,
        setPageIndex,
    } = useDataTable<TData>(fetcher, { queryKey });

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: enablePagination,
    });

    return (
        <>
            {!error && (
                <DataTableBase<TData, TValue>
                    columns={columns}
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