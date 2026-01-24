/**
 * Pagination Component
 *
 * Standalone pagination component with page number buttons and navigation.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [page, setPage] = useState(1);
 *   const totalPages = 10;
 *
 *   return (
 *     <Pagination
 *       currentPage={page}
 *       totalPages={totalPages}
 *       onPageChange={setPage}
 *     />
 *   );
 * }
 * ```
 */

import { cn } from "@/utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
  showFirstLast?: boolean;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 5,
  showFirstLast = true,
  className,
}: PaginationProps) {
  const pages = generatePageNumbers(currentPage, totalPages, maxVisible);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirst = () => {
    onPageChange(1);
  };

  const handleLast = () => {
    onPageChange(totalPages);
  };

  return (
    <nav
      className={cn("flex items-center justify-center gap-1", className)}
      aria-label="Pagination"
    >
      {showFirstLast && (
        <PaginationButton
          onClick={handleFirst}
          disabled={currentPage === 1}
          aria-label="Go to first page"
        >
          <svg
            className="size-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </PaginationButton>
      )}

      <PaginationButton
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        <svg
          className="size-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </PaginationButton>

      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="px-3 py-2 text-gray-500"
            aria-hidden="true"
          >
            ...
          </span>
        ) : (
          <PaginationButton
            key={page}
            onClick={() => onPageChange(page as number)}
            active={page === currentPage}
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </PaginationButton>
        )
      )}

      <PaginationButton
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        <svg
          className="size-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </PaginationButton>

      {showFirstLast && (
        <PaginationButton
          onClick={handleLast}
          disabled={currentPage === totalPages}
          aria-label="Go to last page"
        >
          <svg
            className="size-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </PaginationButton>
      )}
    </nav>
  );
}

interface PaginationButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

function PaginationButton({
  children,
  active,
  className,
  disabled,
  ...props
}: PaginationButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex min-w-10 items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none",
        active
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
        disabled && "cursor-not-allowed opacity-50 hover:bg-white",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number
): (number | "ellipsis")[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [];
  const halfVisible = Math.floor(maxVisible / 2);

  let startPage = Math.max(currentPage - halfVisible, 1);
  const endPage = Math.min(startPage + maxVisible - 1, totalPages);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(endPage - maxVisible + 1, 1);
  }

  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) {
      pages.push("ellipsis");
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push("ellipsis");
    }
    pages.push(totalPages);
  }

  return pages;
}

export default Pagination;
