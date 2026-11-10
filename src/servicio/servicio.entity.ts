import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Reserva } from '../reserva/reserva.entity.js';

@Entity('servicio')
export class Servicio {
  @PrimaryGeneratedColumn({ name: 'id_servicio' })
  id_servicio!: number;

  @Column({ name: 'id_reserva', type: 'int', nullable: true })
  id_reserva?: number | null;

  @Column({ name: 'nombre', type: 'varchar', length: 100 })
  nombre!: string;

  @Column({ name: 'precio_servicio', type: 'decimal', precision: 10, scale: 2 })
  precio_servicio!: number;

  @Column({ name: 'estado', type: 'boolean', default: true })
  estado!: boolean;

  @ManyToOne(() => Reserva, reserva => reserva.servicios, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_reserva' })
  reserva?: Reserva | null;
}

export interface ServicioCreate {
  nombre: string;
  precio_servicio: number;
  estado?: boolean;
}

export interface ServicioUpdate {
  nombre?: string;
  precio_servicio?: number;
  estado?: boolean;
}
