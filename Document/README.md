# Document - Tests del Sistema de Registro

## Backend (`Document/Backend`) - Jest + Supertest

| Archivo | Qué prueba |
|---|---|
| `ModificarProducto.test.ts` | Controlador `ModificarProducto`: modificación correcta (201), parámetros enviados a la BD, valores por defecto, producto inexistente (404), falta de Código/Nombre/ID (400) y error de BD (500). |
| `EliminarProducto.test.ts` | Controlador `EliminarProducto`: eliminación correcta (201), `DELETE` filtrado por id, producto inexistente (404), falta de ID (400) y error de BD (500). |
| `RutasProductos.test.ts` | Rutas `PUT /api/Modificar/:id` y `DELETE /api/Eliminar/:id` completas, incluyendo el middleware de Token (401 sin Token o con Token inválido). |

La conexión a SQL Server se simula (mock), no hace falta tener la base de datos levantada.

```bash
cd Server
npm install
npm test
```

## Frontend (`Document/Frontend`) - Vitest + Testing Library

| Archivo | Qué prueba |
|---|---|
| `ProductoForm.test.tsx` | Formulario de Productos en modo Registrar y Modificar: carga de datos, validaciones, valores por defecto, errores del Servidor y botón Cancelar. |
| `ProductoCard.test.tsx` | Tarjeta de Producto: datos mostrados, imagen / "Sin imagen", "Sin stock" y botones Modificar / Eliminar. |

```bash
cd Client
npm install
npm test
```

## Postman (`Document/Postman`) - Tests de la API

| Archivo | Qué es |
|---|---|
| `Sistema-De-Registro.postman_collection.json` | Colección con 25 requests y 94 tests automáticos. |
| `Local.postman_environment.json` | Entorno con `baseUrl = http://localhost:3000`. |

La colección tiene 4 carpetas que se ejecutan en orden:

1. **Auth**: Registrar usuario (OK, duplicado 409, faltan datos 400, contraseña corta 400), Login (incorrecto 401, faltan datos 400, OK, con Email) y Perfil (con y sin Token).
   El Login guarda el Token en la variable `{{token}}`, que se envía solo en las rutas protegidas.
2. **Productos**: Registrar (sin Token 401, faltan datos 400, OK 201) y Listar, que guarda el id del producto creado en `{{productoId}}`.
3. **Modificar Producto**: sin Token 401, Token inválido 401, faltan datos 400, inexistente 404, OK 201 y Listar para verificar los cambios.
4. **Eliminar Producto**: sin Token 401, inexistente 404, OK 201, ya eliminado 404 y Listar para verificar que no está más.

Cada corrida crea un usuario y un producto con nombre único (`postman_<fecha>`, `PM-<fecha>`), así que se puede repetir sin borrar la base.

### Cómo ejecutarla

1. Levantar el Server con la base de datos: `cd Server && npm run dev`.
2. En Postman: **Import** → seleccionar los dos archivos `.json` de `Document/Postman`.
3. Elegir el entorno **Sistema de Registro - Local** (arriba a la derecha).
4. Clic derecho en la colección → **Run collection** → **Run**. Se ven los 94 tests en verde.

También se puede correr por consola con Newman:

```bash
npx newman run Document/Postman/Sistema-De-Registro.postman_collection.json -e Document/Postman/Local.postman_environment.json
```
