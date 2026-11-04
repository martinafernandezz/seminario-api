import { Cancha, FranjaHoraria } from '../cancha/cancha.entity.js';

export interface CanchaConDisponibilidad extends Cancha {
  tipo_nombre?: string;
  localidad_nombre?: string;
  horarios_disponibles: FranjaHoraria[];
}

export interface BusquedaRequest {
  fecha: string;
  deporte?: string;
  localidad?: string;
  id_tipo?: number;
  id_localidad?: number;
}