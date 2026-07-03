interface PaginationProps {
  page: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, hasNextPage, onPageChange }: PaginationProps) {
  const buttonClass =
    "rounded-lg border border-line bg-surface px-4 py-1.5 text-sm font-medium " +
    "text-slate-100 transition-colors hover:bg-surface-2 disabled:cursor-not-allowed " +
    "disabled:text-muted/50 disabled:hover:bg-surface";

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        type="button"
        className={buttonClass}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      <span className="text-sm text-muted">Page {page}</span>
      <button
        type="button"
        className={buttonClass}
        disabled={!hasNextPage}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
