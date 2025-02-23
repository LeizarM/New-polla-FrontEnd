// src/services/auth.services.ts
import { LoginCredentials, AuthResponse } from '../types/auth.types';
import http from '../utils/http';
import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await http.post<AuthResponse>('/auth/login', credentials);
    
    if (response.data && response.data.token) {
      // Guardar token en cookie
      Cookies.set(TOKEN_KEY, response.data.token, {
        expires: 1, // 1 día
        path: '/',
        sameSite: 'lax'
      });

      // Guardar en localStorage
      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify({
        username: response.data.usuario,
        esAdmin: response.data.esAdmin,
        codUsuario: response.data.codUsuario
      }));
    }
    
    return response.data;
  } catch (error) {
    console.error('Error en login service:', error);
    throw error;
  }
};

const logout = (): void => {
  Cookies.remove(TOKEN_KEY, { path: '/' });
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

const getToken = (): string | null => {
  return Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
};

const isAuthenticated = (): boolean => {
  return !!getToken();
};

const getCodUsuario = (): number | null => {
  return  JSON.parse(localStorage.getItem(USER_KEY) || '').codUsuario;
}

const authService = {
  login,
  logout,
  getCurrentUser,
  getToken,
  isAuthenticated,
  getCodUsuario
};

export default authService;