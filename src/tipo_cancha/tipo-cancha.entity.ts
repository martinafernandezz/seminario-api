import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipocancha')
export class TipoCancha {
  @PrimaryGeneratedColumn({ name: 'id_tipo' })
  id_tipo!: number;

  @Column({ name: 'nombre', type: 'varchar', length: 100 })
  nombre!: string;

  @Column({ name: 'deporte', type: 'varchar', length: 50 })
  deporte!: string;
}
  
export interface TipoCanchaCreate {
  nombre: string;
  deporte: string;
}

export interface TipoCanchaUpdate {
  nombre?: string;
  deporte?: string;
}