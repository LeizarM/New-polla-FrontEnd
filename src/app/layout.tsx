// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My NextUI App',
  description: 'Application with NextUI and Spring Boot backend',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Nota: Eliminamos cualquier clase de tema aquí
  // y dejamos que next-themes lo maneje por completo
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}