import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Reserva } from '../reserva/reserva.entity.js';

@Entity('pago')
export class Pago {
  @PrimaryGeneratedColumn({ name: 'id_pago' })
  id_pago!: number;

  @Column({ name: 'id_reserva', type: 'int' })
  id_reserva!: number;

  @Column({ name: 'monto', type: 'decimal', precision: 10, scale: 2 })
  monto!: number;

  @Column({ name: 'estado', type: 'varchar', length: 20, default: 'pendiente' })
  estado!: 'pendiente' | 'completado' | 'fallido' | 'reembolsado';

  @Column({ name: 'metodo_pago', type: 'varchar', length: 30 })
  metodo_pago!: 'tarjeta' | 'efectivo' | 'transferencia';

  @Column({ name: 'fecha', type: 'date', default: () => 'CURRENT_DATE' })
  fecha?: string;

  @Column({ name: 'sena', type: 'boolean', default: false })
  sena!: boolean;

  @ManyToOne(() => Reserva, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_reserva' })
  reserva?: Reserva;
}

export interface PagoCreate {
  id_reserva: number;
  monto: number;
  metodo_pago?: 'tarjeta' | 'efectivo' | 'transferencia';
  sena?: boolean;
}

export interface PagoUpdate {
  estado?: 'pendiente' | 'completado' | 'fallido' | 'reembolsado';
}
