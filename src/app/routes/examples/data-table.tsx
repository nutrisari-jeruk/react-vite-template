import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DataTable,
  type Column,
  type PaginationState,
  type SortingState,
} from "@/components/data-table";
import { Badge } from "@/components/ui/badge/badge";

// Mock data types
interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "User" | "Editor" | "Viewer";
  status: "Active" | "Inactive" | "Pending";
  createdAt: string;
  lastLogin: string;
}

// Mock API - Simulates server-side data fetching
const mockUsers: User[] = Array.from({ length: 150 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: ["Admin", "User", "Editor", "Viewer"][
    Math.floor(Math.random() * 4)
  ] as User["role"],
  status: ["Active", "Inactive", "Pending"][
    Math.floor(Math.random() * 3)
  ] as User["status"],
  createdAt: new Date(
    Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
  ).toISOString(),
  lastLogin: new Date(
    Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
  ).toISOString(),
}));

async function fetchUsers({
  pageIndex,
  pageSize,
  columnId,
  direction,
  filter,
}: {
  pageIndex: number;
  pageSize: number;
  columnId?: string;
  direction?: "asc" | "desc";
  filter?: string;
}) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filteredData = [...mockUsers];

  // Apply filter (server-side)
  if (filter) {
    const lowerFilter = filter.toLowerCase();
    filteredData = filteredData.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerFilter) ||
        user.email.toLowerCase().includes(lowerFilter) ||
        user.role.toLowerCase().includes(lowerFilter)
    );
  }

  // Apply sorting (server-side)
  if (columnId && direction) {
    filteredData.sort((a, b) => {
      const aValue = String(a[columnId as keyof User]);
      const bValue = String(b[columnId as keyof User]);
      return direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  }

  // Apply pagination (server-side)
  const totalRecords = filteredData.length;
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  const paginatedData = filteredData.slice(start, end);

  return {
    data: paginatedData,
    pageCount: Math.ceil(totalRecords / pageSize),
    totalRecords,
  };
}

export default function DataTableExample() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>({});
  const [filter, setFilter] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["users", pagination, sorting, filter],
    queryFn: () =>
      fetchUsers({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        columnId: sorting.columnId,
        direction: sorting.direction,
        filter,
      }),
  });

  const columns: Column<User>[] = [
    {
      id: "id",
      header: "ID",
      accessorKey: "id",
      sortable: true,
    },
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      sortable: true,
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email",
      sortable: true,
    },
    {
      id: "role",
      header: "Role",
      accessorKey: "role",
      sortable: true,
      cell: (row) => {
        const variants = {
          Admin: "danger",
          User: "primary",
          Editor: "success",
          Viewer: "default",
        } as const;
        return (
          <Badge variant={variants[row.role]} pill>
            {row.role}
          </Badge>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (row) => {
        const variants = {
          Active: "success",
          Inactive: "default",
          Pending: "warning",
        } as const;
        return (
          <Badge variant={variants[row.status]} pill>
            {row.status}
          </Badge>
        );
      },
    },
    {
      id: "createdAt",
      header: "Created At",
      accessorKey: "createdAt",
      sortable: true,
      cell: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      id: "lastLogin",
      header: "Last Login",
      accessorKey: "lastLogin",
      sortable: true,
      cell: (row) => new Date(row.lastLogin).toLocaleDateString(),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance text-gray-900 sm:text-4xl">
          Users
        </h1>
        <p className="mt-2 text-sm text-pretty text-gray-600">
          A fully-featured data table with server-side pagination, sorting, and
          filtering capabilities.
        </p>
      </div>

      {/* Data Table */}
      <DataTable
        data={data?.data || []}
        columns={columns}
        pagination
        paginationState={pagination}
        pageCount={data?.pageCount || 0}
        onPaginationChange={setPagination}
        sorting
        sortingState={sorting}
        onSortingChange={setSorting}
        filtering
        filterValue={filter}
        onFilterChange={(value) => {
          setFilter(value);
          setPagination({ ...pagination, pageIndex: 0 });
        }}
        isLoading={isLoading}
        error={error ? "Failed to load data" : null}
        emptyMessage="No users found"
      />

      {/* Features Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
          <h3 className="mb-4 text-lg font-semibold text-balance text-gray-900">
            Server-Side Features
          </h3>
          <ul className="space-y-3 text-sm text-pretty text-gray-600">
            <li className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>Pagination</strong> - Data is fetched page-by-page from
                the server
              </span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>Sorting</strong> - Click column headers to sort
                server-side
              </span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>Filtering</strong> - Real-time search with server
                requests
              </span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>Loading States</strong> - Shows spinner while fetching
                data
              </span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>TanStack Query</strong> - Automatic caching and
                refetching
              </span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>Custom Cells</strong> - Render custom components (Badge,
                Avatar, etc.)
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
          <h3 className="mb-4 text-lg font-semibold text-balance text-gray-900">
            Is TanStack Table Required?
          </h3>
          <p className="text-sm text-pretty text-gray-600">
            <strong className="text-gray-900">No!</strong> This example
            demonstrates server-side capabilities{" "}
            <strong className="text-gray-900">without</strong> TanStack Table.
            However, you can use TanStack Table for more advanced features:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Column resizing and reordering</span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Row selection and expansion</span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Virtual scrolling for large datasets</span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Better TypeScript support</span>
            </li>
          </ul>
          <p className="mt-4 rounded-md bg-blue-50 p-3 text-sm text-blue-800">
            For simple use cases, a custom implementation like this is often
            sufficient and easier to maintain.
          </p>
        </div>
      </div>

      {/* Query State */}
      {data && (
        <div className="mt-8 rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Query State (Debug)
          </h3>
          <div className="overflow-x-auto rounded-lg bg-gray-50 p-4">
            <pre className="text-xs text-gray-700">
              {JSON.stringify(
                {
                  pagination,
                  sorting,
                  filter: filter || "(empty)",
                  totalRecords: data.totalRecords,
                  pageCount: data.pageCount,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
