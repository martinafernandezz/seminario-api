import { ReservaServicioRepository } from './reserva-servicio.repository.js';
import { ReservaServicioCreate } from './reserva-servicio.entity.js';

export class ReservaServicioService {
  private repository: ReservaServicioRepository;

  constructor() {
    this.repository = new ReservaServicioRepository();
  }

  async agregarServicioAReserva(data: ReservaServicioCreate) {
    await this.repository.agregar(data);
    return { success: true, message: 'Servicio agregado a la reserva correctamente' };
  }

  async eliminarServicioDeReserva(id_reserva: number, id_servicio: number) {
    await this.repository.eliminar(id_reserva, id_servicio);
    return { success: true, message: 'Servicio eliminado de la reserva correctamente' };
  }

  async obtenerServiciosDeReserva(id_reserva: number) {
    return this.repository.obtenerPorReserva(id_reserva);
  }

  async eliminarTodosLosServicios(id_reserva: number) {
    await this.repository.eliminarTodosPorReserva(id_reserva);
    return { success: true, message: 'Todos los servicios de la reserva fueron eliminados' };
  }
}
