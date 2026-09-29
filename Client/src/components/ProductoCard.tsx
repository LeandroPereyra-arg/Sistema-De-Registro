import type { Producto } from '../services/productos'

interface Props {
  producto: Producto
  onModificar: (producto: Producto) => void
  onEliminar: (producto: Producto) => void
}

const moneda = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })

function ProductoCard({ producto, onModificar, onEliminar }: Props) {
  const { nombre, codigo, descripcion, talle, precio, stock, imagen } = producto
  const sinStock = stock <= 0

  return (
    <article className="producto-card" aria-label={nombre}>
      <div className="producto-card-imagen">
        {imagen ? <img src={imagen} alt={nombre} /> : <span>Sin imagen</span>}
      </div>

      <div className="producto-card-cuerpo">
        <p className="producto-card-codigo">{codigo}</p>
        <h3>{nombre}</h3>
        {descripcion && <p className="producto-card-descripcion">{descripcion}</p>}

        <div className="producto-card-datos">
          <span className="producto-card-precio">{moneda.format(precio)}</span>
          {talle && <span className="producto-card-talle">Talle {talle}</span>}
        </div>

        <p className={sinStock ? 'producto-card-stock agotado' : 'producto-card-stock'}>
          {sinStock ? 'Sin stock' : `Stock: ${stock}`}
        </p>

        <div className="producto-card-acciones">
          <button type="button" className="secundario" onClick={() => onModificar(producto)}>
            Modificar
          </button>
          <button type="button" className="peligro" onClick={() => onEliminar(producto)}>
            Eliminar
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductoCard
