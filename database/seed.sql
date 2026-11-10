-- datos iniciales


INSERT INTO tipo_cancha (nombre, deporte) VALUES
  ('Fútbol 5',  'Fútbol'),
  ('Fútbol 7',  'Fútbol'),
  ('Fútbol 11', 'Fútbol'),
  ('Tenis',     'Tenis'),
  ('Paddle',    'Paddle'),
  ('Básquet',   'Básquet');

INSERT INTO cancha (id_tipo, nombre, estado) VALUES
  (1, 'Cancha A - F5',      'disponible'),
  (2, 'Cancha B - F7',      'disponible'),
  (3, 'Cancha C - F11',     'disponible'),
  (4, 'Cancha D - Tenis',   'disponible'),
  (5, 'Cancha E - Paddle',  'mantenimiento'),
  (6, 'Cancha F - Básquet', 'disponible');

INSERT INTO precio (id_cancha, fecha_vigencia, precio_por_hora)
SELECT c.id_cancha, DATE '2020-01-01',
  CASE t.nombre
    WHEN 'Fútbol 5'  THEN 8000.00
    WHEN 'Fútbol 7'  THEN 10000.00
    WHEN 'Fútbol 11' THEN 15000.00
    WHEN 'Tenis'     THEN 6000.00
    WHEN 'Paddle'    THEN 6000.00
    WHEN 'Básquet'   THEN 7000.00
    ELSE 8000.00
  END
FROM cancha c JOIN tipo_cancha t ON t.id_tipo = c.id_tipo;
