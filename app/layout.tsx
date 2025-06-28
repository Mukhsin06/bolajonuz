'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { useState, useEffect } from 'react';
import { DataStorage, STORAGE_KEYS } from '@/lib/storage';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storage = DataStorage.getInstance();
    const savedTheme = storage.load(STORAGE_KEYS.THEME, 'light');
    setDarkMode(savedTheme === 'dark');
  }, []);

  useEffect(() => {
    if (mounted) {
      const storage = DataStorage.getInstance();
      storage.save(STORAGE_KEYS.THEME, darkMode ? 'dark' : 'light');
      
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [darkMode, mounted]);

  return (
    <html lang="uz" className={darkMode ? 'dark' : ''}>
      <head>
        <title>Ta'lim Tizimi - Maktab Boshqaruvi</title>
        <meta name="description" content="O'quvchi va o'qituvchilarni boshqarish tizimi" />
      </head>
      <body className={inter.className}>
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            {darkMode ? (
              <span className="text-2xl">☀️</span>
            ) : (
              <span className="text-2xl">🌙</span>
            )}
          </button>
        </div>
        {children}
      </body>
    </html>
  );
}