

export interface Productos{
    id:number,
    codigo:string,
    nombre:string,
    descripcion:string,
    talle:string,
    precio:number,
    stock:number,
    imagen:string
}

export interface Usuario{
    id:number,
    usuario:string,
    email:string,
    password:string,
    rol:string
}

// --> Datos que se guardan dentro del Token
export interface TokenPayload{
    id:number,
    usuario:string,
    rol:string
}
