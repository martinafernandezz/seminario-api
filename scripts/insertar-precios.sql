-- ═══════════════════════════════════════════════════════════
-- SCRIPT: Insertar precios para todas las canchas
-- ═══════════════════════════════════════════════════════════
-- Este script agrega precios automáticamente basándose en el tipo de cancha
-- Solo inserta si NO existe un precio ya cargado

USE tp;

-- Insertar precios automáticamente según el tipo de cancha
INSERT IGNORE INTO precio (id_cancha, valor_por_hora, fecha_vigencia) 
SELECT 
    c.id_cancha, 
    CASE 
        WHEN tc.nombre LIKE '%F5%' OR tc.nombre LIKE '%Fútbol 5%' THEN 8000.00
        WHEN tc.nombre LIKE '%F7%' OR tc.nombre LIKE '%Fútbol 7%' THEN 10000.00
        WHEN tc.nombre LIKE '%F11%' OR tc.nombre LIKE '%Fútbol 11%' THEN 15000.00
        WHEN tc.nombre LIKE '%Tenis%' THEN 6000.00
        WHEN tc.nombre LIKE '%Paddle%' OR tc.nombre LIKE '%Pádel%' THEN 6000.00
        WHEN tc.nombre LIKE '%Basket%' OR tc.nombre LIKE '%Básquet%' THEN 7000.00
        WHEN tc.nombre LIKE '%Voley%' OR tc.nombre LIKE '%Vóley%' THEN 5000.00
        ELSE 8000.00  -- Precio por defecto
    END as valor_por_hora,
    '2026-01-01' as fecha_vigencia
FROM cancha c
JOIN tipocancha tc ON c.id_tipo = tc.id_tipo
WHERE NOT EXISTS (
    SELECT 1 FROM precio p WHERE p.id_cancha = c.id_cancha
);

-- Verificar los precios insertados
SELECT 
    c.id_cancha,
    c.nombre AS cancha,
    tc.nombre AS tipo,
    p.valor_por_hora,
    p.fecha_vigencia
FROM cancha c
JOIN tipocancha tc ON c.id_tipo = tc.id_tipo
LEFT JOIN precio p ON c.id_cancha = p.id_cancha
ORDER BY c.id_cancha;

-- Mensaje de confirmación
SELECT 
    COUNT(*) as total_canchas,
    (SELECT COUNT(*) FROM precio) as total_precios
FROM cancha;
