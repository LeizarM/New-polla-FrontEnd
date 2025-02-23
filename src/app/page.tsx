'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirigir a la página de login en el lado del cliente
    router.push('/login');
  }, [router]);
  
  // Mostrar un estado de carga mientras se realiza la redirección
  return (
    <div className="flex min-h-screen items-center justify-center">
      Redirigiendo...
    </div>
  );
}