'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react'

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
}

interface FormErrors {
  sku?: string
  name?: string
  quantity?: string
  reorderLevel?: string
  sellPrice?: string
  costPrice?: string
}

// Mock data (same as in items page)
const categories: Category[] = [
  { id: '1', name: 'Electronics' },
  { id: '2', name: 'Furniture' },
  { id: '3', name: 'Office Supplies' },
  { id: '4', name: 'Computer Accessories' }
]

const suppliers: Supplier[] = [
  { id: '1', name: 'Tech Supplies Co.' },
  { id: '2', name: 'Office Depot' },
  { id: '3', name: 'Furniture World' }
]

const mockItems: Item[] = [
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
    category: categories[0],
    supplier: suppliers[0],
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
    category: categories[1],
    supplier: suppliers[2],
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
    category: categories[3],
    supplier: suppliers[0],
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
    category: categories[2],
    supplier: suppliers[1],
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
    category: categories[2],
    supplier: suppliers[1],
    location: 'Warehouse C - Shelf 2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export default function EditItemPage() {
  const router = useRouter()
  const params = useParams()
  const itemId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<Partial<Item>>({
    sku: '',
    name: '',
    description: '',
    quantity: 0,
    reorderLevel: 0,
    sellPrice: 0,
    costPrice: 0,
    categoryId: '',
    supplierId: '',
    location: ''
  })

  // Fetch item data
  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        const item = mockItems.find(i => i.id === itemId)
        
        if (item) {
          setFormData({
            sku: item.sku || '',
            name: item.name || '',
            description: item.description || '',
            quantity: item.quantity || 0,
            reorderLevel: item.reorderLevel || 0,
            sellPrice: item.sellPrice || 0,
            costPrice: item.costPrice || 0,
            categoryId: item.categoryId || '',
            supplierId: item.supplierId || '',
            location: item.location || ''
          })
        } else {
          setNotFound(true)
        }
      } catch (error) {
        console.error('Error fetching item:', error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    if (itemId) {
      fetchItem()
    }
  }, [itemId])

  // Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.sku?.trim()) {
      newErrors.sku = 'SKU is required'
    } else if (formData.sku.length < 3) {
      newErrors.sku = 'SKU must be at least 3 characters'
    }
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (formData.quantity === undefined || formData.quantity < 0) {
      newErrors.quantity = 'Quantity must be a positive number'
    }
    
    if (formData.reorderLevel === undefined || formData.reorderLevel < 0) {
      newErrors.reorderLevel = 'Reorder level must be a positive number'
    }
    
    if (formData.sellPrice === undefined || formData.sellPrice < 0) {
      newErrors.sellPrice = 'Selling price must be a positive number'
    }
    
    if (formData.costPrice && formData.sellPrice && formData.costPrice > formData.sellPrice) {
      newErrors.costPrice = 'Cost price cannot exceed selling price'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('[data-error="true"]')
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSaving(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Show success message
      alert('Item updated successfully!')
      
      // Redirect
      router.push('/dashboard/items')
      router.refresh()
      
    } catch (error) {
      console.error('Error updating item:', error)
      alert('Failed to update item. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const parsedValue = type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value
    
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }))

    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading item details...</p>
        </div>
      </div>
    )
  }

  // Not found state
  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Item not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The item you're trying to edit doesn't exist or has been removed.
          </p>
          <Link
            href="/dashboard/items"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Items
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard/items"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to items
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Edit item</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Update the information below to modify this inventory item.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <h2 className="text-base font-medium text-gray-900 dark:text-white">Basic information</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* SKU */}
                <div>
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="sku"
                    id="sku"
                    required
                    value={formData.sku}
                    onChange={handleChange}
                    data-error={errors.sku ? 'true' : undefined}
                    className={`block w-full rounded-lg border ${
                      errors.sku 
                        ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500'
                    } px-3 py-2 text-sm focus:outline-none focus:ring-1 dark:bg-gray-700 dark:text-white transition-colors`}
                    placeholder="Enter SKU"
                  />
                  {errors.sku && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.sku}
                    </p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    data-error={errors.name ? 'true' : undefined}
                    className={`block w-full rounded-lg border ${
                      errors.name 
                        ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500'
                    } px-3 py-2 text-sm focus:outline-none focus:ring-1 dark:bg-gray-700 dark:text-white transition-colors`}
                    placeholder="Enter item name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="Enter item description (optional)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Classification */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <h2 className="text-base font-medium text-gray-900 dark:text-white">Classification</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Category */}
                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    name="categoryId"
                    id="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Supplier */}
                <div>
                  <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Supplier
                  </label>
                  <select
                    name="supplierId"
                    id="supplierId"
                    value={formData.supplierId}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
                  >
                    <option value="">Select a supplier</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory & Pricing */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <h2 className="text-base font-medium text-gray-900 dark:text-white">Inventory & pricing</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Quantity */}
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    id="quantity"
                    required
                    min="0"
                    step="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    data-error={errors.quantity ? 'true' : undefined}
                    className={`block w-full rounded-lg border ${
                      errors.quantity 
                        ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500'
                    } px-3 py-2 text-sm focus:outline-none focus:ring-1 dark:bg-gray-700 dark:text-white transition-colors`}
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.quantity}
                    </p>
                  )}
                </div>

                {/* Reorder Level */}
                <div>
                  <label htmlFor="reorderLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reorder Level <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="reorderLevel"
                    id="reorderLevel"
                    required
                    min="0"
                    step="1"
                    value={formData.reorderLevel}
                    onChange={handleChange}
                    data-error={errors.reorderLevel ? 'true' : undefined}
                    className={`block w-full rounded-lg border ${
                      errors.reorderLevel 
                        ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500'
                    } px-3 py-2 text-sm focus:outline-none focus:ring-1 dark:bg-gray-700 dark:text-white transition-colors`}
                  />
                  {errors.reorderLevel && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.reorderLevel}
                    </p>
                  )}
                </div>

                {/* Selling Price */}
                <div>
                  <label htmlFor="sellPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Selling Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="sellPrice"
                    id="sellPrice"
                    required
                    min="0"
                    step="0.01"
                    value={formData.sellPrice}
                    onChange={handleChange}
                    data-error={errors.sellPrice ? 'true' : undefined}
                    className={`block w-full rounded-lg border ${
                      errors.sellPrice 
                        ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500'
                    } px-3 py-2 text-sm focus:outline-none focus:ring-1 dark:bg-gray-700 dark:text-white transition-colors`}
                  />
                  {errors.sellPrice && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.sellPrice}
                    </p>
                  )}
                </div>

                {/* Cost Price */}
                <div>
                  <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cost Price ($)
                  </label>
                  <input
                    type="number"
                    name="costPrice"
                    id="costPrice"
                    min="0"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={handleChange}
                    data-error={errors.costPrice ? 'true' : undefined}
                    className={`block w-full rounded-lg border ${
                      errors.costPrice 
                        ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500'
                    } px-3 py-2 text-sm focus:outline-none focus:ring-1 dark:bg-gray-700 dark:text-white transition-colors`}
                  />
                  {errors.costPrice && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.costPrice}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="sm:col-span-2">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Storage Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="e.g., Warehouse A, Shelf 12"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <Link
              href="/dashboard/items"
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] justify-center"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}