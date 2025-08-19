"use client"

import React, { useState, useEffect } from 'react'
import { AdminDataTable } from './AdminDataTable'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Download, 
  Trash2, 
  Edit, 
  Archive, 
  Send, 
  Star,
  Eye,
  EyeOff
} from 'lucide-react'
import type { AdminModel, InferFieldValues } from '@/lib/admin/meta'

// Sample data for demonstration
const sampleData = [
  {
    id: '1',
    name: 'Product A',
    category: 'Electronics',
    price: 299.99,
    stock: 150,
    active: true,
    image: 'https://via.placeholder.com/100x100',
    tags: ['new', 'featured'],
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Product B',
    category: 'Clothing',
    price: 49.99,
    stock: 75,
    active: false,
    image: 'https://via.placeholder.com/100x100',
    tags: ['sale'],
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    name: 'Product C',
    category: 'Books',
    price: 19.99,
    stock: 200,
    active: true,
    image: '',
    tags: ['bestseller'],
    createdAt: '2024-01-05'
  },
  {
    id: '4',
    name: 'Product D',
    category: 'Home & Garden',
    price: 89.99,
    stock: 30,
    active: true,
    image: 'https://via.placeholder.com/100x100',
    tags: ['premium'],
    createdAt: '2024-01-20'
  },
  {
    id: '5',
    name: 'Product E',
    category: 'Sports',
    price: 129.99,
    stock: 45,
    active: false,
    image: 'https://via.placeholder.com/100x100',
    tags: ['limited'],
    createdAt: '2024-01-12'
  }
]

// Sample model definition
const sampleModel: AdminModel = {
  name: 'Product',
  fields: {
    name: { type: 'text', label: 'Product Name' },
    category: { type: 'text', label: 'Category' },
    price: { type: 'number', label: 'Price' },
    stock: { type: 'number', label: 'Stock' },
    active: { type: 'boolean', label: 'Active' },
    image: { type: 'image', label: 'Image' },
    tags: { type: 'multi-select', label: 'Tags' },
    createdAt: { type: 'text', label: 'Created At' }
  }
}

export function AdminDataTableDemo() {
  const [data, setData] = useState(sampleData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Bulk action handlers
  const handleBulkDelete = (ids: string[]) => {
    setData(prev => prev.filter(item => !ids.includes(item.id)))
  }

  const handleBulkArchive = (ids: string[]) => {
    setData(prev => prev.map(item => 
      ids.includes(item.id) ? { ...item, active: false } : item
    ))
  }

  const handleBulkActivate = (ids: string[]) => {
    setData(prev => prev.map(item => 
      ids.includes(item.id) ? { ...item, active: true } : item
    ))
  }

  const handleBulkStar = (ids: string[]) => {
    setData(prev => prev.map(item => 
      ids.includes(item.id) ? { ...item, tags: [...item.tags, 'starred'] } : item
    ))
  }

  // Individual action handlers
  const handleEdit = (item: any) => {
    alert(`Editing: ${item.name}`)
  }

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id))
  }

  // Custom export handler
  const handleCustomExport = (data: any[], format: 'csv' | 'json') => {
    if (format === 'csv') {
      // Custom CSV export logic
      const csvContent = data.map(item => 
        `${item.name},${item.category},${item.price},${item.stock}`
      ).join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'custom_export.csv'
      a.click()
    } else {
      // Custom JSON export logic
      const jsonContent = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonContent], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'custom_export.json'
      a.click()
    }
  }

  // Bulk actions configuration
  const bulkActions = [
    {
      label: 'Archive',
      icon: <Archive className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: handleBulkArchive,
      confirmMessage: 'Are you sure you want to archive the selected items?'
    },
    {
      label: 'Activate',
      icon: <Eye className="h-4 w-4" />,
      variant: 'secondary' as const,
      onClick: handleBulkActivate,
      confirmMessage: 'Are you sure you want to activate the selected items?'
    },
    {
      label: 'Star',
      icon: <Star className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: handleBulkStar
    },
    {
      label: 'Send Email',
      icon: <Send className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: (ids: string[]) => {
        alert(`Sending email to ${ids.length} selected items`)
      }
    }
  ]

  // Simulate loading
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Admin Data Table Demo</h1>
        <p className="text-gray-700 dark:text-gray-300">
          This demo shows all the features of the enhanced AdminDataTable component including:
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Search & Filtering</Badge>
          <Badge variant="secondary">Pagination</Badge>
          <Badge variant="outline">Row Selection</Badge>
          <Badge variant="default">Bulk Actions</Badge>
          <Badge variant="secondary">Export (CSV/JSON)</Badge>
          <Badge variant="outline">Column Visibility</Badge>
          <Badge variant="default">Sorting</Badge>
          <Badge variant="secondary">Page Size Control</Badge>
        </div>
      </div>

      {/* Data Table */}
      <AdminDataTable
        model={sampleModel}
        data={data as any}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        loading={loading}
        error={error}
        bulkActions={bulkActions}
        enableExport={true}
        onExport={handleCustomExport}
        showTotalCount={true}
        pageSizeOptions={[5, 10, 25, 50]}
      />

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">🔍 Advanced Search</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">Global search across all fields with real-time filtering</p>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">📊 Bulk Operations</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">Select multiple rows and perform actions like delete, archive, activate</p>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">📤 Export Options</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">Export data as CSV or JSON with custom export handlers</p>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">👁️ Column Control</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">Show/hide columns dynamically to customize the view</p>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">📄 Smart Pagination</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">Configurable page sizes with detailed row count information</p>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">🎨 Responsive Design</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">Mobile-friendly interface with adaptive layouts</p>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">How to Use</h2>
        <div className="space-y-3 text-sm">
          <div>
            <strong>1. Basic Setup:</strong>
            <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs">
{`<AdminDataTable
  model={yourModel}
  data={yourData}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>`}
            </pre>
          </div>
          
          <div>
            <strong>2. With Bulk Actions:</strong>
            <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs">
{`<AdminDataTable
  bulkActions={[
    {
      label: 'Archive',
      icon: <Archive />,
      onClick: handleBulkArchive
    }
  ]}
/>`}
            </pre>
          </div>
          
          <div>
            <strong>3. With Custom Export:</strong>
            <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs">
{`<AdminDataTable
  onExport={(data, format) => {
    // Custom export logic
  }}
/>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
