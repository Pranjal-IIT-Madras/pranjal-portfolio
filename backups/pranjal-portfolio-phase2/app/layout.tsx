import type { Metadata, Viewport } from 'next'
import { syne, manrope, jetbrainsMono } from '@/lib/fonts'
import AppProviders from '@/components/providers/AppProviders'
import '@/app/globals.css'

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: 'Pranjal Bhatnagar — Computer Science Student',
    template: '%s | Pranjal Bhatnagar',
  },
  description:
    'B.Tech CSE at VIT Bhopal & BS Data Science at IIT Madras. ' +
    'Building expertise in software engineering, algorithms, and data science.',
  keywords: [
    'Pranjal Bhatnagar',
    'Computer Science Student',
    'VIT Bhopal',
    'IIT Madras',
    'Data Science',
    'C++',
    'Python',
    'Web Development',
    'DSA',
    'Software Engineering',
  ],
  authors:      [{ name: 'Pranjal Bhatnagar' }],
  creator:      'Pranjal Bhatnagar',
  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:         'https://pranjal-bhatnagar.vercel.app',
    title:       'Pranjal Bhatnagar — Computer Science Student',
    description: 'Dual academic journey at VIT Bhopal & IIT Madras. Developer. Problem solver.',
    siteName:    'Pranjal Bhatnagar',
    images: [{ url: '/images/og-image.png', width: 1200, height: 630, alt: 'Pranjal Bhatnagar Portfolio' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Pranjal Bhatnagar — Computer Science Student',
    description: 'Dual academic journey at VIT Bhopal & IIT Madras. Developer. Problem solver.',
    images:      ['/images/og-image.png'],
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  metadataBase: new URL('https://pranjal-bhatnagar.vercel.app'),
}

export const viewport: Viewport = {
  themeColor:          '#050816',
  width:               'device-width',
  initialScale:        1,
  maximumScale:        5,
  userScalable:        true,
  colorScheme:         'dark',
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={[
        syne.variable,
        manrope.variable,
        jetbrainsMono.variable,
      ].join(' ')}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="bg-space-black font-manrope antialiased overflow-x-hidden">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  )
}
