import { Router } from "express";
import {RegistrarUsuario,Login,Perfil}from '../Controller/Auth'
import { VerificarToken } from "../Middleware/Auth";

const RutasAuth=Router()

RutasAuth.post('/Auth/Registrar',RegistrarUsuario)
RutasAuth.post('/Auth/Login',Login)
RutasAuth.get('/Auth/Perfil',VerificarToken,Perfil)


export default RutasAuth
