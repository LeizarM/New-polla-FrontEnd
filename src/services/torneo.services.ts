import axios from "axios";
import authService from "./auth.services";
import { Torneo } from "@/types/models/Torneo";



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
        const response = await axiosInstance.post<Torneo[]>('/lst-torneos');
        console.log('Respuesta:', response.data);
        return response.data;
      } catch (error : any) {
        console.error('Error en getAllTorneos:', error);
        throw new Error(error.response?.data?.message || 'Error al obtener torneos');
      }
    },


  }