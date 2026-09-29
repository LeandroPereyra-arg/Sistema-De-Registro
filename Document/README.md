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
