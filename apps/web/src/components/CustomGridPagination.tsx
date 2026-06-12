"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GridApi } from "ag-grid-community";
import { ChevronLeft, ChevronRight } from "@/lib/premiumIcons";

interface CustomGridPaginationProps {
  gridApi: GridApi | null;
  pageSize: number;
}

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);

  const pages: (number | "ellipsis")[] = [];
  pages.push(0);

  if (current > 2) pages.push("ellipsis");

  const start = Math.max(1, current - 1);
  const end = Math.min(total - 2, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 3) pages.push("ellipsis");

  if (total > 1) pages.push(total - 1);

  return pages;
}

export function CustomGridPagination({ gridApi, pageSize }: CustomGridPaginationProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const apiRef = useRef(gridApi);
  apiRef.current = gridApi;

  const refresh = useCallback(() => {
    const api = apiRef.current;
    if (!api) return;
    setCurrentPage(api.paginationGetCurrentPage());
    setTotalPages(api.paginationGetTotalPages());
    setTotalRows(api.paginationGetRowCount());
  }, []);

  useEffect(() => {
    if (!gridApi) return;
    refresh();
    gridApi.addEventListener("paginationChanged", refresh);
    return () => {
      try { gridApi.removeEventListener("paginationChanged", refresh); } catch {}
    };
  }, [gridApi, refresh]);

  const goToPage = useCallback((page: number) => {
    apiRef.current?.paginationGoToPage(page);
  }, []);

  const goToPrev = useCallback(() => {
    apiRef.current?.paginationGoToPreviousPage();
  }, []);

  const goToNext = useCallback(() => {
    apiRef.current?.paginationGoToNextPage();
  }, []);

  const pageNumbers = useMemo(() => getPageNumbers(currentPage, totalPages), [currentPage, totalPages]);
  const fromRow = totalRows === 0 ? 0 : currentPage * pageSize + 1;
  const toRow = Math.min((currentPage + 1) * pageSize, totalRows);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-card-border px-4 py-3">
      <p className="text-sm text-text-muted hidden sm:block">
        {fromRow}
        <span className="mx-1">&ndash;</span>
        {toRow}
        <span className="mx-1">of</span>
        {totalRows}
      </p>

      <nav className="flex items-center gap-1 mx-auto sm:mx-0 sm:flex-1 sm:justify-center" aria-label="Pagination">
        <button
          type="button"
          onClick={goToPrev}
          disabled={currentPage === 0}
          className="relative inline-flex items-center rounded-lg px-2.5 py-2 text-text-secondary ring-1 ring-inset ring-card-border hover:bg-company-primary-subtle hover:text-company-primary focus:z-20 focus:outline-offset-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-text-secondary transition-colors"
        >
          <span className="sr-only">Previous</span>
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="hidden sm:flex items-center gap-0.5">
          {pageNumbers.map((page, idx) =>
            page === "ellipsis" ? (
              <span
                key={`ellipsis-${idx}`}
                className="relative inline-flex items-center px-3 py-2 text-sm font-semibold text-text-muted"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                className={`relative inline-flex items-center px-3.5 py-2 text-sm font-semibold transition-colors rounded-lg ${
                  page === currentPage
                    ? "z-10 bg-company-primary text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-company-primary"
                    : "text-text-secondary ring-1 ring-inset ring-card-border hover:bg-company-primary-subtle hover:text-company-primary focus:z-20 focus:outline-offset-0"
                }`}
              >
                {page + 1}
              </button>
            )
          )}
        </div>

        <span className="sm:hidden text-sm font-medium text-text-secondary">
          {currentPage + 1}
          <span className="mx-1 text-text-muted">/</span>
          {totalPages}
        </span>

        <button
          type="button"
          onClick={goToNext}
          disabled={currentPage === totalPages - 1}
          className="relative inline-flex items-center rounded-lg px-2.5 py-2 text-text-secondary ring-1 ring-inset ring-card-border hover:bg-company-primary-subtle hover:text-company-primary focus:z-20 focus:outline-offset-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-text-secondary transition-colors"
        >
          <span className="sr-only">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </nav>

      <p className="text-sm text-text-muted sm:hidden">
        {fromRow}&ndash;{toRow}
        <span className="mx-1">of</span>
        {totalRows}
      </p>

      <div className="hidden sm:block w-[120px]" />
    </div>
  );
}
