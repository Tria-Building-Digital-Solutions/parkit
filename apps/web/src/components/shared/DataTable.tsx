"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "@/app/ag-grid-parkit-overrides.css";
import { CustomGridPagination } from "@/components/CustomGridPagination";

ModuleRegistry.registerModules([AllCommunityModule]);

export interface DataTableColumn<T = any> {
  header: string;
  field?: keyof T | string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  flex?: number;
  sortable?: boolean;
  filter?: boolean | string;
  resizable?: boolean;
  editable?: boolean | ((params: any) => boolean);
  cellRenderer?: (params: ICellRendererParams<T>) => React.ReactNode;
  valueGetter?: (params: any) => any;
  valueSetter?: (params: any) => any;
  cellEditor?: string | 'agTextCellEditor' | 'agSelectCellEditor';
  cellEditorParams?: any;
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  onEdit?: (row: T, field: string, value: any) => void;
  onDelete?: (row: T) => void;
  onCreate?: () => void;
  pagination?: boolean;
  pageSize?: number;
  height?: string | number;
  className?: string;
  actions?: {
    edit?: boolean;
    delete?: boolean;
    view?: boolean;
  };
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  onRowClick,
  onEdit,
  onDelete,
  onCreate,
  pagination = true,
  pageSize = 50,
  height = '600px',
  className = '',
  actions = { edit: true, delete: true, view: true },
}: DataTableProps<T>) {
  const { theme } = useTheme();
  const [gridApi, setGridApi] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty('--data-table-height', String(height));
    }
  }, [height]);

  const actionColumn: DataTableColumn<T> = useMemo(() => ({
    header: 'Actions',
    width: 120,
    minWidth: 120,
    maxWidth: 120,
    sortable: false,
    filter: false,
    resizable: false,
    cellRenderer: (params: ICellRendererParams<T>) => (
      <div className="flex gap-2 items-center justify-center">
        {actions.view && (
          <button
            onClick={() => params.data && onRowClick?.(params.data)}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="View"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        )}
        {actions.edit && (
          <button
            onClick={() => params.data && onEdit?.(params.data, 'id', params.data.id)}
            className="text-green-600 hover:text-green-800 p-1"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
        {actions.delete && (
          <button
            onClick={() => params.data && onDelete?.(params.data)}
            className="text-red-600 hover:text-red-800 p-1"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    ),
  }), [actions.view, actions.edit, actions.delete, onRowClick, onEdit, onDelete]);

  const processedColumns: ColDef[] = useMemo(() => {
    const cols = columns.map((col): ColDef => ({
      headerName: col.header,
      field: col.field as string,
      width: col.width,
      minWidth: col.minWidth,
      maxWidth: col.maxWidth,
      flex: col.flex,
      sortable: col.sortable !== false,
      filter: col.filter !== false,
      resizable: col.resizable !== false,
      editable: col.editable,
      cellRenderer: col.cellRenderer,
      valueGetter: col.valueGetter,
      valueSetter: col.valueSetter,
      cellEditor: col.cellEditor,
      cellEditorParams: col.cellEditorParams,
    }));

    // Add action column if any actions are enabled
    if (Object.values(actions).some(Boolean)) {
      cols.push(actionColumn as ColDef);
    }

    return cols;
  }, [columns, actionColumn, actions]);

  const onGridReady = useCallback((params: any) => {
    setGridApi(params.api);
  }, []);

  const onFirstDataRendered = useCallback(() => {
    if (gridApi && pagination) {
      gridApi.sizeColumnsToFit();
    }
  }, [gridApi, pagination]);

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 100,
    flex: 1,
  }), []);

  const gridTheme = theme === 'dark' ? 'ag-theme-quartz-dark' : 'ag-theme-quartz';

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      {onCreate && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={onCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New
          </button>
        </div>
      )}

      <div
        className={`data-table-container ${gridTheme} rounded-lg border ${loading ? 'opacity-50' : ''}`}
      >
        <AgGridReact
          rowData={data}
          columnDefs={processedColumns}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          onFirstDataRendered={onFirstDataRendered}
          pagination={pagination}
          paginationPageSize={pageSize}
          suppressPaginationPanel={true}
          domLayout="normal"
          animateRows={true}
          loading={loading}
          enableRangeSelection={false}
          enableRangeHandle={false}
          suppressDragLeaveHidesColumns={true}
          suppressColumnVirtualisation={false}
          suppressRowVirtualisation={false}
          suppressCellFocus={false}
          suppressContextMenu={false}
          rowSelection="single"
        />
        {pagination && <CustomGridPagination gridApi={gridApi} pageSize={pageSize} />}
      </div>
    </div>
  );
}
