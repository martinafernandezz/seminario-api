import { Cancha, FranjaHoraria } from '../cancha/cancha.entity.js';

export interface CanchaConDisponibilidad extends Cancha {
  tipo_nombre?: string;
  precio_hora: number;
  horarios_disponibles: FranjaHoraria[];
}

export interface BusquedaRequest {
  fecha: string;
  deporte?: string;
  id_tipo?: number;
}
