import React from "react";
import { MenuIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectAsyncPaginated } from "@/components/common/select-async-paginate/select-async-paginated";
import type { SelectAsyncPaginatedFetcher } from "@/components/common/select-async-paginate/use-select-async-paginated";

export type SideFilterType = "text" | "number" | "boolean" | "date" | "async-select";

interface SideFilterBase {
  label: string;
  key: string;
}

export interface SideFilterPrimitiveDefinition extends SideFilterBase {
  type: Exclude<SideFilterType, "async-select">;
}

export interface SideFilterAsyncSelectDefinition extends SideFilterBase {
  type: "async-select";
  fetcher: SelectAsyncPaginatedFetcher;
  queryParams?: Record<string, string | number | boolean | undefined>;
  pageSize?: number;
  searchParamName?: string;
  debounceMs?: number;
  placeholder?: string;
  searchPlaceholder?: string;
  allowClear?: boolean;
  clearLabel?: string;
}

export type SideFilterDefinition = SideFilterPrimitiveDefinition | SideFilterAsyncSelectDefinition;

export type SideFilterValues = Record<string, string | number | boolean>;

interface SideFiltersPanelProps {
  filters: SideFilterDefinition[];
  title?: string;
  onApply: (values: SideFilterValues) => void;
  onClear?: () => void;
}

function parseFilterValue(filter: SideFilterDefinition, value?: string) {
  const normalizedValue = value?.trim() ?? "";

  if (normalizedValue.length === 0) {
    return undefined;
  }

  if (filter.type === "number") {
    const parsed = Number(normalizedValue);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  if (filter.type === "boolean") {
    if (normalizedValue === "true") return true;
    if (normalizedValue === "false") return false;
    return undefined;
  }

  return normalizedValue;
}

export function SideFiltersPanel({
  filters,
  title = "Filtros",
  onApply,
  onClear,
}: SideFiltersPanelProps) {
  const [open, setOpen] = React.useState(false);
  const [draftValues, setDraftValues] = React.useState<Record<string, string>>({});
  const [draftLabels, setDraftLabels] = React.useState<Record<string, string>>({});

  const handleApply = React.useCallback(() => {
    const appliedValues = filters.reduce<SideFilterValues>((acc, filter) => {
      const parsedValue = parseFilterValue(filter, draftValues[filter.key]);
      if (parsedValue !== undefined) {
        acc[filter.key] = parsedValue;
      }
      return acc;
    }, {});

    onApply(appliedValues);
  }, [draftValues, filters, onApply]);

  const handleClear = React.useCallback(() => {
    setDraftValues({});
    setDraftLabels({});
    onClear?.();
  }, [onClear]);

  if (filters.length === 0) {
    return null;
  }

  return (
    <div className="flex h-full min-h-0 items-start gap-2">
      <Button
        variant="outline"
        size="icon"
        aria-label={open ? "Cerrar filtros" : "Abrir filtros"}
        onClick={() => setOpen((previous) => !previous)}
      >
        {open ? <XIcon /> : <MenuIcon />}
      </Button>

      {open && (
        <aside className="flex h-full min-h-0 w-72 shrink-0 flex-col  border bg-background p-4">
          <div className="mb-4">
            <h3 className="text-base font-semibold">{title}</h3>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
            {filters.map((filter) => (
              <div key={filter.key} className="mx-1 space-y-2">
                {filter.type === "async-select" ? (
                  <>
                    <Label>{filter.label}</Label>
                    <SelectAsyncPaginated
                      fetcher={filter.fetcher}
                      value={draftValues[filter.key] ?? null}
                      selectedLabel={draftLabels[filter.key] ?? null}
                      onValueChange={(id, label) => {
                        setDraftValues((previous) => ({
                          ...previous,
                          [filter.key]: id ?? "",
                        }));

                        setDraftLabels((previous) => ({
                          ...previous,
                          [filter.key]: label ?? "",
                        }));
                      }}
                      queryParams={filter.queryParams}
                      pageSize={filter.pageSize}
                      searchParamName={filter.searchParamName}
                      debounceMs={filter.debounceMs}
                      placeholder={filter.placeholder ?? "Selecciona una opción"}
                      searchPlaceholder={filter.searchPlaceholder ?? "Buscar..."}
                      allowClear={filter.allowClear ?? true}
                      clearLabel={filter.clearLabel ?? "Limpiar selección"}
                    />
                  </>
                ) : filter.type === "boolean" ? (
                  <>
                    <Label htmlFor={`side-filter-${filter.key}`}>{filter.label}</Label>
                  <select
                    id={`side-filter-${filter.key}`}
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                    value={draftValues[filter.key] ?? ""}
                    onChange={(event) =>
                      setDraftValues((previous) => ({
                        ...previous,
                        [filter.key]: event.target.value,
                      }))
                    }
                  >
                    <option value="">Todos</option>
                    <option value="true">Si</option>
                    <option value="false">No</option>
                  </select>
                  </>
                ) : (
                  <>
                    <Label htmlFor={`side-filter-${filter.key}`}>{filter.label}</Label>
                  <Input
                    id={`side-filter-${filter.key}`}
                    type={
                      filter.type === "date"
                        ? "date"
                        : filter.type === "number"
                          ? "number"
                          : "text"
                    }
                    value={draftValues[filter.key] ?? ""}
                    onChange={(event) =>
                      setDraftValues((previous) => ({
                        ...previous,
                        [filter.key]: event.target.value,
                      }))
                    }
                  />
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={handleClear}>
              Limpiar
            </Button>
            <Button onClick={handleApply}>Aplicar</Button>
          </div>
        </aside>
      )}
    </div>
  );
}
