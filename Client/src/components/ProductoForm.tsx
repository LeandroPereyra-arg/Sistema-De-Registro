import { useState, type FormEvent } from 'react'
import type { Producto, ProductoDatos } from '../services/productos'

interface Props {
  // --> Si se pasa un producto, el formulario funciona en modo Modificar
  producto?: Producto | null
  onGuardar: (datos: ProductoDatos) => Promise<void>
  onCancelar?: () => void
}

const VACIO = { codigo: '', nombre: '', descripcion: '', talle: '', precio: '', stock: '', imagen: '' }

function inicial(producto?: Producto | null) {
  if (!producto) return VACIO
  return {
    codigo: producto.codigo,
    nombre: producto.nombre,
    descripcion: producto.descripcion ?? '',
    talle: producto.talle ?? '',
    precio: String(producto.precio),
    stock: String(producto.stock),
    imagen: producto.imagen ?? '',
  }
}

function ProductoForm({ producto, onGuardar, onCancelar }: Props) {
  const [campos, setCampos] = useState(() => inicial(producto))
  const [error, setError] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)
  const modificando = Boolean(producto)

  function cambiar(campo: keyof typeof VACIO, valor: string) {
    setCampos((prev) => ({ ...prev, [campo]: valor }))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const codigo = campos.codigo.trim()
    const nombre = campos.nombre.trim()
    if (!codigo || !nombre) {
      setError('Debe Completar los campos de Codigo y Nombre')
      return
    }

    const precio = campos.precio === '' ? 0 : Number(campos.precio)
    const stock = campos.stock === '' ? 0 : Number(campos.stock)
    if (Number.isNaN(precio) || precio < 0) {
      setError('El Precio debe ser un número mayor o igual a 0')
      return
    }
    if (!Number.isInteger(stock) || stock < 0) {
      setError('El Stock debe ser un número entero mayor o igual a 0')
      return
    }

    setGuardando(true)
    try {
      await onGuardar({
        codigo,
        nombre,
        descripcion: campos.descripcion.trim() || null,
        talle: campos.talle.trim() || null,
        precio,
        stock,
        imagen: campos.imagen.trim() || null,
      })
      if (!modificando) setCampos(VACIO)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form className="producto-form" onSubmit={handleSubmit} noValidate aria-label="Formulario de Producto">
      <h2>{modificando ? 'Modificar Producto' : 'Nuevo Producto'}</h2>

      <label htmlFor="codigo">Código *</label>
      <input id="codigo" value={campos.codigo} onChange={(e) => cambiar('codigo', e.target.value)} />

      <label htmlFor="nombre">Nombre *</label>
      <input id="nombre" value={campos.nombre} onChange={(e) => cambiar('nombre', e.target.value)} />

      <label htmlFor="descripcion">Descripción</label>
      <textarea
        id="descripcion"
        rows={3}
        value={campos.descripcion}
        onChange={(e) => cambiar('descripcion', e.target.value)}
      />

      <div className="producto-form-fila">
        <div>
          <label htmlFor="talle">Talle</label>
          <input id="talle" value={campos.talle} onChange={(e) => cambiar('talle', e.target.value)} />
        </div>
        <div>
          <label htmlFor="precio">Precio</label>
          <input
            id="precio"
            type="number"
            min="0"
            step="0.01"
            value={campos.precio}
            onChange={(e) => cambiar('precio', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="stock">Stock</label>
          <input
            id="stock"
            type="number"
            min="0"
            step="1"
            value={campos.stock}
            onChange={(e) => cambiar('stock', e.target.value)}
          />
        </div>
      </div>

      <label htmlFor="imagen">URL de la Imagen</label>
      <input id="imagen" type="url" value={campos.imagen} onChange={(e) => cambiar('imagen', e.target.value)} />

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="producto-form-acciones">
        {onCancelar && (
          <button type="button" className="secundario" onClick={onCancelar}>
            Cancelar
          </button>
        )}
        <button type="submit" disabled={guardando}>
          {guardando ? 'Guardando...' : modificando ? 'Guardar Cambios' : 'Registrar Producto'}
        </button>
      </div>
    </form>
  )
}

export default ProductoForm
