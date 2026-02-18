'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

// Types
interface Category {
  id: string
  name: string
}

interface Supplier {
  id: string
  name: string
}

interface FormErrors {
  sku?: string
  name?: string
  quantity?: string
  reorderLevel?: string
  sellPrice?: string
  costPrice?: string
}

// Mock data
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

export default function NewItemPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    quantity: '',
    reorderLevel: '',
    sellPrice: '',
    costPrice: '',
    categoryId: '',
    supplierId: '',
    location: ''
  })

  // Validation
  const validateForm = () => {
    const newErrors: FormErrors = {}
    
    if (!formData.sku) newErrors.sku = 'SKU is required'
    else if (formData.sku.length < 3) newErrors.sku = 'SKU must be at least 3 characters'
    
    if (!formData.name) newErrors.name = 'Name is required'
    
    if (!formData.quantity) newErrors.quantity = 'Quantity is required'
    else if (Number(formData.quantity) < 0) newErrors.quantity = 'Quantity cannot be negative'
    
    if (!formData.reorderLevel) newErrors.reorderLevel = 'Reorder level is required'
    else if (Number(formData.reorderLevel) < 0) newErrors.reorderLevel = 'Reorder level cannot be negative'
    
    if (!formData.sellPrice) newErrors.sellPrice = 'Selling price is required'
    else if (Number(formData.sellPrice) < 0) newErrors.sellPrice = 'Price cannot be negative'
    
    if (formData.costPrice && Number(formData.costPrice) > Number(formData.sellPrice)) {
      newErrors.costPrice = 'Cost price cannot exceed selling price'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setSaving(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push('/dashboard/items')
      router.refresh()
    } catch (error) {
      console.error('Error creating item:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/items"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to items
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Add new item</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Fill in the information below to create a new inventory item.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
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
                  value={formData.sku}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${
                    errors.sku 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  } px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="e.g., ELEC-001"
                />
                {errors.sku && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.sku}</p>
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
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${
                    errors.name 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  } px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="Enter item name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.name}</p>
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
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Add a description (optional)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category & Supplier */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
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
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select category</option>
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
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select supplier</option>
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
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-base font-medium text-gray-900 dark:text-white">Inventory & pricing</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Quantity */}
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Initial quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  min="0"
                  value={formData.quantity}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${
                    errors.quantity 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  } px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="0"
                />
                {errors.quantity && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.quantity}</p>
                )}
              </div>

              {/* Reorder Level */}
              <div>
                <label htmlFor="reorderLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reorder level <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="reorderLevel"
                  id="reorderLevel"
                  min="0"
                  value={formData.reorderLevel}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${
                    errors.reorderLevel 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  } px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="0"
                />
                {errors.reorderLevel && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.reorderLevel}</p>
                )}
              </div>

              {/* Selling Price */}
              <div>
                <label htmlFor="sellPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Selling price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="sellPrice"
                  id="sellPrice"
                  min="0"
                  step="0.01"
                  value={formData.sellPrice}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${
                    errors.sellPrice 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  } px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="0.00"
                />
                {errors.sellPrice && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.sellPrice}</p>
                )}
              </div>

              {/* Cost Price */}
              <div>
                <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cost price ($)
                </label>
                <input
                  type="number"
                  name="costPrice"
                  id="costPrice"
                  min="0"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${
                    errors.costPrice 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  } px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="0.00"
                />
                {errors.costPrice && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.costPrice}</p>
                )}
              </div>

              {/* Location */}
              <div className="sm:col-span-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Storage location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Creating...' : 'Create item'}
          </button>
        </div>
      </form>
    </div>
  )
}