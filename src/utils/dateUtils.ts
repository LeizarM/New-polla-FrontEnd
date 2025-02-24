/**
 * Funciones utilitarias para manejo de fechas
 */

/**
 * Formatea una fecha a string en formato dd/MM/yyyy
 */
export const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  /**
   * Convierte un string o Date a objeto Date
   */
  export const parseDate = (dateStr: string | Date): Date | null => {
    if (dateStr instanceof Date) return dateStr;
    if (!dateStr) return null;
    
    // Para formato dd/MM/yyyy
    if (typeof dateStr === 'string' && dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/').map(Number);
      if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
      return new Date(year, month - 1, day);
    }
    
    // Para otros formatos ISO
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) ? date : null;
  };
  
  /**
   * Valida que dos fechas cumplan con la condición de que la fecha final sea después de la inicial
   */
  export const validateDateRange = (startDate: Date, endDate: Date): boolean => {
    if (!startDate || !endDate) return false;
    
    // Normalizar horas para comparar solo fechas
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    return end >= start;
  };