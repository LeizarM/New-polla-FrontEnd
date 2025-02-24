import axios from "axios";
import authService from "./auth.services";
import { Torneo, TorneoResponse } from "@/types/models/Torneo";

// Ahora usamos una ruta relativa que será manejada por el proxy de Next.js
const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

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

export const torneoService = {
  // Obtener todos los torneos
  getAllTorneos: async () => {
    try {
      const response = await axiosInstance.post<TorneoResponse>('/lst-torneos');
      console.log('Respuesta:', response.data);
      return response.data;
    } catch (error : any) {
      console.error('Error en getAllTorneos:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener torneos');
    }
  },
  
  register: async (torneo: Torneo) => {    
    try {    
      if (!authService.isAuthenticated()) {    
        throw new Error('No autenticado');    
      }    
   
      // CORRECCIÓN: codTorneo en lugar de codEquipo
      const response = await axiosInstance.post('/register-torneo', {    
        ...torneo,    
        codTorneo: torneo.codTorneo || 0, // Aseguramos que se envía correctamente el código
      });    
   
      // La respuesta del backend no incluye success, sino status  
      if (response.status === 200 || response.status === 201) {    
        return {  
          success: true,  
          message: response.data.message || (torneo.codTorneo ? 'Torneo actualizado correctamente' : 'Torneo creado correctamente'),  
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
}