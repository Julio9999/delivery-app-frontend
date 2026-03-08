import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

interface TablePaginationProps {
  pageIndex: number;
  pageCount: number;
  onPageChange: (newIndex: number) => void;
}

export function TablePagination({
  pageIndex,
  pageCount,
  onPageChange,
}: TablePaginationProps) {

  return (
    <Pagination>
      <PaginationPrevious
        onClick={() => onPageChange(Math.max(pageIndex - 1, 0))}
      />
      <PaginationContent>
        {Array.from({ length: pageCount }).map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              isActive={i === pageIndex}
              onClick={() => onPageChange(i)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
      </PaginationContent>
      <PaginationNext
        onClick={() => onPageChange(Math.min(pageIndex + 1, pageCount - 1))}
      />
    </Pagination>
  );
}
