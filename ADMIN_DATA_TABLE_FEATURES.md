# AdminDataTable - Enhanced Features Documentation

## Overview
The `AdminDataTable` component has been significantly enhanced with enterprise-level features for data management, including search, pagination, bulk operations, export functionality, and more.

## ✨ New Features Added

### 1. 🔍 Enhanced Search & Filtering
- **Global Search**: Search across all fields with real-time filtering
- **Column Visibility**: Toggle columns on/off dynamically
- **Advanced Filtering**: Support for column-specific filters

### 2. 📊 Bulk Operations
- **Row Selection**: Checkbox-based row selection with select all functionality
- **Bulk Actions**: Perform operations on multiple selected rows
- **Custom Actions**: Define custom bulk actions with icons and confirmation messages
- **Bulk Delete**: Built-in bulk delete with confirmation

### 3. 📤 Export Functionality
- **CSV Export**: Export data as CSV with proper formatting
- **JSON Export**: Export data as JSON for API consumption
- **Custom Export**: Implement custom export logic
- **Automatic Download**: Files are automatically downloaded with descriptive names

### 4. 📄 Smart Pagination
- **Page Size Control**: Configurable page sizes (10, 20, 50, 100 by default)
- **Navigation**: First, previous, next, last page buttons
- **Row Count Display**: Shows current page range and total count
- **Server-Side Support**: Built-in support for server-side pagination

### 5. 🎨 Enhanced UI/UX
- **Responsive Design**: Mobile-friendly interface
- **Theme Support**: Works with both light and dark themes
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages
- **Empty States**: Informative empty state messages

## 🚀 Usage Examples

### Basic Usage
```tsx
<AdminDataTable
  model={yourModel}
  data={yourData}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

### With Bulk Actions
```tsx
const bulkActions = [
  {
    label: 'Archive',
    icon: <Archive className="h-4 w-4" />,
    variant: 'outline',
    onClick: handleBulkArchive,
    confirmMessage: 'Are you sure?'
  },
  {
    label: 'Activate',
    icon: <Eye className="h-4 w-4" />,
    variant: 'secondary',
    onClick: handleBulkActivate
  }
];

<AdminDataTable
  model={yourModel}
  data={yourData}
  bulkActions={bulkActions}
  onBulkDelete={handleBulkDelete}
/>
```

### With Custom Export
```tsx
<AdminDataTable
  model={yourModel}
  data={yourData}
  enableExport={true}
  onExport={(data, format) => {
    if (format === 'csv') {
      // Custom CSV export logic
    } else {
      // Custom JSON export logic
    }
  }}
/>
```

### With Server-Side Pagination
```tsx
<AdminDataTable
  model={yourModel}
  data={yourData}
  serverMode={{
    totalCount: 1000,
    onQueryChange: ({ pageIndex, pageSize, sorting, filters, globalFilter }) => {
      // Fetch data from server
      fetchData({ pageIndex, pageSize, sorting, filters, globalFilter });
    }
  }}
/>
```

## 🔧 Configuration Options

### Props Interface
```tsx
interface AdminDataTableProps<T extends AdminModel> {
  model: T                                    // Admin model definition
  data: RowData<T>[]                         // Data to display
  onEdit?: (item: RowData<T>) => void       // Edit handler
  onDelete?: (id: string) => void           // Delete handler
  onBulkDelete?: (ids: string[]) => void    // Bulk delete handler
  loading?: boolean                          // Loading state
  error?: string | null                     // Error message
  serverMode?: ServerModeCallbacks          // Server-side mode
  bulkActions?: BulkAction[]                // Custom bulk actions
  enableExport?: boolean                    // Enable export functionality
  onExport?: (data: RowData<T>[], format: 'csv' | 'json') => void
  showTotalCount?: boolean                  // Show total row count
  pageSizeOptions?: number[]                // Available page sizes
}
```

### Bulk Action Interface
```tsx
interface BulkAction {
  label: string                              // Action label
  icon: React.ReactNode                      // Action icon
  variant?: Button variant                   // Button style variant
  onClick: (selectedIds: string[]) => void  // Action handler
  confirmMessage?: string                    // Confirmation message
}
```

## 🎯 Key Benefits

1. **Productivity**: Bulk operations save time when managing large datasets
2. **User Experience**: Intuitive interface with clear visual feedback
3. **Flexibility**: Customizable actions and export options
4. **Performance**: Efficient pagination and filtering
5. **Accessibility**: Proper ARIA labels and keyboard navigation
6. **Responsiveness**: Works seamlessly on all device sizes

## 🔄 Migration Guide

### From Old Version
The enhanced version is fully backward compatible. Existing implementations will continue to work without changes.

### Adding New Features
Simply add the new props to enable additional functionality:

```tsx
// Old version
<AdminDataTable model={model} data={data} />

// Enhanced version with new features
<AdminDataTable
  model={model}
  data={data}
  bulkActions={bulkActions}
  enableExport={true}
  showTotalCount={true}
/>
```

## 🧪 Testing

The component includes comprehensive error handling and loading states. Test scenarios include:

- Empty data sets
- Loading states
- Error conditions
- Large datasets
- Mobile responsiveness
- Theme switching
- Bulk operations
- Export functionality

## 🚧 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires JavaScript enabled
- CSS Grid and Flexbox support

## 📝 Notes

- The component automatically handles data type rendering (images, booleans, arrays)
- Row selection state is managed internally
- Export functions work in browser environments
- All icons are from Lucide React
- Styling uses Tailwind CSS with theme support
