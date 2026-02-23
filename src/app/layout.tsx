import { Header } from '@/components/common/header'
import { SolanaWalletProvider } from '@/components/provider/solana-provider'
import { ThemeProvider } from '@/components/theme-provider'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SolanaSwap - Modern Solana Trading Platform',
  description:
    'Trade Solana tokens with the most modern and efficient swap platform',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-black text-white`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SolanaWalletProvider>
            <Header />
            <Toaster />
            <div className="max-w-7xl mx-auto pt-0 pb-0">{children}</div>
          </SolanaWalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
