import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TipoCancha } from '../tipo_cancha/tipo-cancha.entity.js';
import { Localidad } from '../localidad/localidad.entity.js';

@Entity('cancha')
export class Cancha {
  @PrimaryGeneratedColumn({ name: 'id_cancha' })
  id_cancha!: number;

  @Column({ name: 'nombre', type: 'varchar', length: 100 })
  nombre!: string;

  @Column({ name: 'estado', type: 'varchar', length: 50, default: 'disponible' })
  estado!: 'disponible' | 'ocupada' | 'mantenimiento';

  @Column({ name: 'id_tipo', type: 'int' })
  id_tipo!: number;

  @Column({ name: 'id_localidad', type: 'int' })
  id_localidad!: number;

  @Column({ name: 'precio_hora', type: 'decimal', precision: 10, scale: 2, nullable: true })
  precio_hora?: number;

  @Column({ name: 'hora_apertura', type: 'time', default: '08:00:00' })
  hora_apertura!: string;

  @Column({ name: 'hora_cierre', type: 'time', default: '22:00:00' })
  hora_cierre!: string;

  // Relaciones
  @ManyToOne(() => TipoCancha)
  @JoinColumn({ name: 'id_tipo' })
  tipo_cancha?: TipoCancha;

  @ManyToOne(() => Localidad)
  @JoinColumn({ name: 'id_localidad' })
  localidad?: Localidad;
}

export interface CanchaCreate {
  nombre: string;
  estado?: 'disponible' | 'ocupada' | 'mantenimiento';
  id_tipo: number;
  id_localidad: number;
  precio_hora?: number;
  hora_apertura?: string;
  hora_cierre?: string;
}

export interface CanchaUpdate {
  nombre?: string;
  estado?: 'disponible' | 'ocupada' | 'mantenimiento';
  id_tipo?: number;
  id_localidad?: number;
  precio_hora?: number;
  hora_apertura?: string;
  hora_cierre?: string;
}

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