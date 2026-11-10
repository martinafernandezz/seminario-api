import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Servicio } from '../servicio/servicio.entity.js';
import { TurnoFijo } from '../turno_fijo/turno-fijo.entity.js';

@Entity('reserva')
export class Reserva {
  @PrimaryGeneratedColumn({ name: 'id_reserva' })
  id_reserva!: number;

  @Column({ name: 'id_usuario', type: 'int' })
  id_usuario!: number;

  @Column({ name: 'id_cancha', type: 'int' })
  id_cancha!: number;

  @Column({ name: 'id_turno_fijo', type: 'int', nullable: true })
  id_turno_fijo?: number | null;

  @Column({ name: 'fecha', type: 'date' })
  fecha!: string;

  @Column({ name: 'hora_inicio', type: 'time' })
  hora_inicio!: string;

  @Column({ name: 'hora_fin', type: 'time' })
  hora_fin!: string;

  @Column({ name: 'precio_total', type: 'decimal', precision: 10, scale: 2 })
  precio_total!: number;

  @Column({ name: 'puntaje', type: 'int', nullable: true })
  puntaje?: number | null;

  @Column({ name: 'resena', type: 'varchar', length: 500, nullable: true })
  resena?: string | null;

  @Column({ name: 'estado', type: 'varchar', length: 20, default: 'pendiente' })
  estado?: string;

  @ManyToOne(() => TurnoFijo, turno => turno.reservas, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_turno_fijo' })
  turno_fijo?: TurnoFijo | null;

  // un servicio pertenece a una sola reserva
  @OneToMany(() => Servicio, servicio => servicio.reserva)
  servicios?: Servicio[];
}

export interface ReservaCreate {
  id_usuario: number;
  id_cancha: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  precio_total: number;
  id_turno_fijo?: number;
  puntaje?: number;
  resena?: string;
  estado?: string;
  id_servicios?: number[];
}

export interface ReservaUpdate {
  id_usuario?: number;
  id_cancha?: number;
  fecha?: string;
  hora_inicio?: string;
  hora_fin?: string;
  precio_total?: number;
  id_turno_fijo?: number;
  puntaje?: number;
  resena?: string;
  estado?: string;
  id_servicios?: number[];
}
