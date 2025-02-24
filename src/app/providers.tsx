'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { AuthProvider } from '@/context/AuthProvider'
import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'
import { I18nProvider } from '@react-aria/i18n'

export function Providers({ children }: { children: React.ReactNode }) {
  // Añadimos un estado para controlar si estamos en el cliente
  const [mounted, setMounted] = useState(false)

  // Después de montar el componente, marcamos que ya estamos en el cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  // Solo renderizamos los children cuando ya estamos en el cliente
  // Esto evita problemas de hidratación con el tema
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <AuthProvider>
          <Toaster richColors position='top-center'/>
          <I18nProvider locale="es-ES">
            {mounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
          </I18nProvider>
        </AuthProvider>
      </NextThemesProvider>
    </NextUIProvider>
  )
}