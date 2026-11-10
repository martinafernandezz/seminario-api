import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TipoCancha } from '../tipo_cancha/tipo-cancha.entity.js';

@Entity('cancha')
export class Cancha {
  @PrimaryGeneratedColumn({ name: 'id_cancha' })
  id_cancha!: number;

  @Column({ name: 'nombre', type: 'varchar', length: 100 })
  nombre!: string;

  @Column({ name: 'estado', type: 'varchar', length: 30, default: 'disponible' })
  estado!: 'disponible' | 'ocupada' | 'mantenimiento';

  @Column({ name: 'id_tipo', type: 'int' })
  id_tipo!: number;

  // Relaciones
  @ManyToOne(() => TipoCancha)
  @JoinColumn({ name: 'id_tipo' })
  tipo_cancha?: TipoCancha;
}

export interface CanchaCreate {
  nombre: string;
  estado?: 'disponible' | 'ocupada' | 'mantenimiento';
  id_tipo: number;
}

export interface CanchaUpdate {
  nombre?: string;
  estado?: 'disponible' | 'ocupada' | 'mantenimiento';
  id_tipo?: number;
}

// horario fijo de atención
export const HORA_APERTURA = '08:00:00';
export const HORA_CIERRE = '22:00:00';

export interface FranjaHoraria {
  hora_inicio: string;
  hora_fin: string;
  disponible: boolean;
  reserva_id?: number;
}

export interface DisponibilidadRequest {
  id_cancha: number;
  fecha: string;
}
