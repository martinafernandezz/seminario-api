import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Servicio } from '../servicio/servicio.entity.js';

@Entity('reserva')
export class Reserva {
  @PrimaryGeneratedColumn({ name: 'id_reserva' })
  id_reserva!: number;

  @Column({ name: 'id_usuario', type: 'int' })
  id_usuario!: number;

  @Column({ name: 'id_cancha', type: 'int' })
  id_cancha!: number;

  @Column({ name: 'fecha', type: 'date' })
  fecha!: string;

  @Column({ name: 'hora_inicio', type: 'time' })
  hora_inicio!: string;

  @Column({ name: 'hora_fin', type: 'time' })
  hora_fin!: string;

  @Column({ name: 'precio_total', type: 'decimal', precision: 10, scale: 2 })
  precio_total!: number;

  // Relación ManyToMany con Servicio
  @ManyToMany(() => Servicio, servicio => servicio.reservas)
  @JoinTable({
    name: 'reserva_servicio',
    joinColumn: { name: 'id_reserva', referencedColumnName: 'id_reserva' },
    inverseJoinColumn: { name: 'id_servicio', referencedColumnName: 'id_servicio' }
  })
  servicios?: Servicio[];
}

export interface ReservaCreate {
  id_usuario: number;
  id_cancha: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  precio_total: number;
  id_servicios?: number[];
}

export interface ReservaUpdate {
  id_usuario?: number;
  id_cancha?: number;
  fecha?: string;
  hora_inicio?: string;
  hora_fin?: string;
  precio_total?: number;
  id_servicios?: number[];
}