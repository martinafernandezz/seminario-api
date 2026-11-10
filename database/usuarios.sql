
-- las claves estan hasheadas 

--   admin:   martina        / martina123
--   cliente: marticliente   / martina123

INSERT INTO usuario (nombre, apellido, dni, username, password, mail, telefono, rol, estado) VALUES
  ('Martina', 'Admin',   10000001, 'martina',
   '$2b$10$7PMcu8vtiPqZxgFUTedjfOUvEQ38oTywC8m4Oqsw4R9Ed.D4Uz22y',
   'martina@olimpo.com', NULL, 'administrador', 'activo'),
  ('Martina', 'Cliente', 10000002, 'marticliente',
   '$2b$10$HHIMRkwLij4wcv1pxBozMez1y29BR5YVY5.Bwal.N1wAWjD8DHmy6',
   'marticliente@olimpo.com', NULL, 'cliente', 'activo');


   --- hasta el momento no resolvi el error del registrar, sino se pueden registrar metan 
   --- sus usuarios por bd

