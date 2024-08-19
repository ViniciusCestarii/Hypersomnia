import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import TypographyH1 from '@/components/ui/typography-h1'
import { ThemeProvider } from './theme-provider'
import { ThemeToggleButton } from '@/components/ui/theme-toggle-button'

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex min-h-screen flex-col">
            <div className="flex justify-between items-center h-16">
              <TypographyH1>Hypersomnia</TypographyH1>
              <ThemeToggleButton />
            </div>
            {children}{' '}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
