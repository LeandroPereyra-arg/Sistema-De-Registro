import {Response,Request,NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import { TokenPayload } from '../Interface/Tabla'

// --> Agregamos "usuario" al Request de Express
declare global{
    namespace Express{
        interface Request{
            usuario?:TokenPayload
        }
    }
}

// --->Verifica el Token enviado en el header: Authorization: Bearer <token>

export function VerificarToken(req:Request,res:Response,next:NextFunction){
    const header=req.headers.authorization;
    if(!header || !header.startsWith('Bearer ')){
        return res.status(401).json({error:'Debe Iniciar Sesion para continuar'})
    }

    const secret=process.env.JWT_SECRET;
    if(!secret){
        console.error('Falta JWT_SECRET en el .env')
        return res.status(500).json({error:'Error de configuracion del Servidor'})
    }

    try{
        const token=header.slice(7);
        req.usuario=jwt.verify(token,secret) as TokenPayload;
        next();
    }
    catch(error){
        return res.status(401).json({error:'Token Invalido o Expirado'})
    }
}
