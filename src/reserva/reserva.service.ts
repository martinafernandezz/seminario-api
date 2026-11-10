import { ReservaRepository } from './reserva.repository.js';
import { ReservaCreate, Reserva } from './reserva.entity.js';
import { AppDataSource } from '../database/data-source.js';
import { Precio } from '../precio/precio.entity.js';
import { Cancha } from '../cancha/cancha.entity.js';
import { Servicio } from '../servicio/servicio.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { Pago } from '../pago/pago.entity.js';
import { TurnoFijo } from '../turno_fijo/turno-fijo.entity.js';
import { In, LessThanOrEqual } from 'typeorm';

export class ReservaService {
  private repository: ReservaRepository;
  private precioRepository = AppDataSource.getRepository(Precio);
  private canchaRepository = AppDataSource.getRepository(Cancha);
  private servicioRepository = AppDataSource.getRepository(Servicio);
  private usuarioRepository = AppDataSource.getRepository(Usuario);
  private pagoRepository = AppDataSource.getRepository(Pago);
  private turnoFijoRepository = AppDataSource.getRepository(TurnoFijo);

  constructor() {
    this.repository = new ReservaRepository();
  }


  private calcularHoras(hora_inicio: string, hora_fin: string): number {
    const inicio = new Date(`2000-01-01T${hora_inicio}`);
    const fin = new Date(`2000-01-01T${hora_fin}`);
    const diffMs = fin.getTime() - inicio.getTime();
    const diffHoras = diffMs / (1000 * 60 * 60);
    return Math.max(diffHoras, 1); // Mínimo 1 hora
  }

  private async obtenerPrecioVigente(id_cancha: number, fecha: string): Promise<number> {
    const precioVigente = await this.precioRepository.findOne({
      where: {
        id_cancha,
        fecha_vigencia: LessThanOrEqual(fecha),
      },
      order: { fecha_vigencia: 'DESC' },
    });

    if (!precioVigente) {
      throw new Error(`La cancha ${id_cancha} no tiene precio vigente configurado`);
    }

    return Number(precioVigente.precio_por_hora);
  }
  
  private async calcularPrecioTotal(data: {
    id_cancha: number;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
    id_servicios?: number[];
  }): Promise<number> {
    let precio_total = 0;

    
    const precioPorHora = await this.obtenerPrecioVigente(data.id_cancha, data.fecha);
    const horas = this.calcularHoras(data.hora_inicio, data.hora_fin);
    const precioCancha = precioPorHora * horas;
    precio_total += precioCancha;

    console.log(`- Cálculo precio - Cancha: ${precioCancha}, Horas: ${horas}, Precio/hora: ${precioPorHora}`);

    
    if (data.id_servicios && data.id_servicios.length > 0) {
      const servicios = await this.servicioRepository.find({
        where: { id_servicio: In(data.id_servicios) },
      });

      const sumaServicios = servicios.reduce((acc, s) => {
        const precio = Number(s.precio_servicio) || 0;
        return acc + precio;
      }, 0);

      precio_total += sumaServicios;
      console.log(`- Cálculo precio - Servicios: ${sumaServicios}, Total servicios: ${data.id_servicios.length}`);
    }

    console.log(`- Cálculo precio - Total final: ${precio_total}`);
    return precio_total;
  }


