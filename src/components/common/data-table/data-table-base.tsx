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
import { cn } from "@/lib/utils";



interface DataTableBaseProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    enablePagination?: boolean
    pageSize?: number;
    pageIndex: number;
    totalPages: number;
    isLoading: boolean;
    table: TableType<TData>;
    onPageChange: (newIndex: number) => void;
    maxBodyHeight?: string;
}

export function DataTableBase<TData, TValue>({
    columns,
    enablePagination = false,
    totalPages,
    pageIndex,
    isLoading,
    table,
    onPageChange,
    maxBodyHeight = "80vh",
}: DataTableBaseProps<TData, TValue>) {

    return (
        <div className="relative  border h-full flex flex-col gap-1">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/75">
                    <Spinner className="size-6" />
                </div>
            )}
            <div className="flex-1 h-full min-h-0 overflow-hidden">
                <div className="h-full overflow-hidden">
                    <Table
                        width={table.getTotalSize()}
                        className="table-fixed block overflow-y-auto overflow-x-hidden table-scroll-primary"
                        style={{ maxHeight: maxBodyHeight, marginRight: '-1px', paddingRight: '1px' }}
                    >
                        <TableHeader className="sticky top-0 z-20 bg-background">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="table w-full table-fixed">
                                {headerGroup.headers.map((header, index) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            style={{ width: header.getSize() }}
                                            className={cn(
                                                "sticky top-0 z-30 bg-background shadow-[0_1px_0_var(--color-border)]",
                                                {"border-l": index !== 0, "border-r": index === headerGroup.headers.length - 1 }
                                            )}
                                        >
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
                    <TableBody
                    >
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="table w-full table-fixed"
                                >
                                    {row.getVisibleCells().map((cell, index) => (
                                        <TableCell
                                            key={cell.id}
                                            style={{ width: cell.column.getSize() }}
                                            className={cn(
                                                "table-cell border-b h-12",
                                                { "border-l": index !== 0, "border-r": index === row.getVisibleCells().length - 1 }
                                            )}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className="table w-full table-fixed">
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    </Table>
                </div>
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