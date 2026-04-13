import { MenuIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SideFiltersToggleButtonProps {
  open: boolean;
  onToggle: () => void;
  hasAppliedFilters?: boolean;
  className?: string;
}

export function SideFiltersToggleButton({
  open,
  onToggle,
  hasAppliedFilters = false,
  className,
}: SideFiltersToggleButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("relative overflow-visible", className)}
      aria-label={open ? "Cerrar filtros" : "Abrir filtros"}
      onClick={onToggle}
    >
      {hasAppliedFilters && (
        <span
          className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background"
          aria-hidden="true"
        />
      )}
      {open ? <XIcon /> : <MenuIcon />}
    </Button>
  );
}