  async crearReserva(data: ReservaCreate): Promise<Reserva> {
    // Calcular precio total automáticamente
    const precioCalculado = await this.calcularPrecioTotal({
      id_cancha: data.id_cancha,
      fecha: data.fecha,
      hora_inicio: data.hora_inicio,
      hora_fin: data.hora_fin,
      id_servicios: data.id_servicios
    });


    data.precio_total = Number(precioCalculado.toFixed(2));

    console.log(`- Reserva creada - Precio total: ${data.precio_total}`);
    return this.repository.create(data);
  }

  
  async obtenerTodasConServicios(): Promise<any[]> {
    const reservas = await this.repository.findAllWithServicios();

    const idsUsuario = [...new Set(reservas.map((r) => r.id_usuario))];
    const idsCancha = [...new Set(reservas.map((r) => r.id_cancha))];

    const usuarios = idsUsuario.length
      ? await this.usuarioRepository.find({ where: { id_usuario: In(idsUsuario) } })
      : [];

    const canchas = idsCancha.length
      ? await this.canchaRepository.find({ where: { id_cancha: In(idsCancha) } })
      : [];

    const usuariosMap = new Map(usuarios.map((u) => [u.id_usuario, u]));
    const canchasMap = new Map(canchas.map((c) => [c.id_cancha, c]));

    const idsTurno = [...new Set(reservas.map((r) => r.id_turno_fijo).filter((id): id is number => !!id))];
    const turnos = idsTurno.length
      ? await this.turnoFijoRepository.find({ where: { id_turno_fijo: In(idsTurno) } })
      : [];
    const turnosMap = new Map(turnos.map((t) => [t.id_turno_fijo, { id_turno_fijo: t.id_turno_fijo, fecha_desde: t.fecha_desde, fecha_hasta: t.fecha_hasta }]));

    return reservas.map(reserva => {
      const usuario = usuariosMap.get(reserva.id_usuario);
      const cancha = canchasMap.get(reserva.id_cancha);
      
      return {
        id_reserva: reserva.id_reserva,
        id_usuario: reserva.id_usuario,
        usuario_nombre: usuario ? `${usuario.nombre} ${usuario.apellido}` : `Usuario ${reserva.id_usuario}`,
        id_cancha: reserva.id_cancha,
        cancha_nombre: cancha ? cancha.nombre : `Cancha ${reserva.id_cancha}`,
        fecha: reserva.fecha,
        hora_inicio: reserva.hora_inicio,
        hora_fin: reserva.hora_fin,
        precio_total: reserva.precio_total,
        puntaje: reserva.puntaje ?? null,
        resena: reserva.resena ?? null,
        estado: reserva.estado,
        id_turno_fijo: reserva.id_turno_fijo ?? null,
        turno_fijo: reserva.id_turno_fijo ? turnosMap.get(reserva.id_turno_fijo) ?? null : null,
        servicios: reserva.servicios && reserva.servicios.length > 0
          ? reserva.servicios.map((s: any) => s.nombre).join(', ')
          : '-'
      };
    });
  }


  async obtenerPorIdConServicios(id_reserva: number) {
    const reserva = await this.repository.findByIdWithServicios(id_reserva);
    if (reserva) {
      const [usuario, cancha] = await Promise.all([
        this.usuarioRepository.findOne({ where: { id_usuario: reserva.id_usuario } }),
        this.canchaRepository.findOne({ where: { id_cancha: reserva.id_cancha } }),
      ]);
      
      return {
        ...reserva,
        usuario_nombre: usuario ? `${usuario.nombre} ${usuario.apellido}` : `Usuario ${reserva.id_usuario}`,
        cancha_nombre: cancha ? cancha.nombre : `Cancha ${reserva.id_cancha}`,
        servicios: reserva.servicios && reserva.servicios.length > 0 
          ? reserva.servicios.map((s: any) => s.nombre).join(', ')
          : '-'
      };
    }
    return null;
  }

  
  async actualizarReserva(reservaData: any): Promise<Reserva> {
    //  servicios actuales de la reserva
    const serviciosActuales = await this.repository.findServiciosByReserva(reservaData.id_reserva);
    const id_servicios_actuales = serviciosActuales.map(s => s.id_servicio);
    
    //  servicios existentes con los nuevos si se proporcionan
    const id_servicios = reservaData.id_servicios || id_servicios_actuales;

    //  precio total automáticamente
    const precio_total = await this.calcularPrecioTotal({
      id_cancha: reservaData.id_cancha,
      fecha: reservaData.fecha,
      hora_inicio: reservaData.hora_inicio,
      hora_fin: reservaData.hora_fin,
      id_servicios: id_servicios
    });

   
    const precioTotalFinal = Number(precio_total.toFixed(2));

    console.log(`- Reserva actualizada - Precio total: ${precioTotalFinal}`);

   
    const reservaActualizada: Reserva = {
      id_reserva: reservaData.id_reserva,
      id_usuario: reservaData.id_usuario,
      id_cancha: reservaData.id_cancha,
      fecha: reservaData.fecha,
      hora_inicio: reservaData.hora_inicio,
      hora_fin: reservaData.hora_fin,
      precio_total: precioTotalFinal,
      ...(reservaData.puntaje !== undefined && { puntaje: reservaData.puntaje }),
      ...(reservaData.resena !== undefined && { resena: reservaData.resena }),
      ...(reservaData.estado !== undefined && { estado: reservaData.estado }),
      ...(reservaData.id_turno_fijo !== undefined && { id_turno_fijo: reservaData.id_turno_fijo }),
    };

    await this.repository.actualizar(reservaActualizada);

    // actualizar servicios si se proporcionaron nuevos
    if (reservaData.id_servicios) {
      const reservaConServicios = await this.repository.findByIdReserva(reservaData.id_reserva);
      if (!reservaConServicios) {
        throw new Error('Reserva no encontrada');
      }

      reservaConServicios.servicios = reservaData.id_servicios.length > 0
        ? await this.servicioRepository.find({ where: { id_servicio: In(reservaData.id_servicios) } })
        : [];

      await AppDataSource.getRepository(Reserva).save(reservaConServicios);
    }

    return reservaActualizada;
  }

 
  async calcularPrecioEnTiempoReal(data: {
    id_cancha: number;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
    id_servicios: number[];
  }): Promise<{ precio_total: number; precio_cancha: number; precio_servicios: number }> {
    const precioPorHora = await this.obtenerPrecioVigente(data.id_cancha, data.fecha);
    const horas = this.calcularHoras(data.hora_inicio, data.hora_fin);
    const precio_cancha = Number((precioPorHora * horas).toFixed(2));

    let precio_servicios = 0;
    if (data.id_servicios && data.id_servicios.length > 0) {
      const servicios = await this.servicioRepository.find({
        where: { id_servicio: In(data.id_servicios) },
      });

      precio_servicios = servicios.reduce((acc, s) => {
        const precio = Number(s.precio_servicio) || 0;
        return acc + precio;
      }, 0);

      precio_servicios = Number(precio_servicios.toFixed(2));
    }

    const precio_total = Number((precio_cancha + precio_servicios).toFixed(2));

    console.log(`- Cálculo tiempo real - Cancha: ${precio_cancha}, Servicios: ${precio_servicios}, Total: ${precio_total}`);

    return {
      precio_total,
      precio_cancha,
      precio_servicios
    };
  }

