// src/types/auth.types.ts
export interface LoginCredentials {
  usuario: string;    // Cambiado de username a usuario
  contrasena: string; // Cambiado de password a contrasena
}

export interface AuthResponse {
  token: string;
  usuario: string;
  esAdmin: number;
}

export interface User {
  username: string;
  esAdmin: number;
}


export interface Usuario {
  codUsuario: number;
  codParticipante: number;
  usuario: string;
  contrasena: string;
  estado: boolean;
  esAdmin: boolean;
  audUsuario: string;
  audFecha: Date;
}