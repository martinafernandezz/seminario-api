import { Router, Request, Response } from 'express';
import { AppDataSource } from '../database/data-source.js';
import { TurnoFijo } from './turno-fijo.entity.js';
import { Reserva } from '../reserva/reserva.entity.js';

const router = Router();
const repo = () => AppDataSource.getRepository(TurnoFijo);

const FECHA = /^\d{4}-\d{2}-\d{2}$/;

function validar(body: any): string | null {
  const { fecha_desde, fecha_hasta } = body ?? {};
  if (!FECHA.test(String(fecha_desde)) || !FECHA.test(String(fecha_hasta))) {
    return 'fecha_desde y fecha_hasta son obligatorias (YYYY-MM-DD)';
  }
  if (fecha_hasta < fecha_desde) return 'fecha_hasta no puede ser anterior a fecha_desde';
  return null;
}

// turnos fijos con cantidad de reservas
router.get('/', async (_req: Request, res: Response) => {
  try {
    const turnos = await repo().find({ order: { fecha_desde: 'DESC' } });
    const conteos = await AppDataSource.getRepository(Reserva)
      .createQueryBuilder('r')
      .select('r.id_turno_fijo', 'id')
      .addSelect('COUNT(*)', 'total')
      .where('r.id_turno_fijo IS NOT NULL')
      .groupBy('r.id_turno_fijo')
      .getRawMany();
    const mapa = new Map(conteos.map((c) => [Number(c.id), Number(c.total)]));
    res.json({
      success: true,
      data: turnos.map((t) => ({ ...t, total_reservas: mapa.get(t.id_turno_fijo) ?? 0 })),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const turno = await repo().findOne({ where: { id_turno_fijo: Number(req.params.id) } });
  if (!turno) return res.status(404).json({ success: false, message: 'Turno fijo no encontrado' });
  res.json({ success: true, data: turno });
});

router.post('/', async (req: Request, res: Response) => {
  const error = validar(req.body);
  if (error) return res.status(400).json({ success: false, message: error });
  const turno = await repo().save(
    repo().create({ fecha_desde: req.body.fecha_desde, fecha_hasta: req.body.fecha_hasta })
  );
  res.status(201).json({ success: true, data: turno });
});

router.put('/:id', async (req: Request, res: Response) => {
  const error = validar(req.body);
  if (error) return res.status(400).json({ success: false, message: error });
  const id_turno_fijo = Number(req.params.id);
  const turno = await repo().findOne({ where: { id_turno_fijo } });
  if (!turno) return res.status(404).json({ success: false, message: 'Turno fijo no encontrado' });
  turno.fecha_desde = req.body.fecha_desde;
  turno.fecha_hasta = req.body.fecha_hasta;
  res.json({ success: true, data: await repo().save(turno) });
});

// las reservas quedan sin turno fijo
router.delete('/:id', async (req: Request, res: Response) => {
  const result = await repo().delete({ id_turno_fijo: Number(req.params.id) });
  if (!result.affected) return res.status(404).json({ success: false, message: 'Turno fijo no encontrado' });
  res.json({ success: true, message: 'Turno fijo eliminado' });
});

export default router;
