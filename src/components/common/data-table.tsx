"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { useDataTable, type PaginatedResult } from "@/hooks/useDataTable"
import { DataTableBase } from "./data-table-base"


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    queryKey?: unknown[]
    fetcher: (params: { page: number; pageSize: number }) => Promise<PaginatedResult<TData>>
}

export function DataTable<TData, TValue>({
    columns,
    fetcher,
    queryKey,
}: DataTableProps<TData, TValue>) {

    const {
        data,
        isLoading,
        error,
        pageIndex,
        totalPages,
        setPageIndex,
    } = useDataTable<TData>(fetcher, { queryKey });

    return (
        <>
            {!error && (
                <DataTableBase<TData, TValue>
                    columns={columns}
                    data={data}
                    enablePagination
                    totalPages={totalPages}
                    pageIndex={pageIndex}
                    onPageChange={setPageIndex}
                    isLoading={isLoading}
                />
            )
            }
        </>
    )
}