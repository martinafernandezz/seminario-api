import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario!: number;

  @Column({ type: 'varchar', length: 8, unique: true })
  dni!: string;

  @Column({ type: 'varchar', length: 100 })
  nombre!: string;

  @Column({ type: 'varchar', length: 100 })
  apellido!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  username!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'enum', enum: ['administrador', 'cliente'] })
  rol!: 'administrador' | 'cliente';

  @Column({ type: 'int', nullable: true })
  id_localidad?: number;
}

// Objeto con valores para usar en runtime
export const RolUsuario = {
  ADMINISTRADOR: 'administrador',
  CLIENTE: 'cliente'
} as const;

// Tipo derivado del objeto
export type RolUsuario = typeof RolUsuario[keyof typeof RolUsuario];

export interface UsuarioCreate {
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  username: string;
  password: string;
  rol: RolUsuario;
  id_localidad?: number;
}

export interface UsuarioUpdate {
  dni?: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  username?: string;
  password?: string;
  rol?: RolUsuario;
  id_localidad?: number;
}
