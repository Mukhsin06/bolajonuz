'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Baby, Eye, EyeOff, Lock, User } from 'lucide-react'
import { AuthManager } from '@/utils/auth'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Redirect if already logged in
    if (AuthManager.isLoggedIn()) {
      router.push('/dashboard')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const success = AuthManager.login(username, password)
      if (success) {
        router.push('/dashboard')
      } else {
        setError('Foydalanuvchi nomi yoki parol noto\'g\'ri')
      }
    } catch (err) {
      setError('Tizimga kirishda xatolik yuz berdi')
    } finally {
      setIsLoading(false)
    }
  }

  const demoAccounts = [
    { username: 'admin', password: 'admin123', role: 'Administrator', code: 'ADMIN' },
    { username: 'teacher1', password: 'malika2024', role: 'O\'qituvchi - Malika', code: 'TCH001' },
    { username: 'teacher2', password: 'nodira2024', role: 'O\'qituvchi - Nodira', code: 'TCH002' },
    { username: 'teacher3', password: 'sevara2024', role: 'O\'qituvchi - Sevara', code: 'TCH003' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full animate-fade-in">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Baby className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bog'cha CRM</h1>
          <p className="text-gray-600 dark:text-gray-400">Boshqaruv tizimiga xush kelibsiz</p>
        </div>

        {/* Login form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Foydalanuvchi nomi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Foydalanuvchi nomini kiriting"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Parol
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Parolni kiriting"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Kuting...' : 'Kirish'}
            </button>
          </form>

          {/* Demo credentials */}
          {/*<div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">*/}
          {/*  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">Demo hisoblar:</p>*/}
          {/*  <div className="space-y-2">*/}
          {/*    {demoAccounts.map((account, index) => (*/}
          {/*      <div key={index} className="flex justify-between items-center text-xs">*/}
          {/*        <div className="flex flex-col">*/}
          {/*          <span className="text-gray-700 dark:text-gray-300 font-medium">{account.role}</span>*/}
          {/*          <span className="text-blue-600 dark:text-blue-400 font-mono text-xs">Kod: {account.code}</span>*/}
          {/*        </div>*/}
          {/*        <div className="flex space-x-2">*/}
          {/*          <button*/}
          {/*            type="button"*/}
          {/*            onClick={() => setUsername(account.username)}*/}
          {/*            className="font-mono bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"*/}
          {/*          >*/}
          {/*            {account.username}*/}
          {/*          </button>*/}
          {/*          <button*/}
          {/*            type="button"*/}
          {/*            onClick={() => setPassword(account.password)}*/}
          {/*            className="font-mono bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors"*/}
          {/*          >*/}
          {/*            {account.password}*/}
          {/*          </button>*/}
          {/*        </div>*/}
          {/*      </div>*/}
          {/*    ))}*/}
          {/*  </div>*/}
          {/*  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Tugmalarni bosib tezda kirish ma'lumotlarini to'ldiring</p>*/}
          {/*</div>*/}
        </div>
      </div>
    </div>
  )
}