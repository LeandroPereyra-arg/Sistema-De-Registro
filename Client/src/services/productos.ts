import { authHeader } from './auth'

export interface Producto {
  id: number
  codigo: string
  nombre: string
  descripcion: string | null
  talle: string | null
  precio: number
  stock: number
  imagen: string | null
}

// --> Datos que se envian al Server (el id va en la URL)
export type ProductoDatos = Omit<Producto, 'id'>

async function enviar(url: string, init: RequestInit): Promise<unknown> {
  const res = await fetch(url, init)
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.error || data.Mensaje || 'Error al comunicarse con el Servidor')
  }
  return data
}

export async function listarProductos(): Promise<Producto[]> {
  return (await enviar('/api/Productos', { method: 'GET' })) as Producto[]
}

export async function registrarProducto(producto: ProductoDatos): Promise<void> {
  await enviar('/api/Registrar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(producto),
  })
}

export async function modificarProducto(id: number, producto: ProductoDatos): Promise<void> {
  await enviar(`/api/Modificar/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(producto),
  })
}

export async function eliminarProducto(id: number): Promise<void> {
  await enviar(`/api/Eliminar/${id}`, {
    method: 'DELETE',
    headers: authHeader(),
  })
}
