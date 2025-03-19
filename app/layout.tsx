import './globals.css'
import '../utils/polyfills'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Layout from '@/components/layout'
import { ICPProvider } from '@/contexts/ICPContext'
import Navbar from '@/components/Navbar'
import { Toaster } from 'react-hot-toast'
import '../styles/calendar.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DeFi Freelance Marketplace',
  description: 'A decentralized marketplace for freelancers and clients',
  icons: {
    icon: '/images/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ICPProvider>
          <Navbar />
          <Layout>
            {children}
          </Layout>
          {/* <Toaster position="top-right" /> */}
        </ICPProvider>
      </body>
    </html>
  )
}