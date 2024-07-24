import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import TypographyH1 from '@/components/ui/typography-h1'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hypersomnia',
  description: 'web-based API testing tool',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col">
          <TypographyH1>Hypersomnia</TypographyH1>
          {children}{' '}
        </main>
      </body>
    </html>
  )
}
