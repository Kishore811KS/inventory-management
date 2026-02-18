'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, Package, DollarSign, AlertCircle, MapPin, Tag, Building } from 'lucide-react'

interface Category {
  id: string
  name: string
}

interface Supplier {
  id: string
  name: string
}

interface Item {
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
  isLowStock: boolean
}

const mockItems: Item[] = [
  {
    id: '1',
    sku: 'SKU001',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM and 512GB SSD',
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
    updatedAt: new Date().toISOString(),
    isLowStock: false
  },
  {
    id: '2',
    sku: 'SKU002',
    name: 'Office Chair',
    description: 'Ergonomic office chair with lumbar support',
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
    updatedAt: new Date().toISOString(),
    isLowStock: true
  },
  {
    id: '3',
    sku: 'SKU003',
    name: 'Wireless Mouse',
    description: 'Bluetooth wireless mouse with long battery life',
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
    updatedAt: new Date().toISOString(),
    isLowStock: true
  }
]

export default function ItemDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItem = async () => {
      await new Promise(resolve => setTimeout(resolve, 300))
      const found = mockItems.find(i => i.id === params.id)
      if (found) {
        setItem(found)
      }
      setLoading(false)
    }
    fetchItem()
  }, [params.id])

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        alert('Item deleted successfully!')
        router.push('/dashboard/items')
        router.refresh()
      } catch (error) {
        console.error('Error deleting item:', error)
        alert('Failed to delete item. Please try again.')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Item not found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">The item you're looking for doesn't exist or has been removed.</p>
        <Link
          href="/dashboard/items"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Return to Items
        </Link>
      </div>
    )
  }

  const isLowStock = item.quantity <= item.reorderLevel

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/items"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Items
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Item Details</h1>
        </div>
        <div className="flex space-x-3">
          <Link
            href={`/dashboard/items/${item.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {isLowStock && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-300">
                <span className="font-medium">Low Stock Alert!</span> Current quantity ({item.quantity}) is below reorder level ({item.reorderLevel}).
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-900">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
              <Package className="h-5 w-5 mr-2 text-gray-500" />
              Basic Information
            </h3>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <dl>
              <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">SKU</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 font-mono">
                  {item.sku}
                </dd>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {item.name}
                </dd>
              </div>
              <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {item.description || 'No description provided'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-900">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-gray-500" />
              Inventory & Pricing
            </h3>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <dl>
              <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Quantity</dt>
                <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                  <span className={`font-semibold ${isLowStock ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                    {item.quantity}
                  </span>
                  {isLowStock && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      Low Stock
                    </span>
                  )}
                </dd>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Reorder Level</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {item.reorderLevel}
                </dd>
              </div>
              <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Selling Price</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  <span className="font-semibold">${item.sellPrice.toFixed(2)}</span>
                </dd>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Cost Price</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  ${item.costPrice?.toFixed(2) || '0.00'}
                </dd>
              </div>
              <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Profit Margin</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {item.costPrice ? (((item.sellPrice - item.costPrice) / item.sellPrice) * 100).toFixed(1) : '0'}%
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-900">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
              <Tag className="h-5 w-5 mr-2 text-gray-500" />
              Category & Supplier
            </h3>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <dl>
              <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {item.category?.name || 'Uncategorized'}
                </dd>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Supplier</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {item.supplier?.name || 'No supplier assigned'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-900">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-gray-500" />
              Storage Location
            </h3>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <dl>
              <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {item.location || 'No location specified'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg lg:col-span-2">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-900">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
              <Building className="h-5 w-5 mr-2 text-gray-500" />
              System Information
            </h3>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <dl>
              <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}
                </dd>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : 'N/A'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}