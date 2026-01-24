import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "../ui/pagination";

describe("Pagination", () => {
  const handlePageChange = vi.fn();

  beforeEach(() => {
    handlePageChange.mockClear();
  });

  it("renders page numbers", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={handlePageChange}
      />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("calls onPageChange when page number is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={handlePageChange}
      />
    );

    await user.click(screen.getByText("3"));
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it("disables previous button on first page", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={handlePageChange}
      />
    );

    const prevButton = screen.getByLabelText("Go to previous page");
    expect(prevButton).toBeDisabled();
  });

  it("disables next button on last page", () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={handlePageChange}
      />
    );

    const nextButton = screen.getByLabelText("Go to next page");
    expect(nextButton).toBeDisabled();
  });

  it("navigates to next page", async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={handlePageChange}
      />
    );

    await user.click(screen.getByLabelText("Go to next page"));
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it("navigates to previous page", async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={handlePageChange}
      />
    );

    await user.click(screen.getByLabelText("Go to previous page"));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it("shows ellipsis for many pages", () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={20}
        onPageChange={handlePageChange}
      />
    );

    const ellipsis = screen.getAllByText("...");
    expect(ellipsis.length).toBeGreaterThan(0);
  });
});
