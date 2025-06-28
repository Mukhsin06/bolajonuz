import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bog\'cha SRM - Boshqaruv Tizimi',
  description: 'Bog\'cha uchun zamonaviy boshqaruv tizimi (Student Relationship Management)',
  keywords: 'bog\'cha, kindergarten, SRM, boshqaruv, tizim, davomat, to\'lov',
  authors: [{ name: 'Bog\'cha SRM Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Bog\'cha SRM - Boshqaruv Tizimi',
    description: 'Bog\'cha uchun zamonaviy boshqaruv tizimi',
    type: 'website',
    locale: 'uz_UZ',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}