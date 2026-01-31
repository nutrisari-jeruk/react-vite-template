import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable } from "../data-table";

interface TestRow {
  id: string;
  name: string;
  email: string;
}

const testData: TestRow[] = [
  { id: "1", name: "Alice", email: "alice@example.com" },
  { id: "2", name: "Bob", email: "bob@example.com" },
  { id: "3", name: "Charlie", email: "charlie@example.com" },
];

const columns = [
  {
    id: "name",
    header: "Name",
    accessorKey: "name" as keyof TestRow,
    sortable: true,
  },
  {
    id: "email",
    header: "Email",
    accessorKey: "email" as keyof TestRow,
    sortable: true,
  },
];

describe("DataTable", () => {
  const mockOnPaginationChange = vi.fn();
  const mockOnSortingChange = vi.fn();
  const mockOnFilterChange = vi.fn();
  const mockOnRowSelectionChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders table with data", () => {
    render(
      <DataTable
        data={testData}
        columns={columns}
        pagination={false}
        filtering={false}
      />
    );

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("charlie@example.com")).toBeInTheDocument();
  });

  it("shows empty message when no data", () => {
    render(
      <DataTable
        data={[]}
        columns={columns}
        pagination={false}
        filtering={false}
        emptyMessage="No records found"
      />
    );

    expect(screen.getByText("No records found")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    render(
      <DataTable
        data={[]}
        columns={columns}
        isLoading={true}
        pagination={false}
        filtering={false}
      />
    );

    expect(screen.getByText("Loading data...")).toBeInTheDocument();
  });

  it("shows error state", () => {
    render(
      <DataTable
        data={[]}
        columns={columns}
        error="Failed to load data"
        pagination={false}
        filtering={false}
      />
    );

    expect(screen.getByText("Failed to load data")).toBeInTheDocument();
  });

  it("calls onSortingChange when sortable column header is clicked", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        data={testData}
        columns={columns}
        onSortingChange={mockOnSortingChange}
        pagination={false}
        filtering={false}
      />
    );

    await user.click(screen.getByRole("button", { name: /name/i }));

    expect(mockOnSortingChange).toHaveBeenCalledWith({
      columnId: "name",
      direction: "asc",
    });
  });

  it("toggles sort direction on second click", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        data={testData}
        columns={columns}
        sortingState={{ columnId: "name", direction: "asc" }}
        onSortingChange={mockOnSortingChange}
        pagination={false}
        filtering={false}
      />
    );

    await user.click(screen.getByRole("button", { name: /name/i }));

    expect(mockOnSortingChange).toHaveBeenCalledWith({
      columnId: "name",
      direction: "desc",
    });
  });

  it("clears sort on third click", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        data={testData}
        columns={columns}
        sortingState={{ columnId: "name", direction: "desc" }}
        onSortingChange={mockOnSortingChange}
        pagination={false}
        filtering={false}
      />
    );

    await user.click(screen.getByRole("button", { name: /name/i }));

    expect(mockOnSortingChange).toHaveBeenCalledWith({
      columnId: undefined,
      direction: undefined,
    });
  });

  it("calls onFilterChange when filter input changes", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        data={testData}
        columns={columns}
        onFilterChange={mockOnFilterChange}
        pagination={false}
      />
    );

    const filterInput = screen.getByPlaceholderText("Search all columns...");
    await user.type(filterInput, "alice");

    expect(mockOnFilterChange).toHaveBeenCalled();
  });

  it("calls onRowSelectionChange when row checkbox is clicked", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        data={testData}
        columns={columns}
        enableRowSelection={true}
        getRowId={(row) => row.id}
        selectedRows={new Set()}
        onRowSelectionChange={mockOnRowSelectionChange}
        pagination={false}
        filtering={false}
      />
    );

    const rowCheckboxes = screen.getAllByRole("checkbox", {
      name: /select row/i,
    });
    await user.click(rowCheckboxes[0]);

    expect(mockOnRowSelectionChange).toHaveBeenCalledWith(new Set(["1"]));
  });

  it("calls onRowSelectionChange when select all is clicked", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        data={testData}
        columns={columns}
        enableRowSelection={true}
        getRowId={(row) => row.id}
        selectedRows={new Set()}
        onRowSelectionChange={mockOnRowSelectionChange}
        pagination={false}
        filtering={false}
      />
    );

    const selectAllCheckbox = screen.getByRole("checkbox", {
      name: "Select all rows",
    });
    await user.click(selectAllCheckbox);

    expect(mockOnRowSelectionChange).toHaveBeenCalledWith(
      new Set(["1", "2", "3"])
    );
  });

  it("calls onPaginationChange when page size changes", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        data={testData}
        columns={columns}
        paginationState={{ pageIndex: 0, pageSize: 10 }}
        pageCount={1}
        onPaginationChange={mockOnPaginationChange}
        filtering={false}
      />
    );

    const pageSizeSelect = document.getElementById("pageSize");
    expect(pageSizeSelect).toBeInTheDocument();
    await user.selectOptions(pageSizeSelect!, "25");

    expect(mockOnPaginationChange).toHaveBeenCalledWith({
      pageIndex: 0,
      pageSize: 25,
    });
  });

  it("renders empty action button when provided", async () => {
    const mockEmptyAction = vi.fn();
    render(
      <DataTable
        data={[]}
        columns={columns}
        emptyMessage="No data"
        emptyAction={{ label: "Add Item", onClick: mockEmptyAction }}
        pagination={false}
        filtering={false}
      />
    );

    const addButton = screen.getByRole("button", { name: "Add Item" });
    await userEvent.click(addButton);

    expect(mockEmptyAction).toHaveBeenCalled();
  });

  it("renders custom cell content when cell renderer provided", () => {
    const columnsWithCell = [
      ...columns,
      {
        id: "actions",
        header: "Actions",
        cell: (row: TestRow) => (
          <button type="button">{row.name} Action</button>
        ),
        sortable: false,
      },
    ];

    render(
      <DataTable
        data={testData}
        columns={columnsWithCell}
        pagination={false}
        filtering={false}
      />
    );

    expect(
      screen.getByRole("button", { name: "Alice Action" })
    ).toBeInTheDocument();
  });

  describe("pagination page calculation", () => {
    it("renders first five page buttons when pageIndex < 3 and pageCount > 5", async () => {
      const user = userEvent.setup();
      render(
        <DataTable
          data={testData}
          columns={columns}
          paginationState={{ pageIndex: 0, pageSize: 10 }}
          pageCount={10}
          onPaginationChange={mockOnPaginationChange}
          filtering={false}
        />
      );

      expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "5" })).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "3" }));
      expect(mockOnPaginationChange).toHaveBeenCalledWith(
        expect.objectContaining({ pageIndex: 2 })
      );
    });

    it("renders last five page buttons when pageIndex > pageCount - 3", async () => {
      const user = userEvent.setup();
      render(
        <DataTable
          data={testData}
          columns={columns}
          paginationState={{ pageIndex: 8, pageSize: 10 }}
          pageCount={10}
          onPaginationChange={mockOnPaginationChange}
          filtering={false}
        />
      );

      expect(screen.getByRole("button", { name: "6" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "10" })).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "9" }));
      expect(mockOnPaginationChange).toHaveBeenCalledWith(
        expect.objectContaining({ pageIndex: 8 })
      );
    });

    it("renders middle page window when pageIndex in middle", async () => {
      const user = userEvent.setup();
      render(
        <DataTable
          data={testData}
          columns={columns}
          paginationState={{ pageIndex: 5, pageSize: 10 }}
          pageCount={10}
          onPaginationChange={mockOnPaginationChange}
          filtering={false}
        />
      );

      expect(screen.getByRole("button", { name: "5" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "8" })).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "7" }));
      expect(mockOnPaginationChange).toHaveBeenCalledWith(
        expect.objectContaining({ pageIndex: 6 })
      );
    });

    it("calls onPaginationChange when Next button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <DataTable
          data={testData}
          columns={columns}
          paginationState={{ pageIndex: 2, pageSize: 10 }}
          pageCount={10}
          onPaginationChange={mockOnPaginationChange}
          filtering={false}
        />
      );

      const nav = screen.getByRole("navigation", { name: "Pagination" });
      const nextButtons = nav.querySelectorAll("button");
      const nextButton = Array.from(nextButtons).find(
        (el) => el.textContent?.trim() === "Next"
      );
      expect(nextButton).toBeTruthy();
      await user.click(nextButton!);

      expect(mockOnPaginationChange).toHaveBeenCalledWith({
        pageIndex: 3,
        pageSize: 10,
      });
    });

    it("calls onPaginationChange when Previous button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <DataTable
          data={testData}
          columns={columns}
          paginationState={{ pageIndex: 1, pageSize: 10 }}
          pageCount={10}
          onPaginationChange={mockOnPaginationChange}
          filtering={false}
        />
      );

      const nav = screen.getByRole("navigation", { name: "Pagination" });
      const prevButtons = nav.querySelectorAll("button");
      const prevButton = Array.from(prevButtons).find(
        (el) => el.textContent?.trim() === "Previous"
      );
      expect(prevButton).toBeTruthy();
      await user.click(prevButton!);

      expect(mockOnPaginationChange).toHaveBeenCalledWith({
        pageIndex: 0,
        pageSize: 10,
      });
    });
  });
});
