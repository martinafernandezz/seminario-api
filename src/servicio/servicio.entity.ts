import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Reserva } from '../reserva/reserva.entity.js';

@Entity('servicio')
export class Servicio {
  @PrimaryGeneratedColumn({ name: 'id_servicio' })
  id_servicio!: number;

  @Column({ name: 'nombre', type: 'varchar', length: 100 })
  nombre!: string;

  @Column({ name: 'precio_servicio', type: 'decimal', precision: 10, scale: 2 })
  precio_servicio!: number;

  @ManyToMany(() => Reserva, reserva => reserva.servicios)
  reservas?: Reserva[];
}

export interface ServicioCreate {
  nombre: string;
  precio_servicio: number;
}

export interface ServicioUpdate {
  nombre?: string;
  precio_servicio?: number;
}