  async agregarServicios(id_reserva: number, id_servicios: number[]): Promise<void> {
    const reserva = await this.repository.findByIdReserva(id_reserva);
    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    if (id_servicios.length > 0) {
      const servicios = await this.servicioRepository.find({
        where: { id_servicio: In(id_servicios) },
      });

      const sumaServicios = servicios.reduce((acc, s) => {
        const precio = Number(s.precio_servicio) || 0;
        return acc + precio;
      }, 0);

      reserva.precio_total = Number(reserva.precio_total) + sumaServicios;
      await AppDataSource.getRepository(Reserva).save(reserva);
    }

    return this.repository.addServicios(id_reserva, id_servicios);
  }

  async eliminarServicio(id_reserva: number, id_servicio: number) {
    const [servicio, reserva] = await Promise.all([
      this.servicioRepository.findOne({ where: { id_servicio } }),
      this.repository.findByIdReserva(id_reserva),
    ]);

    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    if (servicio) {
      const precio = Number(servicio.precio_servicio) || 0;
      reserva.precio_total = Math.max(0, Number(reserva.precio_total) - precio);
      await AppDataSource.getRepository(Reserva).save(reserva);
    }

    return this.repository.removeServicio(id_reserva, id_servicio);
  }

 async eliminarReserva(id_reserva: number) {
    //  pasar el id_reserva
    return this.repository.delete(id_reserva);
  }

  async obtenerServicios(id_reserva: number) {
    return this.repository.findServiciosByReserva(id_reserva);
  }
 async verificarDisponibilidad(data: {
    id_cancha: number;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
  }): Promise<boolean> {
    const reservasSolapadas = await AppDataSource.getRepository(Reserva)
      .createQueryBuilder('reserva')
      .where('reserva.id_cancha = :id_cancha', { id_cancha: data.id_cancha })
      .andWhere('reserva.fecha = :fecha', { fecha: data.fecha })
      .andWhere('reserva.hora_inicio < :hora_fin', { hora_fin: data.hora_fin })
      .andWhere('reserva.hora_fin > :hora_inicio', { hora_inicio: data.hora_inicio })
      .getCount();

    return reservasSolapadas === 0;
  }

  //  reservas por usuario
  async obtenerPorUsuario(id_usuario: number): Promise<any[]> {
    const reservas = await this.repository.findByUsuario(id_usuario);

    const idsCancha = [...new Set(reservas.map((r) => r.id_cancha))];
    const canchas = idsCancha.length
      ? await this.canchaRepository.find({
          where: { id_cancha: In(idsCancha) },
          relations: ['tipo_cancha'],
        })
      : [];

    const canchasMap = new Map(canchas.map((c) => [c.id_cancha, c]));

    const reservasCompletas = await Promise.all(
      reservas.map(async (reserva) => {
        const servicios = await this.repository.findServiciosByReserva(reserva.id_reserva);
        const cancha = canchasMap.get(reserva.id_cancha);
        
        return {
          ...reserva,
          cancha_nombre: cancha?.nombre,
          deporte: cancha?.tipo_cancha?.deporte,
          tipo_cancha: cancha?.tipo_cancha?.nombre,
          servicios: servicios.map(s => s.nombre)
        };
      })
    );
    
    return reservasCompletas;
  }

