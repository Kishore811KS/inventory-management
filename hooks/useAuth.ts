'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { mockUsers } from '@/lib/mockData'

interface User {
  id: string
  name: string
  email: string
  role: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const storedUser = localStorage.getItem('currentUser')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    )

    if (!foundUser) {
      throw new Error('Invalid email or password')
    }

    const { password: _, ...userWithoutPassword } = foundUser
    setUser(userWithoutPassword)
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))
    return { user: userWithoutPassword }
  }

  const register = async (name: string, email: string, password: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Check if user already exists
    if (mockUsers.some((u) => u.email === email)) {
      throw new Error('User already exists')
    }

    const newUser = {
      id: (mockUsers.length + 1).toString(),
      name,
      email,
      role: 'VIEWER',
    }

    setUser(newUser)
    localStorage.setItem('currentUser', JSON.stringify(newUser))
    return { user: newUser }
  }

  const logout = async () => {
    setUser(null)
    localStorage.removeItem('currentUser')
    router.push('/login')
  }

  return {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
  }
}
