import React from "react";
import { FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/common/date-picker/date-picker";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SelectAsyncPaginated } from "@/components/common/select-async-paginate/select-async-paginated";
import type { SelectAsyncPaginatedFetcher } from "@/components/common/select-async-paginate/use-select-async-paginated";
import { SideFiltersToggleButton } from "@/components/common/side-filters/side-filters-toggle-button";
import { useMediaQuery } from "@/hooks/use-media-query";

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

export interface SideFilterDateRangeDefinition extends SideFilterBase {
  type: "date-range";
  toKey: string;
  placeholder?: string;
  rangePlaceholder?: string;
}

export type SideFilterDefinition = SideFilterPrimitiveDefinition | SideFilterAsyncSelectDefinition | SideFilterDateRangeDefinition;

export type SideFilterValues = Record<string, string | number | boolean>;

interface SideFiltersPanelProps {
  filters: SideFilterDefinition[];
  title?: string;
  onApply: (values: SideFilterValues) => void;
  onClear?: () => void;
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  appliedValues?: SideFilterValues;
  draftValues?: Record<string, string>;
  draftLabels?: Record<string, string>;
  onDraftValueChange?: (key: string, value: string) => void;
  onDraftLabelChange?: (key: string, value: string) => void;
  showToggleButton?: boolean;
  hasAppliedFilters?: boolean;
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
  open: controlledOpen,
  onOpenChange,
  appliedValues,
  draftValues: controlledDraftValues,
  draftLabels: controlledDraftLabels,
  onDraftValueChange,
  onDraftLabelChange,
  showToggleButton = true,
  hasAppliedFilters = false,
}: SideFiltersPanelProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [internalDraftValues, setInternalDraftValues] = React.useState<Record<string, string>>({});
  const [internalDraftLabels, setInternalDraftLabels] = React.useState<Record<string, string>>({});

  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const draftValues = controlledDraftValues ?? internalDraftValues;
  const draftLabels = controlledDraftLabels ?? internalDraftLabels;

  React.useEffect(() => {
    if (!appliedValues || controlledDraftValues) {
      return;
    }

    const nextDraftValues = Object.entries(appliedValues).reduce<Record<string, string>>(
      (acc, [key, value]) => {
        if (value === undefined || value === null) {
          return acc;
        }

        acc[key] = String(value);
        return acc;
      },
      {},
    );

    setInternalDraftValues(nextDraftValues);
  }, [appliedValues, controlledDraftValues]);

  const setDraftValue = React.useCallback(
    (key: string, value: string) => {
      if (onDraftValueChange) {
        onDraftValueChange(key, value);
        return;
      }

      setInternalDraftValues((previous) => ({
        ...previous,
        [key]: value,
      }));
    },
    [onDraftValueChange],
  );

  const setDraftLabel = React.useCallback(
    (key: string, value: string) => {
      if (onDraftLabelChange) {
        onDraftLabelChange(key, value);
        return;
      }

      setInternalDraftLabels((previous) => ({
        ...previous,
        [key]: value,
      }));
    },
    [onDraftLabelChange],
  );

  const handleApply = React.useCallback(() => {
    const appliedValues = filters.reduce<SideFilterValues>((acc, filter) => {
      if (filter.type === "date-range") {
        const fromValue = parseFilterValue(
          { type: "date", label: filter.label, key: filter.key } satisfies SideFilterDefinition,
          draftValues[filter.key],
        );
        const toValue = parseFilterValue(
          { type: "date", label: filter.label, key: filter.toKey } satisfies SideFilterDefinition,
          draftValues[filter.toKey],
        );
        if (fromValue !== undefined) acc[filter.key] = fromValue;
        if (toValue !== undefined) acc[filter.toKey] = toValue;
      } else {
        const parsedValue = parseFilterValue(filter, draftValues[filter.key]);
        if (parsedValue !== undefined) {
          acc[filter.key] = parsedValue;
        }
      }
      return acc;
    }, {});

    onApply(appliedValues);
  }, [draftValues, filters, onApply]);

  const handleClear = React.useCallback(() => {
    if (!controlledDraftValues) {
      setInternalDraftValues({});
    }

    if (!controlledDraftLabels) {
      setInternalDraftLabels({});
    }

    filters.forEach((filter) => {
      onDraftValueChange?.(filter.key, "");
      onDraftLabelChange?.(filter.key, "");
      if (filter.type === "date-range") {
        onDraftValueChange?.(filter.toKey, "");
        onDraftLabelChange?.(filter.toKey, "");
      }
    });

    onClear?.();
  }, [
    controlledDraftLabels,
    controlledDraftValues,
    filters,
    onClear,
    onDraftLabelChange,
    onDraftValueChange,
  ]);

  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (filters.length === 0) {
    return null;
  }

  const filterContent = (
    <>
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
                    setDraftValue(filter.key, id ?? "");
                    setDraftLabel(filter.key, label ?? "");
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
                  setDraftValue(filter.key, event.target.value)
                }
              >
                <option value="">Todos</option>
                <option value="true">Si</option>
                <option value="false">No</option>
              </select>
              </>
            ) : filter.type === "date-range" ? (
              <>
                <Label>{filter.label}</Label>
                <DatePicker
                  rangeValue={{
                    from: draftValues[filter.key] || undefined,
                    to: draftValues[filter.toKey] || undefined,
                  }}
                  onRangeChange={(value) => {
                    setDraftValue(filter.key, value?.from ?? "");
                    setDraftValue(filter.toKey, value?.to ?? "");
                  }}
                  rangePlaceholder={filter.rangePlaceholder ?? "Selecciona un rango de fechas"}
                  enableRange
                  allowClear
                />
              </>
            ) : filter.type === "date" ? (
              <>
                <Label>{filter.label}</Label>
                <DatePicker
                  value={draftValues[filter.key] ?? ""}
                  onChange={(value) => setDraftValue(filter.key, value)}
                  placeholder={filter.label}
                  allowClear
                />
              </>
            ) : (
              <>
                <Label htmlFor={`side-filter-${filter.key}`}>{filter.label}</Label>
              <Input
                id={`side-filter-${filter.key}`}
                type={
                  filter.type === "number"
                    ? "number"
                    : "text"
                }
                value={draftValues[filter.key] ?? ""}
                onChange={(event) =>
                  setDraftValue(filter.key, event.target.value)
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
    </>
  );

  if (!isDesktop) {
    return (
      <div className="flex h-full min-h-0 flex-col items-start gap-2">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center justify-center rounded-full bg-primary p-3 text-white shadow-lg transition hover:bg-primary/90 cursor-pointer min-h-[44px] min-w-[44px]"
          title={title}
        >
          <FilterIcon className="size-5" />
          <span className="sr-only">{title}</span>
        </button>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="right" className="w-80 p-4 flex flex-col">
            <SheetTitle className="sr-only">{title}</SheetTitle>
            {filterContent}
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col items-start gap-2">
      {showToggleButton && (
        <SideFiltersToggleButton
          open={open}
          onToggle={() => setOpen(!open)}
          hasAppliedFilters={hasAppliedFilters}
        />
      )}

      {open && (
        <aside className="flex h-full min-h-0 w-72 shrink-0 flex-col  border bg-background p-4">
          {filterContent}
        </aside>
      )}
    </div>
  );
}
