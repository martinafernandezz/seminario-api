import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cancha } from '../cancha/cancha.entity.js';

// clave compuesta
@Entity('precio')
export class Precio {
  @PrimaryColumn({ name: 'id_cancha', type: 'int' })
  id_cancha!: number;

  @PrimaryColumn({ name: 'fecha_vigencia', type: 'date' })
  fecha_vigencia!: string;

  @Column({ name: 'precio_por_hora', type: 'decimal', precision: 10, scale: 2 })
  precio_por_hora!: number;

  @ManyToOne(() => Cancha, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_cancha' })
  cancha?: Cancha;
}

export interface PrecioCreate {
  id_cancha: number;
  precio_por_hora: number;
  fecha_vigencia: string;
}

export interface PrecioUpdate {
  precio_por_hora?: number;
}
