// Tipo para la respuesta del API
export interface ApiResponse<T> {
    message: string;
    data: T;
    status: number;
  }