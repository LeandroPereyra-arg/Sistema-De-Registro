import { Router } from "express";
import {ListarProductos,RegistrarProductos,ModificarProducto,EliminarProducto}from '../Controller/Productos'
import { VerificarToken } from "../Middleware/Auth";

const Rutas=Router()

// --> Cualquier usuario puede ver los productos
Rutas.get('/Productos',ListarProductos)

// --> Solo usuarios logueados pueden modificar productos
Rutas.post('/Registrar',VerificarToken,RegistrarProductos)
Rutas.put('/Modificar/:id',VerificarToken,ModificarProducto)
Rutas.delete('/Eliminar/:id',VerificarToken,EliminarProducto)


export default Rutas
