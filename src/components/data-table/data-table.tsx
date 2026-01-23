import { useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button/button";
import { cn } from "@/utils/cn";

export interface Column<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface SortingState {
  columnId?: string;
  direction?: "asc" | "desc";
}

export interface ServerTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pagination?: boolean;
  paginationState?: PaginationState;
  pageCount?: number;
  onPaginationChange?: (state: PaginationState) => void;
  pageSizeOptions?: number[];
  sorting?: boolean;
  sortingState?: SortingState;
  onSortingChange?: (state: SortingState) => void;
  filtering?: boolean;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  pagination = true,
  paginationState = { pageIndex: 0, pageSize: 10 },
  pageCount = 0,
  onPaginationChange,
  pageSizeOptions = [10, 25, 50, 100],
  sorting = true,
  sortingState = {},
  onSortingChange,
  filtering = true,
  filterValue = "",
  onFilterChange,
  isLoading = false,
  error = null,
  emptyMessage = "No data available",
  className,
}: ServerTableProps<T>) {
  const [localFilter, setLocalFilter] = useState(filterValue);

  const handleSort = (columnId: string) => {
    if (!onSortingChange) return;

    const column = columns.find((col) => col.id === columnId);
    if (!column?.sortable) return;

    if (sortingState.columnId === columnId) {
      if (sortingState.direction === "asc") {
        onSortingChange({ columnId, direction: "desc" });
      } else {
        onSortingChange({ columnId: undefined, direction: undefined });
      }
    } else {
      onSortingChange({ columnId, direction: "asc" });
    }
  };

  const handleFilterChange = (value: string) => {
    setLocalFilter(value);
    if (onFilterChange) {
      onFilterChange(value);
    }
  };

  const getSortIcon = (columnId: string) => {
    if (sortingState.columnId !== columnId) {
      return <ChevronsUpDown className="ml-2 h-4 w-4" />;
    }
    return sortingState.direction === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  const startIndex = paginationState.pageIndex * paginationState.pageSize;
  const endIndex = startIndex + paginationState.pageSize;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filter */}
      {filtering && onFilterChange && (
        <div className="flex items-center justify-between">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search all columns..."
              value={localFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="block w-full max-w-sm rounded-lg border border-gray-300 bg-white py-2 pr-3 pl-10 text-sm placeholder-gray-400 shadow-sm transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.id}>
                {column.sortable && sorting ? (
                  <button
                    type="button"
                    className="group inline-flex items-center gap-1 font-semibold text-gray-900 transition-colors hover:text-blue-600 focus:outline-none"
                    onClick={() => handleSort(column.id)}
                  >
                    <span>{column.header}</span>
                    <span className="text-gray-400 transition-colors group-hover:text-blue-600">
                      {getSortIcon(column.id)}
                    </span>
                  </button>
                ) : (
                  column.header
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  <p className="text-sm text-gray-500">Loading data...</p>
                </div>
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <svg
                    className="h-8 w-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <svg
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-sm text-gray-500">{emptyMessage}</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {column.cell
                      ? column.cell(row)
                      : column.accessorKey
                        ? String(row[column.accessorKey] ?? "")
                        : null}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {pagination && onPaginationChange && (
        <div className="flex flex-col gap-4 border-t border-gray-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          {/* Mobile view */}
          <div className="flex flex-1 items-center justify-between sm:hidden">
            <div className="flex items-center gap-2">
              <label
                htmlFor="pageSize-mobile"
                className="text-sm text-gray-700"
              >
                Per page:
              </label>
              <select
                id="pageSize-mobile"
                value={paginationState.pageSize}
                onChange={(e) => {
                  const newPageSize = Number(e.target.value);
                  onPaginationChange({
                    ...paginationState,
                    pageSize: newPageSize,
                    pageIndex: 0,
                  });
                }}
                className="rounded-md border-0 py-1.5 pr-8 pl-3 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-blue-600"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() =>
                  onPaginationChange({
                    ...paginationState,
                    pageIndex: paginationState.pageIndex - 1,
                  })
                }
                disabled={paginationState.pageIndex === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() =>
                  onPaginationChange({
                    ...paginationState,
                    pageIndex: paginationState.pageIndex + 1,
                  })
                }
                disabled={paginationState.pageIndex >= pageCount - 1}
              >
                Next
              </Button>
            </div>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-700">
                {data.length > 0 && (
                  <>
                    Showing{" "}
                    <span className="font-medium tabular-nums">
                      {startIndex + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium tabular-nums">
                      {Math.min(endIndex, startIndex + data.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium tabular-nums">
                      {paginationState.pageSize * (pageCount || 1)}
                    </span>{" "}
                    results
                  </>
                )}
              </p>
              {onPaginationChange && (
                <div className="flex items-center gap-2">
                  <label htmlFor="pageSize" className="text-sm text-gray-700">
                    Per page:
                  </label>
                  <select
                    id="pageSize"
                    value={paginationState.pageSize}
                    onChange={(e) => {
                      const newPageSize = Number(e.target.value);
                      onPaginationChange({
                        ...paginationState,
                        pageSize: newPageSize,
                        pageIndex: 0,
                      });
                    }}
                    className="rounded-md border-0 py-1.5 pr-8 pl-3 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                  >
                    {pageSizeOptions.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  type="button"
                  className="focus:z-sticky relative inline-flex items-center rounded-l-md px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() =>
                    onPaginationChange({
                      ...paginationState,
                      pageIndex: paginationState.pageIndex - 1,
                    })
                  }
                  disabled={paginationState.pageIndex === 0}
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => {
                  let pageNum;
                  if (pageCount <= 5) {
                    pageNum = i + 1;
                  } else if (paginationState.pageIndex < 3) {
                    pageNum = i + 1;
                  } else if (paginationState.pageIndex > pageCount - 3) {
                    pageNum = pageCount - 4 + i;
                  } else {
                    pageNum = paginationState.pageIndex - 1 + i;
                  }

                  const isActive = paginationState.pageIndex === pageNum - 1;

                  return (
                    <button
                      key={pageNum}
                      type="button"
                      className={cn(
                        "focus:z-sticky relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-colors focus:outline-offset-0",
                        isActive
                          ? "z-dropdown bg-blue-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                          : "focus:z-sticky text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:outline-offset-0"
                      )}
                      onClick={() =>
                        onPaginationChange({
                          ...paginationState,
                          pageIndex: pageNum - 1,
                        })
                      }
                    >
                      <span className="tabular-nums">{pageNum}</span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  className="focus:z-sticky relative inline-flex items-center rounded-r-md px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() =>
                    onPaginationChange({
                      ...paginationState,
                      pageIndex: paginationState.pageIndex + 1,
                    })
                  }
                  disabled={paginationState.pageIndex >= pageCount - 1}
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
