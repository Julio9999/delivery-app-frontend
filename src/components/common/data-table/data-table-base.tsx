"use no memo";

import { type ColumnDef, type Table as TableType, flexRender } from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Spinner } from "@/components/ui/spinner"
import { TablePagination } from "../table-pagination";



interface DataTableBaseProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    enablePagination?: boolean
    pageSize?: number;
    pageIndex: number;
    totalPages: number;
    isLoading: boolean;
    table: TableType<TData>;
    onPageChange: (newIndex: number) => void;
}

export function DataTableBase<TData, TValue>({
    columns,
    enablePagination = false,
    totalPages,
    pageIndex,
    isLoading,
    table,
    onPageChange
}: DataTableBaseProps<TData, TValue>) {


    return (
        <div className="relative rounded-md border h-full flex flex-col  gap-1 py-2">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/75">
                    <Spinner className="size-6" />
                </div>
            )}
            <div className="flex-1 h-full">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {enablePagination && (
                <div className="w-xs ml-auto"> 
                    <TablePagination
                        pageIndex={pageIndex}
                        pageCount={totalPages}
                        onPageChange={(newIndex) => onPageChange(newIndex)}
                    />
                </div>
            )}
        </div>
    )
}