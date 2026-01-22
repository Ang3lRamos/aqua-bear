import React from "react"
import type { Metadata, Viewport } from 'next'
import { Nunito, Nunito_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _nunito = Nunito({ subsets: ["latin"], variable: '--font-nunito' });
const _nunitoSans = Nunito_Sans({ subsets: ["latin"], variable: '--font-nunito-sans' });

export const metadata: Metadata = {
  title: 'Aqua Bear Swim Club | Clases de Natacion para Todas las Edades',
  description: 'Club de natacion con clases para ninos y adultos, acceso a piscina y programas especializados. Reserva tu clase hoy.',
  keywords: ['natacion', 'clases de natacion', 'piscina', 'swim club', 'aqua bear'],
   themeColor: '#1e4a6e',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}