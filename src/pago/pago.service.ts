import { PagoRepository } from './pago.repository.js';
import { Pago, PagoCreate, PagoUpdate } from './pago.entity.js';

export class PagoService {
  constructor(private repository: PagoRepository) {}

  async crearPago(data: PagoCreate): Promise<Pago> {
    // Verificar que no exista ya un pago para esta reserva
    const pagoExistente = await this.repository.findByReserva(data.id_reserva);
    if (pagoExistente) {
      throw new Error('Ya existe un pago para esta reserva');
    }

    return this.repository.create(data);
  }

  async obtenerPago(id_pago: number): Promise<Pago> {
    const pago = await this.repository.findById(id_pago);
    if (!pago) throw new Error('Pago no encontrado');
    return pago;
  }

  async obtenerPagoPorReserva(id_reserva: number): Promise<Pago | null> {
    return this.repository.findByReserva(id_reserva);
  }

  async procesarPago(id_pago: number, transaccion_id: string): Promise<Pago> {
    const pago = await this.repository.update(id_pago, {
      estado: 'completado',
      transaccion_id
    });
    if (!pago) throw new Error('Pago no encontrado');
    return pago;
  }

  async fallarPago(id_pago: number): Promise<Pago> {
    const pago = await this.repository.update(id_pago, {
      estado: 'fallido'
    });
    if (!pago) throw new Error('Pago no encontrado');
    return pago;
  }

  async simularProcesoPago(id_pago: number): Promise<Pago> {
    // Simular proceso de pago (3 segundos de delay)
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          // 80% de probabilidad de éxito, 20% de fallo
          const exito = Math.random() > 0.2;
          
          if (exito) {
            const transaccion_id = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const pago = await this.repository.update(id_pago, {
              estado: 'completado',
              transaccion_id
            });
            if (!pago) reject(new Error('Pago no encontrado'));
            else resolve(pago);
          } else {
            const pago = await this.repository.update(id_pago, {
              estado: 'fallido'
            });
            if (!pago) reject(new Error('Pago no encontrado'));
            else resolve(pago);
          }
        } catch (error) {
          reject(error);
        }
      }, 3000);
    });
  }
}