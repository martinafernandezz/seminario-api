import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Reserva } from '../reserva/reserva.entity.js';

@Entity('pago')
export class Pago {
  @PrimaryGeneratedColumn({ name: 'id_pago' })
  id_pago!: number;

  @Column({ name: 'id_reserva', type: 'int' })
  id_reserva!: number;

  @Column({ name: 'monto', type: 'decimal', precision: 12, scale: 2 })
  monto!: number;

  @Column({ name: 'estado', type: 'varchar', length: 50, default: 'pendiente' })
  estado!: 'pendiente' | 'completado' | 'fallido' | 'reembolsado';

  @Column({ name: 'metodo_pago', type: 'varchar', length: 50, nullable: true, default: 'tarjeta' })
  metodo_pago?: 'tarjeta' | 'efectivo' | 'transferencia';

  @Column({ name: 'transaccion_id', type: 'varchar', length: 255, nullable: true })
  transaccion_id?: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fecha_creacion?: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fecha_actualizacion?: Date;

  @ManyToOne(() => Reserva)
  @JoinColumn({ name: 'id_reserva' })
  reserva?: Reserva;
}

export interface PagoCreate {
  id_reserva: number;
  monto: number;
  metodo_pago?: 'tarjeta' | 'efectivo' | 'transferencia';
}

export interface PagoUpdate {
  estado?: 'pendiente' | 'completado' | 'fallido' | 'reembolsado';
  transaccion_id?: string;
}