import { useEffect, useState } from 'react'
import ProductoCard from './ProductoCard'
import ProductoForm from './ProductoForm'
import {
  eliminarProducto,
  listarProductos,
  modificarProducto,
  registrarProducto,
  type Producto,
  type ProductoDatos,
} from '../services/productos'

function Productos() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [editando, setEditando] = useState<Producto | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)

  function cargar() {
    return listarProductos()
      .then((lista) => {
        setProductos(lista)
        setError(null)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error inesperado'))
      .finally(() => setCargando(false))
  }

  useEffect(() => {
    cargar()
  }, [])

  async function guardar(datos: ProductoDatos) {
    if (editando) {
      await modificarProducto(editando.id, datos)
      setEditando(null)
    } else {
      await registrarProducto(datos)
    }
    await cargar()
  }

  async function eliminar(producto: Producto) {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"?`)) return
    try {
      await eliminarProducto(producto.id)
      if (editando?.id === producto.id) setEditando(null)
      await cargar()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    }
  }

  return (
    <section className="productos">
      <ProductoForm
        key={editando?.id ?? 'nuevo'}
        producto={editando}
        onGuardar={guardar}
        onCancelar={editando ? () => setEditando(null) : undefined}
      />

      <div>
        {error && <p className="form-error" role="alert">{error}</p>}
        {cargando ? (
          <p>Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p>No hay productos cargados.</p>
        ) : (
          <div className="productos-grilla">
            {productos.map((p) => (
              <ProductoCard key={p.id} producto={p} onModificar={setEditando} onEliminar={eliminar} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Productos
