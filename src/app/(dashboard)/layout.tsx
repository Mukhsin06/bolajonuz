'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  Home, 
  Users, 
  Calendar, 
  CreditCard, 
  Settings, 
  LogOut,
  Baby,
  Menu,
  X,
  GraduationCap,
  Moon,
  Sun
} from 'lucide-react'
import { AuthManager } from '@/utils/auth'
import { StorageManager } from '@/utils/storage'
import { useTheme } from '@/components/ThemeProvider'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const user = AuthManager.getCurrentUser()
    if (!user) {
      router.push('/login')
    } else {
      setCurrentUser(user)
    }
  }, [router])

  const handleLogout = () => {
    AuthManager.logout()
    router.push('/login')
  }

  const navigation = [
    { name: 'Bosh sahifa', href: '/dashboard', icon: Home },
    { name: 'Bolalar', href: '/children', icon: Users },
    { name: 'Davomat', href: '/attendance', icon: Calendar },
    { name: 'O\'qituvchilar', href: '/teachers', icon: GraduationCap },
    { name: 'To\'lovlar', href: '/payments', icon: CreditCard },
    { name: 'Sozlamalar', href: '/settings', icon: Settings },
  ]

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md shadow-md transition-colors bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 shadow-lg transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 bg-white dark:bg-gray-800`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <Baby className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Bog'cha SRM
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Boshqaruv tizimi
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-100 border-r-2 border-blue-700 dark:border-blue-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Dark mode toggle */}
          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={toggleTheme}
              className="flex items-center w-full px-4 py-2 text-sm rounded-lg transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
            >
              {theme === 'dark' ? <Sun className="mr-3 h-4 w-4" /> : <Moon className="mr-3 h-4 w-4" />}
              {theme === 'dark' ? 'Yorug\' rejim' : 'Qorong\'u rejim'}
            </button>
          </div>

          {/* User info and logout */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-300 font-semibold">
                  {currentUser?.name.charAt(0)}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentUser?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {currentUser?.role === 'admin' ? 'Administrator' : `O'qituvchi (${currentUser?.teacherCode})`}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm rounded-lg transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Chiqish
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="p-4 lg:p-8 text-gray-900 dark:text-white">
          {children}
        </main>
      </div>
    </div>
  )
}