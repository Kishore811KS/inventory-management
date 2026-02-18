'use client'

import { useEffect, useState } from 'react'
import { FolderOpen, Plus, Edit, Trash2, Search, X, Save, Loader2 } from 'lucide-react'

interface Category {
  id: string
  name: string
  description: string | null
  _count: {
    items: number
  }
}

// Mock data
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    description: 'Electronic devices and components',
    _count: { items: 15 }
  },
  {
    id: '2',
    name: 'Furniture',
    description: 'Office and home furniture',
    _count: { items: 8 }
  },
  {
    id: '3',
    name: 'Office Supplies',
    description: 'General office supplies',
    _count: { items: 25 }
  },
  {
    id: '4',
    name: 'Computer Accessories',
    description: 'Peripherals and accessories',
    _count: { items: 12 }
  }
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))
      setCategories(mockCategories)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  // Open modal for add
  const handleAddClick = () => {
    setModalMode('add')
    setSelectedCategory(null)
    setFormData({ name: '', description: '' })
    setIsModalOpen(true)
  }

  // Open modal for edit
  const handleEditClick = (category: Category) => {
    setModalMode('edit')
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      description: category.description || ''
    })
    setIsModalOpen(true)
  }

  // Handle form input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Save category (add or edit)
  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('Category name is required')
      return
    }

    setSaving(true)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      if (modalMode === 'add') {
        // Create new category
        const newCategory: Category = {
          id: Date.now().toString(), // Generate unique ID
          name: formData.name,
          description: formData.description || null,
          _count: { items: 0 }
        }
        setCategories(prev => [...prev, newCategory])
        alert('Category added successfully!')
      } else {
        // Update existing category
        setCategories(prev =>
          prev.map(cat =>
            cat.id === selectedCategory?.id
              ? {
                  ...cat,
                  name: formData.name,
                  description: formData.description || null
                }
              : cat
          )
        )
        alert('Category updated successfully!')
      }

      // Close modal
      setIsModalOpen(false)
      setSelectedCategory(null)
      setFormData({ name: '', description: '' })
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Failed to save category. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    setDeleteConfirm(id)
  }

  const confirmDelete = async (id: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Remove category
      setCategories(prev => prev.filter(cat => cat.id !== id))
      alert('Category deleted successfully!')
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Failed to delete category. Please try again.')
    } finally {
      setDeleteConfirm(null)
    }
  }

  const cancelDelete = () => {
    setDeleteConfirm(null)
  }

  // Filter categories
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your product categories
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-lg transition-shadow relative"
          >
            {deleteConfirm === category.id ? (
              // Delete confirmation
              <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-95 dark:bg-opacity-95 rounded-lg flex items-center justify-center p-4 z-10">
                <div className="text-center">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    Delete "{category.name}"?
                  </p>
                  <div className="flex space-x-2 justify-center">
                    <button
                      onClick={() => confirmDelete(category.id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      onClick={cancelDelete}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <FolderOpen className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {category._count.items} items
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditClick(category)}
                  className="text-gray-400 hover:text-indigo-600 transition-colors p-1"
                  title="Edit category"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-1"
                  title="Delete category"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {category.description && (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {category.description}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No categories found
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm 
              ? 'Try a different search term.' 
              : 'Get started by creating a new category.'}
          </p>
          {!searchTerm && (
            <button
              onClick={handleAddClick}
              className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {modalMode === 'add' ? 'Add Category' : 'Edit Category'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter category name"
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter category description (optional)"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {modalMode === 'add' ? 'Add Category' : 'Save Changes'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}