  // reseñas

  // puntuar una reserva ya jugada
  async registrarResena(
    id_reserva: number,
    user: { id_usuario: number; rol: string },
    data: { puntaje: number; resena?: string }
  ): Promise<Reserva> {
    const repo = AppDataSource.getRepository(Reserva);
    const reserva = await repo.findOne({ where: { id_reserva } });
    if (!reserva) throw new ErrorHttp(404, 'Reserva no encontrada');

    if (user.rol !== 'administrador' && reserva.id_usuario !== user.id_usuario) {
      throw new ErrorHttp(403, 'Solo podés reseñar tus propias reservas');
    }

    const puntaje = Number(data.puntaje);
    if (!Number.isInteger(puntaje) || puntaje < 1 || puntaje > 5) {
      throw new ErrorHttp(400, 'El puntaje debe ser un entero entre 1 y 5');
    }

    const resena = (data.resena ?? '').trim();
    if (resena.length > 500) {
      throw new ErrorHttp(400, 'La reseña no puede superar los 500 caracteres');
    }

    const fin = new Date(`${reserva.fecha}T${reserva.hora_fin}`);
    if (fin.getTime() > Date.now()) {
      throw new ErrorHttp(400, 'Solo podés reseñar una reserva una vez que ya se jugó');
    }

    reserva.puntaje = puntaje;
    reserva.resena = resena || null;
    return repo.save(reserva);
  }

  async eliminarResena(id_reserva: number): Promise<void> {
    const repo = AppDataSource.getRepository(Reserva);
    const reserva = await repo.findOne({ where: { id_reserva } });
    if (!reserva) throw new ErrorHttp(404, 'Reserva no encontrada');
    reserva.puntaje = null;
    reserva.resena = null;
    await repo.save(reserva);
  }

  // listado de reseñas con promedio
  async obtenerResenas() {
    const reservas = await AppDataSource.getRepository(Reserva)
      .createQueryBuilder('reserva')
      .where('reserva.puntaje IS NOT NULL')
      .orderBy('reserva.fecha', 'DESC')
      .addOrderBy('reserva.hora_inicio', 'DESC')
      .getMany();

    const idsUsuario = [...new Set(reservas.map((r) => r.id_usuario))];
    const idsCancha = [...new Set(reservas.map((r) => r.id_cancha))];
    const usuarios = idsUsuario.length ? await this.usuarioRepository.find({ where: { id_usuario: In(idsUsuario) } }) : [];
    const canchas = idsCancha.length ? await this.canchaRepository.find({ where: { id_cancha: In(idsCancha) } }) : [];
    const usuariosMap = new Map(usuarios.map((u) => [u.id_usuario, u]));
    const canchasMap = new Map(canchas.map((c) => [c.id_cancha, c]));

    const resenas = reservas.map((r) => {
      const u = usuariosMap.get(r.id_usuario);
      return {
        id_reserva: r.id_reserva,
        id_usuario: r.id_usuario,
        usuario_nombre: u ? `${u.nombre} ${u.apellido}` : `Usuario ${r.id_usuario}`,
        id_cancha: r.id_cancha,
        cancha_nombre: canchasMap.get(r.id_cancha)?.nombre ?? `Cancha ${r.id_cancha}`,
        fecha: r.fecha,
        puntaje: r.puntaje,
        resena: r.resena,
      };
    });

    const total = resenas.length;
    const promedio = total ? Number((resenas.reduce((a, r) => a + (r.puntaje ?? 0), 0) / total).toFixed(2)) : 0;
    return { total, promedio, resenas };
  }

//para modificar pagos pendientes
  async puedeModificar(id_reserva: number): Promise<boolean> {
    const pago = await this.pagoRepository.findOne({
      where: { id_reserva },
      order: { id_pago: 'DESC' },
    });

    // si no hay pago o el pago está pendiente, se puede modificar
    return !pago || pago.estado === 'pendiente';
  }
}

// error con status http
export class ErrorHttp extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
