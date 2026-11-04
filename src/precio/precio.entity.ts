import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cancha } from '../cancha/cancha.entity.js';

@Entity('precio')
export class Precio {
  @PrimaryGeneratedColumn({ name: 'id_precio' })
  id_precio!: number;

  @Column({ name: 'id_cancha', type: 'int' })
  id_cancha!: number;

  @Column({ name: 'valor_por_hora', type: 'decimal', precision: 10, scale: 2 })
  valor_por_hora!: number;

  @Column({ name: 'fecha_vigencia', type: 'date' })
  fecha_vigencia!: string;

  @ManyToOne(() => Cancha)
  @JoinColumn({ name: 'id_cancha' })
  cancha?: Cancha;
}

export interface PrecioCreate {
  id_cancha: number;
  valor_por_hora: number;
  fecha_vigencia: string;
}

export interface PrecioUpdate {
  id_cancha?: number;
  valor_por_hora?: number;
  fecha_vigencia?: string;
}
