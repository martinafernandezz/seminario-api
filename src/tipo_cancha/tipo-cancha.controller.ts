import { Request, Response } from 'express';
import { TipoCanchaService } from './tipo-cancha.service.js';
import { TipoCanchaRepository } from './tipo-cancha.repository.js';

const repository = new TipoCanchaRepository();
const service = new TipoCanchaService(repository);

export async function obtenerTodos(req: Request, res: Response) {
  try {
    const tipos = await service.obtenerTodos();
    res.json({ success: true, data: tipos });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function obtenerPorId(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const tipo = await service.obtenerPorId(id);
    res.json({ success: true, data: tipo });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
}

export async function crear(req: Request, res: Response) {
  try {
    const nuevoTipo = await service.crearTipoCancha(req.body);
    res.status(201).json({ success: true, data: nuevoTipo });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function actualizar(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const tipoActualizado = await service.actualizarTipoCancha(id, req.body);
    res.json({ success: true, data: tipoActualizado });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
}

export async function eliminar(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    await service.eliminarTipoCancha(id);
    res.json({ success: true, message: 'Tipo de cancha eliminado' });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
}