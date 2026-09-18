# Caso de Uso: Registrar Producto

**Diagramas**

- PDF listo para entregar: [`Caso-de-Uso-Registrar-Producto.pdf`](./Caso-de-Uso-Registrar-Producto.pdf)
  (hoja 1: diagrama de casos de uso · hoja 2: diagrama de secuencia).
- Editable draw.io: [`Caso-de-Uso-Registrar-Producto.drawio`](./Caso-de-Uso-Registrar-Producto.drawio)
  (abrir en <https://app.diagrams.net>; mismas 2 hojas).
- Fuente del PDF: [`Caso-de-Uso-Registrar-Producto.html`](./Caso-de-Uso-Registrar-Producto.html)
  (se imprime a PDF desde el navegador: A4 horizontal, sin encabezados).

| | |
|---|---|
| **Actor** | Admin (usuario logueado) |
| **Objetivo** | Dar de alta un producto en la tabla `Tarjetas` |
| **Precondición** | El Admin inició sesión y el navegador guardó el token JWT (`localStorage`) |
| **Postcondición** | El producto queda registrado en la base de datos |
| **Endpoint** | `POST /api/Registrar` (protegido por `VerificarToken`) |

## Flujo Normal

1. El Admin completa el formulario y presiona **Guardar**.
2. El Frontend (`Client/src/components`) envía `POST /api/Registrar` con
   `{ codigo, nombre, descripcion, talle, precio, stock, imagen }` y el header
   `Authorization: Bearer <token>`.
3. El middleware `VerificarToken` (`Server/src/Middleware/Auth.ts`) valida el token y llama a `next()`.
4. El router (`Server/src/Router/Productos.route.ts`) invoca `RegistrarProductos(req, res)`.
5. El controlador (`Server/src/Controller/Productos.ts`) ejecuta el `INSERT INTO Tarjetas`
   con los parámetros `@codigo, @nombre, @descripcion, @talle, @precio, @stock, @imagen`.
6. SQL Server confirma la inserción.
7. El backend responde **201** `{ Mensaje: 'Producto Registrado' }`.
8. El Frontend muestra el mensaje de éxito y limpia el formulario.

## Flujos Alternativos

| # | Condición | Respuesta |
|---|---|---|
| A1 | Token ausente, inválido o expirado | **401** `{ error: 'Token Invalido o Expirado' }` (o `'Debe Iniciar Sesion para continuar'`) |
| A2 | Falta `codigo` o `nombre` | **400** `{ Mensaje: 'Debe Completar los campos de Codigo y Nombre para continuar' }` |
| A3 | Error al conectar o escribir en la base de datos | **500** `{ error: 'Error al Cargar la Base de Datos' }` |

En los tres casos no se registra el producto y el Frontend muestra el mensaje de error recibido.

## Nota sobre los componentes

Los nombres del backend son los reales del repositorio (`Server/src/Router/Productos.route.ts`,
`Server/src/Middleware/Auth.ts`, `Server/src/Controller/Productos.ts` → `RegistrarProductos()`,
`Server/src/Config/supabase.TS` con `mssql`).
Del lado del Cliente hoy **solo existe `Client/src/components/Login.tsx`**: el componente
`Productos.tsx` del diagrama es el que falta crear para consumir `POST /api/Registrar`.
El token ya lo resuelve `Client/src/services/auth.ts` con `authHeader()`.
