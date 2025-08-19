"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { 
  ChevronDown, 
  MoreHorizontal, 
  Search, 
  Download, 
  Trash2, 
  Edit,
  Filter,
  Eye,
  EyeOff
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import type { AdminModel, InferFieldValues } from "@/lib/admin/meta"

// ----------------------------------
// Types
// ----------------------------------

type RowData<T extends AdminModel> = InferFieldValues<T> & { id: string }

interface ServerModeCallbacks {
  /** مجموع ردیف‌ها در دیتابیس (برای محاسبه pageCount) */
  totalCount: number
  /** فراخوانی هنگام تغییر state جدول برای fetch دادهٔ جدید از بک‌اند */
  onQueryChange: (params: {
    pageIndex: number
    pageSize: number
    sorting: SortingState
    filters: ColumnFiltersState
    globalFilter: string
  }) => void
}

interface BulkAction {
  label: string
  icon: React.ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  onClick: (selectedIds: string[]) => void
  confirmMessage?: string
}

interface AdminDataTableProps<T extends AdminModel> {
  model: T
  data: RowData<T>[]
  onEdit?: (item: RowData<T>) => void
  onDelete?: (id: string) => void
  onBulkDelete?: (ids: string[]) => void
  loading?: boolean
  error?: string | null
  /** فعال‌سازی حالت سرور برای pagination، sorting و filtering */
  serverMode?: ServerModeCallbacks
  /** عملیات‌های bulk برای ردیف‌های انتخاب شده */
  bulkActions?: BulkAction[]
  /** فعال‌سازی export */
  enableExport?: boolean
  /** تابع export سفارشی */
  onExport?: (data: RowData<T>[], format: 'csv' | 'json') => void
  /** نمایش تعداد کل ردیف‌ها */
  showTotalCount?: boolean
  /** اندازه‌های صفحه پیشنهادی */
  pageSizeOptions?: number[]
}

// ----------------------------------
// Utility functions
// ----------------------------------

