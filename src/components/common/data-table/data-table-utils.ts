import type { ColumnDef } from "@tanstack/react-table";

export type DataTableColumns<T> = ColumnDef<T>[];

export function defineColumns<T>(
  cols: DataTableColumns<T>,
): DataTableColumns<T> {
  return cols;
}
