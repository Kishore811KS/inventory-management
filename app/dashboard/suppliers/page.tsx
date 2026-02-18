'use client'

import { useEffect, useState } from 'react'
import { Truck, Plus, Edit, Trash2, Search, Mail, Phone, X, Save, Loader2, MapPin } from 'lucide-react'

interface Supplier {
  id: string
  name: string
  contactPerson: string | null
  email: string | null
  phone: string | null
  address: string | null
  _count: {
    items: number
  }
}

// Mock data
const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Tech Supplies Co.',
    contactPerson: 'John Smith',
    email: 'john@techsupplies.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street, Silicon Valley, CA 94025',
    _count: { items: 15 }
  },
  {
    id: '2',
    name: 'Office Depot',
    contactPerson: 'Sarah Johnson',
    email: 'sarah@officedepot.com',
    phone: '+1 (555) 234-5678',
    address: '456 Business Ave, Dallas, TX 75201',
    _count: { items: 8 }
  },
  {
    id: '3',
    name: 'Furniture World',
    contactPerson: 'Mike Wilson',
    email: 'mike@furnitureworld.com',
    phone: '+1 (555) 345-6789',
    address: '789 Design Blvd, Chicago, IL 60601',
    _count: { items: 12 }
  }
]

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: ''
  })
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))
      setSuppliers(mockSuppliers)
    } catch (error) {
      console.error('Error fetching suppliers:', error)
    } finally {
      setLoading(false)
    }
  }

  // Open modal for add
  const handleAddClick = () => {
    setModalMode('add')
    setSelectedSupplier(null)
    setFormData({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: ''
    })
    setIsModalOpen(true)
  }

  // Open modal for edit
  const handleEditClick = (supplier: Supplier) => {
    setModalMode('edit')
    setSelectedSupplier(supplier)
    setFormData({
      name: supplier.name,
      contactPerson: supplier.contactPerson || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || ''
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

  // Validate form
  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      alert('Supplier name is required')
      return false
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Please enter a valid email address')
      return false
    }
    return true
  }

  // Save supplier (add or edit)
  const handleSave = async () => {
    if (!validateForm()) return

    setSaving(true)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      if (modalMode === 'add') {
        // Create new supplier
        const newSupplier: Supplier = {
          id: Date.now().toString(), // Generate unique ID
          name: formData.name,
          contactPerson: formData.contactPerson || null,
          email: formData.email || null,
          phone: formData.phone || null,
          address: formData.address || null,
          _count: { items: 0 }
        }
        setSuppliers(prev => [...prev, newSupplier])
        alert('Supplier added successfully!')
      } else {
        // Update existing supplier
        setSuppliers(prev =>
          prev.map(sup =>
            sup.id === selectedSupplier?.id
              ? {
                  ...sup,
                  name: formData.name,
                  contactPerson: formData.contactPerson || null,
                  email: formData.email || null,
                  phone: formData.phone || null,
                  address: formData.address || null
                }
              : sup
          )
        )
        alert('Supplier updated successfully!')
      }

      // Close modal
      setIsModalOpen(false)
      setSelectedSupplier(null)
      setFormData({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: ''
      })
    } catch (error) {
      console.error('Error saving supplier:', error)
      alert('Failed to save supplier. Please try again.')
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

      // Remove supplier
      setSuppliers(prev => prev.filter(sup => sup.id !== id))
      alert('Supplier deleted successfully!')
    } catch (error) {
      console.error('Error deleting supplier:', error)
      alert('Failed to delete supplier. Please try again.')
    } finally {
      setDeleteConfirm(null)
    }
  }

  const cancelDelete = () => {
    setDeleteConfirm(null)
  }

  // Filter suppliers
  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading suppliers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Suppliers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your suppliers and vendor information
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Supplier
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search suppliers by name, contact, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filteredSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-lg transition-shadow relative"
          >
            {deleteConfirm === supplier.id ? (
              // Delete confirmation
              <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-95 dark:bg-opacity-95 rounded-lg flex items-center justify-center p-4 z-10">
                <div className="text-center">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    Delete supplier "{supplier.name}"?
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    This will not delete the items supplied by them.
                  </p>
                  <div className="flex space-x-2 justify-center">
                    <button
                      onClick={() => confirmDelete(supplier.id)}
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

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Truck className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {supplier.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {supplier._count.items} items supplied
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditClick(supplier)}
                  className="text-gray-400 hover:text-indigo-600 transition-colors p-1"
                  title="Edit supplier"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(supplier.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-1"
                  title="Delete supplier"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {supplier.contactPerson && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Contact:</span> {supplier.contactPerson}
                </p>
              )}
              {supplier.email && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Mail className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                  <a href={`mailto:${supplier.email}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    {supplier.email}
                  </a>
                </div>
              )}
              {supplier.phone && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                  <a href={`tel:${supplier.phone}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    {supplier.phone}
                  </a>
                </div>
              )}
              {supplier.address && (
                <div className="flex items-start text-sm text-gray-600 dark:text-gray-300 mt-2">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>{supplier.address}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <Truck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No suppliers found
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm 
              ? 'Try a different search term.' 
              : 'Get started by adding a new supplier.'}
          </p>
          {!searchTerm && (
            <button
              onClick={handleAddClick}
              className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
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
                {modalMode === 'add' ? 'Add Supplier' : 'Edit Supplier'}
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
                  Supplier Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter supplier name"
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter contact person name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter complete address"
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
                      {modalMode === 'add' ? 'Add Supplier' : 'Save Changes'}
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