function exportToCSV<T extends AdminModel>(data: RowData<T>[], model: T): void {
  const fieldKeys = Object.keys(model.fields) as (keyof InferFieldValues<T> & string)[]
  const headers = fieldKeys.map(key => model.fields[key].label)
  
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      fieldKeys.map(key => {
        const value = row[key]
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`
        }
        return value ?? ''
      }).join(',')
    )
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${model.name}_export.csv`
  link.click()
}

function exportToJSON<T extends AdminModel>(data: RowData<T>[]): void {
  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'export.json'
  link.click()
}

// ----------------------------------
// Build dynamic column defs
// ----------------------------------
function buildColumns<T extends AdminModel>(
  model: T,
  onEdit?: (item: RowData<T>) => void,
  onDelete?: (id: string) => void,
): ColumnDef<RowData<T>>[] {
  const fieldKeys = Object.keys(model.fields) as (keyof InferFieldValues<T> & string)[]
  const columns: ColumnDef<RowData<T>>[] = []

  // ➡️ Row selection column
  columns.push({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all rows"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 32,
  })

  // ➡️ Data columns generated from model.fields
  fieldKeys.forEach((key) => {
    const field = model.fields[key]
    columns.push({
      accessorKey: key,
      header: field.label,
      size: 180,
      cell: ({ row }) => {
        const value = row.getValue(key) as unknown
        if (field.type === "image" && typeof value === "string" && value.trim() !== "") {
          return <img src={value} alt="thumbnail" className="h-10 rounded border object-cover" />
        }
        if (field.type === "image") {
          return <span className="text-gray-600 dark:text-gray-400 italic">No Image</span>
        }
        if (Array.isArray(value)) {
          return <span>{(value as unknown[]).join(", ")}</span>
        }
        if (typeof value === "boolean") {
          return (
            <span
              className={
                value
                  ? "rounded bg-green-100 px-2 py-0.5 text-green-700"
                  : "rounded bg-red-100 px-2 py-0.5 text-red-700"
              }
            >
              {value ? "Yes" : "No"}
            </span>
          )
        }
        return <span>{String(value ?? "")}</span>
      },
    })
  })

  // ➡️ Row actions column
  if (onEdit || onDelete) {
    columns.push({
      id: "actions",
      enableHiding: false,
      size: 80,
      cell: ({ row }) => {
        const item = row.original as RowData<T>
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {onEdit && <DropdownMenuItem onClick={() => onEdit(item)}>Edit</DropdownMenuItem>}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      if (typeof window !== "undefined" && window.confirm("Are you sure you want to delete this item?")) {
                        onDelete(item.id)
                      }
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    })
  }

  return columns
}

// ----------------------------------
// Component
// ----------------------------------
export function AdminDataTable<T extends AdminModel>({
  model,
  data,
  onEdit,
  onDelete,
  onBulkDelete,
  loading,
  error,
  serverMode,
  bulkActions = [],
  enableExport = true,
  onExport,
  showTotalCount = true,
  pageSizeOptions = [10, 20, 50, 100],
}: AdminDataTableProps<T>) {
  // ─── State
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState<string>("")
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 })

  // Columns memoized
  const columns = React.useMemo(() => buildColumns(model, onEdit, onDelete), [model, onEdit, onDelete])

  // ─── Table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: !!serverMode,
    pageCount: serverMode ? Math.ceil(serverMode.totalCount / pagination.pageSize) : undefined,
  })

  // Server‑side fetch trigger
  React.useEffect(() => {
    if (!serverMode) return
    serverMode.onQueryChange({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sorting,
      filters: columnFilters,
      globalFilter,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex, pagination.pageSize, sorting, columnFilters, globalFilter])

  // ─── Computed values
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows.map(row => row.original.id)
  const hasSelection = selectedIds.length > 0

  // ─── Handlers
  const handleBulkAction = (action: BulkAction) => {
    if (action.confirmMessage) {
      const confirmed = window.confirm(action.confirmMessage)
      if (!confirmed) return
    }
    action.onClick(selectedIds)
    // Clear selection after action
    table.toggleAllPageRowsSelected(false)
  }

  const handleExport = (format: 'csv' | 'json') => {
    if (onExport) {
      onExport(data, format)
    } else {
      if (format === 'csv') {
        exportToCSV(data, model)
      } else {
        exportToJSON(data)
      }
    }
  }

  // ─── Loading / Error / Empty states
  if (loading) {
    return <div className="flex items-center justify-center p-10 text-blue-600 dark:text-blue-400">Loading...</div>
  }
  if (error) {
    return <div className="flex items-center justify-center p-10 text-red-600 dark:text-red-400">{error}</div>
  }
  if (!data.length && !loading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-gray-700 dark:text-gray-300">
        <span className="mb-2 text-4xl">📦</span>
        <span>No items found.</span>
      </div>
    )
  }

  // ─── Render
  return (
    <div className="w-full space-y-4">
      {/* Enhanced Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        {/* Search and Filters */}
        <div className="flex-1 flex flex-col sm:flex-row gap-2 min-w-0">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 dark:text-gray-400" />
            <Input
              placeholder="جستجو در تمام فیلدها..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                ستون‌ها
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((c) => c.getCanHide())
                .map((c) => (
                  <DropdownMenuCheckboxItem
                    key={c.id}
                    checked={c.getIsVisible()}
                    onCheckedChange={(v) => c.toggleVisibility(!!v)}
                    className="capitalize"
                  >
                    {c.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Export */}
          {enableExport && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('json')}>
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Page Size Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">نمایش:</span>
            <Select
              value={pagination.pageSize.toString()}
              onValueChange={(value: string) => {
                setPagination(prev => ({ ...prev, pageSize: Number(value), pageIndex: 0 }))
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {hasSelection && (
        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {selectedIds.length} ردیف انتخاب شده
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.toggleAllPageRowsSelected(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              لغو انتخاب
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {bulkActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "outline"}
                size="sm"
                onClick={() => handleBulkAction(action)}
                className="flex items-center gap-2"
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
            
            {/* Default bulk delete if onBulkDelete is provided */}
            {onBulkDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (window.confirm(`آیا از حذف ${selectedIds.length} آیتم انتخاب شده اطمینان دارید؟`)) {
                    onBulkDelete(selectedIds)
                    table.toggleAllPageRowsSelected(false)
                  }
                }}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                حذف انتخاب شده‌ها
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="capitalize">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Enhanced Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          {hasSelection && (
            <span className="font-medium">
              {selectedIds.length} از {table.getFilteredRowModel().rows.length} ردیف انتخاب شده
            </span>
          )}
          {showTotalCount && (
            <span>
              نمایش {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} تا{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                serverMode?.totalCount || table.getFilteredRowModel().rows.length
              )}{' '}
              از {serverMode?.totalCount || table.getFilteredRowModel().rows.length} ردیف
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
            « اول
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            قبلی
          </Button>
          <span className="text-sm px-3 py-2 bg-white dark:bg-gray-700 rounded border">
            صفحه {pagination.pageIndex + 1} از {table.getPageCount() || 1}
          </span>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            بعدی
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
            آخر »
          </Button>
        </div>
      </div>
    </div>
  )
}
