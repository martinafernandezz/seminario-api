import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('localidad')
export class Localidad {
  @PrimaryGeneratedColumn({ name: 'id_localidad' })
  id!: number;

  @Column({ name: 'nombre', type: 'varchar', length: 100 })
  nombre!: string;
}

export interface LocalidadCreate {
  nombre: string;
}

export interface LocalidadUpdate {
  nombre?: string;
}