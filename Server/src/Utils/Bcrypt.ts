import bcrypt from 'bcrypt'

// --> Cantidad de rondas del algoritmo (a mayor numero, mas seguro pero mas lento)
const SALT_ROUNDS = 10;


// --->Hasheo de Contraseña
// Genera un salt aleatorio y devuelve el hash que se guarda en la base de datos.
// La contraseña original nunca se almacena.

export async function HashearPassword(password:string):Promise<string>{
    return bcrypt.hash(password,SALT_ROUNDS);
}


// --->Verificacion de Contraseña
// Compara la contraseña ingresada en el Login contra el hash guardado.
// bcrypt lee el salt que viene dentro del hash, por eso no hace falta guardarlo aparte.

export async function VerificarPassword(password:string,hash:string):Promise<boolean>{
    return bcrypt.compare(password,hash);
}
