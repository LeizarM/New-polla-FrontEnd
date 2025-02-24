// src/services/equipo.services.ts
import axios from 'axios';  
import { Equipo } from '@/types/models/Equipo';  

import authService from './auth.services';

// Ahora usamos una ruta relativa que será manejada por el proxy de Next.js
const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para el token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export const equipoService = {  
  getEquipos: async () => {
    try {
      const response = await axiosInstance.post('/lst-equipos');
      console.log('Respuesta:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Error en getEquipos:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener equipos');
    }
  },

  register: async (equipo: Equipo) => {    
    try {    
      if (!authService.isAuthenticated()) {    
        throw new Error('No autenticado');    
      }    
    
      // Corregir la URL para que coincida con el endpoint del backend  
      const response = await axiosInstance.post('/register', {    
        ...equipo,    
        codEquipo: equipo.codEquipo || 0,  
      });    
    
      // La respuesta del backend no incluye success, sino status  
      if (response.status === 200 || response.status === 201) {    
        return {  
          success: true,  
          message: response.data.message,  
          data: response.data.data  
        };  
      } else {  
        throw new Error(response.data.message || 'Error en la operación');    
      }    
    } catch (error: any) {    
      console.error('Error en register:', error);  
      throw new Error(error.response?.data?.message || 'Error al procesar la solicitud');    
    }    
  },


  deleteEquipo: async (id: number) => {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('No autenticado');
      }

      const response = await axiosInstance.post('/abm-equipo', {
        codEquipo: id,
        ACCION: 'D'
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar el equipo');
    }
  }
};