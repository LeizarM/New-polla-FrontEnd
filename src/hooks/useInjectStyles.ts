'use client'

import { useEffect } from 'react';

/**
 * Hook para inyectar estilos en el documento
 * @param styles Estilos CSS a inyectar
 * @param id Identificador único para el elemento style
 */
const useInjectStyles = (styles: string, id: string): void => {
  useEffect(() => {
    // Verificar si ya existe el estilo
    let styleElement = document.getElementById(id) as HTMLStyleElement;
    
    // Si no existe, crear el elemento style
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = id;
      styleElement.innerHTML = styles;
      document.head.appendChild(styleElement);
    }
    
    return () => {
      // Limpiar los estilos al desmontar
      const element = document.getElementById(id);
      if (element) {
        document.head.removeChild(element);
      }
    };
  }, [styles, id]);
};

export default useInjectStyles;