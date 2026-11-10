import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  id_usuario!: number;

  @Column({ type: 'varchar', length: 100 })
  nombre!: string;

  @Column({ type: 'varchar', length: 100 })
  apellido!: string;

  @Column({ type: 'int', unique: true })
  dni!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  username!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  mail!: string;

  @Column({
    type: 'bigint',
    nullable: true,
    // pg devuelve bigint como string
    transformer: { to: (v?: number | null) => v, from: (v?: string | null) => (v == null ? null : Number(v)) },
  })
  telefono?: number;

  @Column({ type: 'varchar', length: 20, default: 'cliente' })
  rol!: 'administrador' | 'cliente';

  @Column({ type: 'varchar', length: 20, default: 'activo' })
  estado!: string;
}

// Objeto con valores para usar en runtime
export const RolUsuario = {
  ADMINISTRADOR: 'administrador',
  CLIENTE: 'cliente'
} as const;

// Tipo derivado del objeto
export type RolUsuario = typeof RolUsuario[keyof typeof RolUsuario];

export interface UsuarioCreate {
  nombre: string;
  apellido: string;
  dni: number;
  username: string;
  password: string;
  mail: string;
  telefono?: number;
  rol?: RolUsuario;
  estado?: string;
}

export interface UsuarioUpdate {
  nombre?: string;
  apellido?: string;
  dni?: number;
  username?: string;
  password?: string;
  mail?: string;
  telefono?: number;
  rol?: RolUsuario;
  estado?: string;
}
