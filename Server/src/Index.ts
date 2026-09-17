import express from 'express';
import dotenv from 'dotenv';
import Rutas from './Router/Productos.route'
import RutasAuth from './Router/Auth.route'
// Carga las variables de entorno del .env
dotenv.config();

// Crea la aplicacion Express
const app = express();

// Middleware para leer JSON en el body de las peticiones
app.use(express.json());

// Configura el puerto (del .env o 3000 por defecto)
const PORT = parseInt(process.env.PORT || '3000', 10);


app.use('/api',RutasAuth)
app.use('/api',Rutas)

// Levanta el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});