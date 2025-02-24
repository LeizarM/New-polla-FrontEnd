// src/utils/http.ts
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.3.107:9333/api';

console.log('API URL:', API_URL); // Para debugging

const http = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Desactivamos withCredentials ya que puede causar problemas con CORS
  withCredentials: false,
  timeout: 15000, // Aumentamos el timeout a 15 segundos
});

// Interceptor para añadir el token y logging
http.interceptors.request.use(
  (config) => {
    try {
      const token = Cookies.get('auth_token') || localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log de la petición para debugging
      console.log('Request:', {
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data
      });
      
      return config;
    } catch (error) {
      console.error('Error en interceptor de request:', error);
      return config;
    }
  },
  (error) => {
    console.error('Error en interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores con más detalle
http.interceptors.response.use(
  (response) => {
    console.log('Response success:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error: AxiosError) => {
    // Log detallado del error
    console.error('Error detallado:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.config?.data
      }
    });

    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('La conexión tardó demasiado tiempo. Por favor, intenta de nuevo.'));
    }

    if (!error.response) {
      // Error de red o servidor no disponible
      return Promise.reject(new Error(`No se pudo conectar al servidor (${API_URL}). Verifica que el servidor esté funcionando.`));
    }

    if (error.response.status === 401) {
      Cookies.remove('auth_token', { path: '/' });
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    const errorMessage = 
      error.response?.data || 
      error.response?.data || 
      error.message || 
      'Error del servidor';

    return Promise.reject({
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data
    });
  }
);

export default http;