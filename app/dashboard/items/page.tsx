'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Search, Download, Upload, AlertCircle, Edit, Trash2, Eye } from 'lucide-react'

// Define proper interfaces
interface Category {
  id: string
  name: string
}

interface Supplier {
  id: string
  name: string
}

interface MockItem {
  id: string
  sku: string
  name: string
  description?: string
  quantity: number
  reorderLevel: number
  sellPrice: number
  costPrice?: number
  categoryId?: string
  supplierId?: string
  category?: Category
  supplier?: Supplier
  location?: string
  createdAt?: string
  updatedAt?: string
}

interface Item extends MockItem {
  isLowStock: boolean
}

// Mock data with more complete information
const mockItems: MockItem[] = [
  {
    id: '1',
    sku: 'SKU001',
    name: 'Laptop',
    description: 'High-performance laptop',
    quantity: 15,
    reorderLevel: 5,
    sellPrice: 999.99,
    costPrice: 750.00,
    categoryId: '1',
    supplierId: '1',
    category: { id: '1', name: 'Electronics' },
    supplier: { id: '1', name: 'Tech Supplies Co.' },
    location: 'Warehouse A - Shelf 1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    sku: 'SKU002',
    name: 'Office Chair',
    description: 'Ergonomic office chair',
    quantity: 8,
    reorderLevel: 10,
    sellPrice: 249.99,
    costPrice: 150.00,
    categoryId: '2',
    supplierId: '3',
    category: { id: '2', name: 'Furniture' },
    supplier: { id: '3', name: 'Furniture World' },
    location: 'Warehouse B - Shelf 3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    sku: 'SKU003',
    name: 'Wireless Mouse',
    description: 'Bluetooth wireless mouse',
    quantity: 3,
    reorderLevel: 10,
    sellPrice: 29.99,
    costPrice: 15.00,
    categoryId: '4',
    supplierId: '1',
    category: { id: '4', name: 'Computer Accessories' },
    supplier: { id: '1', name: 'Tech Supplies Co.' },
    location: 'Warehouse A - Shelf 2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    sku: 'SKU004',
    name: 'Desk Lamp',
    description: 'LED desk lamp with adjustable brightness',
    quantity: 25,
    reorderLevel: 8,
    sellPrice: 45.99,
    costPrice: 25.00,
    categoryId: '3',
    supplierId: '2',
    category: { id: '3', name: 'Office Supplies' },
    supplier: { id: '2', name: 'Office Depot' },
    location: 'Warehouse C - Shelf 1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    sku: 'SKU005',
    name: 'Notebook',
    description: 'Hardcover notebook, 200 pages',
    quantity: 50,
    reorderLevel: 20,
    sellPrice: 12.99,
    costPrice: 6.50,
    categoryId: '3',
    supplierId: '2',
    category: { id: '3', name: 'Office Supplies' },
    supplier: { id: '2', name: 'Office Depot' },
    location: 'Warehouse C - Shelf 2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export default function ItemsPage() {
  const router = useRouter()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchItems()
  }, [search, page])

  const fetchItems = async () => {
    setLoading(true)
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))
      
      // Filter items by search term
      const filtered = mockItems.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.sku.toLowerCase().includes(search.toLowerCase())
      ).map(item => ({
        ...item,
        isLowStock: item.quantity <= item.reorderLevel
      }))
      
      // Paginate
      const startIndex = (page - 1) * 10
      const endIndex = startIndex + 10
      const paginatedItems = filtered.slice(startIndex, endIndex)
      
      setItems(paginatedItems)
      setTotalPages(Math.ceil(filtered.length / 10))
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      // Create CSV content
      const headers = ['SKU', 'Name', 'Category', 'Quantity', 'Price', 'Location']
      const csvContent = [
        headers.join(','),
        ...items.map(item => 
          [item.sku, item.name, item.category?.name || '', item.quantity, item.sellPrice, item.location || ''].join(',')
        )
      ].join('\n')
      
      // Download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `items-export-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting items:', error)
      alert('Failed to export items. Please try again.')
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const csv = event.target?.result as string
        const lines = csv.split('\n')
        const headers = lines[0].split(',')
        
        // Parse CSV and create items
        const importedItems = lines.slice(1).filter(line => line.trim()).map(line => {
          const values = line.split(',')
          const item: any = {}
          headers.forEach((header, index) => {
            item[header.toLowerCase()] = values[index]
          })
          return item
        })
        
        alert(`Successfully imported ${importedItems.length} items. In production, these would be saved to the database.`)
        fetchItems() // Refresh the list
      }
      reader.readAsText(file)
    } catch (error: any) {
      alert(`Import failed: ${error.message}`)
    } finally {
      // Clear the input
      e.target.value = ''
    }
  }

  const handleDelete = async (id: string, itemName: string) => {
    if (confirm(`Are you sure you want to delete "${itemName}"?`)) {
      try {
        // Mock delete - in production, this would call an API
        // For now, just show success message and refresh
        alert(`Item "${itemName}" deleted successfully.`)
        // Refresh the list (in production, this would fetch from API after delete)
        fetchItems()
      } catch (error) {
        console.error('Error deleting item:', error)
        alert('Failed to delete item. Please try again.')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Items</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <label className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Import
            <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleImport} />
          </label>
          <Link
            href="/dashboard/items/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Link>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-10 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading...</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No items found. Click "Add Item" to create your first item.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className={item.isLowStock ? 'bg-red-50 dark:bg-red-900/20' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {item.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        {item.name}
                        {item.isLowStock && (
                          <AlertCircle className="ml-2 h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.category?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${item.sellPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link
                          href={`/dashboard/items/${item.id}`}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 inline-flex items-center"
                          title="View"
                        >
                          <Eye className="h-5 w-5" />
                        </Link>
                        <Link
                          href={`/dashboard/items/${item.id}/edit`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center"
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 inline-flex items-center"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}