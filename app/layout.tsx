import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'myMotivationAI - AI-Powered Motivation & Self-Improvement',
  description: 'Get personalized AI-powered motivation exercises, track your progress, and achieve your goals with our intelligent self-improvement platform.',
  keywords: ['motivation', 'AI', 'self-improvement', 'productivity', 'goal tracking', 'personal development'],
  authors: [{ name: 'myMotivationAI Team' }],
  creator: 'myMotivationAI',
  publisher: 'myMotivationAI',
  robots: 'index, follow',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <div className="qr-landing-container">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}