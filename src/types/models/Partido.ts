export interface Partido {
    codPartido: number;
    fecha: Date;
    codEquipo1: number;
    codEquipo2: number;
    scoreEq1: number;
    scoreEq2: number;
    jornada: number;
    finalizado: boolean;
  }