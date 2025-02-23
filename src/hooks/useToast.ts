import { useCallback } from 'react';
import { toast } from 'sonner'; // Necesitarás instalar: npm install sonner


interface ToastOptions {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
}

export const useToast = () => {
  const showToast = useCallback(({ type, title, description }: ToastOptions) => {
    switch (type) {
      case 'success':
        toast.success(title, {
          description,
          duration: 3000,
        });
        break;
      case 'error':
        toast.error(title, {
          description,
          duration: 4000,
        });
        break;
      case 'warning':
        toast.warning(title, {
          description,
          duration: 4000,
        });
        break;
      case 'info':
        toast.info(title, {
          description,
          duration: 3000,
        });
        break;
    }
  }, []);

  return { showToast };
};