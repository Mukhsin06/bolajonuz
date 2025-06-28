'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthManager } from '@/utils/auth'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = AuthManager.isLoggedIn()
    if (isLoggedIn) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  )
}