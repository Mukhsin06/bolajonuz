'use client'

import { useEffect, useState } from 'react'
import { AuthManager } from '@/utils/auth'
import AdminDashboard from '@/components/AdminDashboard'
import TeacherDashboard from '@/components/TeacherDashboard'

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = AuthManager.getCurrentUser()
    setCurrentUser(user)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (currentUser?.role === 'admin') {
    return <AdminDashboard />
  } else if (currentUser?.role === 'teacher') {
    return <TeacherDashboard />
  }

  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-500 dark:text-gray-400">Foydalanuvchi roli aniqlanmadi</p>
    </div>
  )
}