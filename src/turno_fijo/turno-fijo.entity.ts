import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reserva } from '../reserva/reserva.entity.js';

@Entity('turno_fijo')
export class TurnoFijo {
  @PrimaryGeneratedColumn({ name: 'id_turno_fijo' })
  id_turno_fijo!: number;

  @Column({ name: 'fecha_desde', type: 'date' })
  fecha_desde!: string;

  @Column({ name: 'fecha_hasta', type: 'date' })
  fecha_hasta!: string;

  @OneToMany(() => Reserva, reserva => reserva.turno_fijo)
  reservas?: Reserva[];
}
