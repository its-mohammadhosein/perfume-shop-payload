import type { Metadata } from 'next'

import localFont from 'next/font/local'
import React from 'react'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import './globals.css'

const satoshi = localFont({
  src: [
    { path: '../../fonts/Satoshi-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../fonts/Satoshi-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../fonts/Satoshi-Bold.woff2', weight: '600', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-satoshi',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={satoshi.variable} lang="en">
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <a
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-4 focus:py-2"
          href="#main-content"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: {
    default: 'Perfumes',
    template: '%s - Perfumes',
  },
  openGraph: mergeOpenGraph(),
}
