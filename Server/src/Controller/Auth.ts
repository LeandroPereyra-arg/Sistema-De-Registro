
import {sql,poolPromise} from '../Config/supabase'
import {Response,Request} from 'express'
import bcrypt from 'bcrypt'
import jwt, { SignOptions } from 'jsonwebtoken'
import { Usuario, TokenPayload } from '../Interface/Tabla'

const SALT_ROUNDS = 10;

// --->Funcion de Registro de Usuarios

export async function RegistrarUsuario(req:Request,res:Response){
    try{
        const {usuario,email,password}=req.body;
        if(!usuario || !email || !password){
            return res.status(400).json({Mensaje: 'Debe Completar Usuario, Email y Contraseña para continuar'})
        }
        if(String(password).length < 6){
            return res.status(400).json({Mensaje: 'La Contraseña debe tener al menos 6 caracteres'})
        }
        const pool= await poolPromise;

        // --> Verificamos que el usuario o email no existan
        const Existe=await pool.request()
        .input('usuario',sql.VarChar,usuario)
        .input('email',sql.VarChar,email)
        .query('SELECT id FROM Usuarios WHERE usuario=@usuario OR email=@email')

        if(Existe.recordset.length > 0){
            return res.status(409).json({error:'El Usuario o Email ya se encuentra registrado'})
        }

        // --> Guardamos la contraseña hasheada, nunca en texto plano
        const hash=await bcrypt.hash(password,SALT_ROUNDS);

        await pool.request()
        .input('usuario',sql.VarChar,usuario)
        .input('email',sql.VarChar,email)
        .input('password',sql.VarChar,hash)
        .query('INSERT INTO Usuarios (usuario,email,password)VALUES(@usuario,@email,@password)')

        return res.status(201).json({Mensaje:'Usuario Registrado ✅'})
    }
    catch(error){
        console.error('No se logro registrar el Usuario',error)
        return res.status(500).json({error:'Error al Cargar la Base de Datos'})
    }
}


// --->Funcion de Login

export async function Login(req:Request,res:Response){
    try{
        // --> Se puede ingresar con usuario o email
        const {usuario,password}=req.body;
        if(!usuario || !password){
            return res.status(400).json({Mensaje: 'Debe Completar Usuario y Contraseña para continuar'})
        }

        const secret=process.env.JWT_SECRET;
        if(!secret){
            console.error('Falta JWT_SECRET en el .env')
            return res.status(500).json({error:'Error de configuracion del Servidor'})
        }

        const pool= await poolPromise;
        const Resultado=await pool.request()
        .input('usuario',sql.VarChar,usuario)
        .query<Usuario>('SELECT id,usuario,email,password,rol FROM Usuarios WHERE usuario=@usuario OR email=@usuario')

        const User=Resultado.recordset[0];

        // --> Mismo mensaje para usuario inexistente o contraseña incorrecta
        if(!User || !(await bcrypt.compare(password,User.password))){
            return res.status(401).json({error:'Usuario o Contraseña Incorrectos'})
        }

        const payload:TokenPayload={id:User.id,usuario:User.usuario,rol:User.rol};
        const token=jwt.sign(payload,secret,{
            expiresIn:(process.env.JWT_EXPIRES || '8h') as SignOptions['expiresIn']
        });

        return res.status(200).json({
            Mensaje:'Login Exitoso ✅',
            token,
            usuario:{id:User.id,usuario:User.usuario,email:User.email,rol:User.rol}
        })
    }
    catch(error){
        console.error('No se logro iniciar sesion',error)
        return res.status(500).json({error:'Error al Cargar la Base de Datos'})
    }
}


// --->Devuelve el usuario del Token (para verificar la sesion)

export async function Perfil(req:Request,res:Response){
    return res.status(200).json({usuario:req.usuario})
}
