export interface Torneo {
    codTorneo?: number;
    nombre?: string;
    fechaInicio?: Date;
    fechaFin?: Date;
    montoTotal?: number;
    montoFecha?: number;
    montoPolla?: number;
    finalizado?: string;
    audUsuario?: string;
    
  }

  export interface TorneoResponse {
    message: string;
    data: Torneo[];
    status: number;
  }