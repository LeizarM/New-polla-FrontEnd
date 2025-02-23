// src/hooks/useEquipos.ts
import { useState, useCallback, useEffect } from 'react';
import { Equipo } from '@/types/models/Equipo';
import { equipoService } from '@/services/equipo.services';
import { useToast } from '@/hooks/useToast';
import authService from '@/services/auth.services';

export const useEquipos = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchEquipos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await equipoService.getEquipos();
      // Asegúrate de que response.data existe y es un array
      const data = Array.isArray(response) ? response : response.data || [];
      setEquipos(data);
    } catch (error: any) {
      console.error('Error fetching equipos:', error);
      showToast({
        type: "error",
        title: "Error",
        description: error.message || "Error al cargar equipos",
      });
      // En caso de error, inicializar con array vacío
      setEquipos([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Llamar a fetchEquipos cuando el componente se monta
  useEffect(() => {
    fetchEquipos();
  }, [fetchEquipos]);

  const handleSubmit = async (equipo: Equipo, selectedEquipo?: Equipo): Promise<boolean> => {
    try {
      const equipoData: Equipo = {
        codEquipo: selectedEquipo?.codEquipo || 0,
        nombre: equipo.nombre,
        descripcion: equipo.descripcion,
        audUsuario: authService.getCodUsuario() || 1,
        audFecha: new Date()
      };

      await equipoService.register(equipoData);
      
      showToast({
        type: 'success',
        title: 'Éxito',
        description: equipoData.codEquipo === 0
          ? 'Equipo registrado correctamente'
          : 'Equipo actualizado correctamente'
      });

      await fetchEquipos(); // Actualizar la lista después de guardar
      return true;
    } catch (error: any) {
      console.error('Error saving equipo:', error);
      showToast({
        type: 'error',
        title: 'Error',
        description: error.message || 'Error al guardar equipo'
      });
      return false;
    }
  };

  const handleDelete = async (codEquipo: number): Promise<boolean> => {
    try {
      await equipoService.deleteEquipo(codEquipo);
      showToast({
        type: "success",
        title: "Éxito",
        description: "Equipo eliminado correctamente"
      });
      await fetchEquipos(); // Actualizar la lista después de eliminar
      return true;
    } catch (error: any) {
      console.error('Error deleting equipo:', error);
      showToast({
        type: "error",
        title: "Error",
        description: error.message || "Error al eliminar equipo"
      });
      return false;
    }
  };

  return {
    equipos,
    loading,
    fetchEquipos,
    handleSubmit,
    handleDelete,
  };
};