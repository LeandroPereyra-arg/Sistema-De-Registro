import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
import ProductoCard from '../../Client/src/components/ProductoCard'
import type { Producto } from '../../Client/src/services/productos'

const producto: Producto = {
  id: 7,
  codigo: 'REM-001',
  nombre: 'Remera Oversize',
  descripcion: 'Remera de algodon peinado',
  talle: 'M',
  precio: 15000,
  stock: 10,
  imagen: 'https://ejemplo.com/remera.png',
}

function renderCard(datos: Partial<Producto> = {}) {
  const onModificar = vi.fn()
  const onEliminar = vi.fn()
  render(<ProductoCard producto={{ ...producto, ...datos }} onModificar={onModificar} onEliminar={onEliminar} />)
  return { onModificar, onEliminar }
}

describe('ProductoCard', () => {
  test('muestra los datos del producto', () => {
    renderCard()

    expect(screen.getByRole('heading', { name: 'Remera Oversize' })).toBeInTheDocument()
    expect(screen.getByText('REM-001')).toBeInTheDocument()
    expect(screen.getByText('Remera de algodon peinado')).toBeInTheDocument()
    expect(screen.getByText('Talle M')).toBeInTheDocument()
    expect(screen.getByText('Stock: 10')).toBeInTheDocument()
    expect(screen.getByText(/15\.000,00/)).toBeInTheDocument()
  })

  test('muestra la imagen del producto', () => {
    renderCard()

    expect(screen.getByRole('img', { name: 'Remera Oversize' })).toHaveAttribute('src', producto.imagen)
  })

  test('muestra "Sin imagen" cuando el producto no tiene imagen', () => {
    renderCard({ imagen: null })

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByText('Sin imagen')).toBeInTheDocument()
  })

  test('no muestra descripcion ni talle si estan vacios', () => {
    renderCard({ descripcion: null, talle: null })

    expect(screen.queryByText('Remera de algodon peinado')).not.toBeInTheDocument()
    expect(screen.queryByText(/Talle/)).not.toBeInTheDocument()
  })

  test('indica "Sin stock" cuando el stock es 0', () => {
    renderCard({ stock: 0 })

    expect(screen.getByText('Sin stock')).toHaveClass('agotado')
  })

  test('el boton Modificar envia el producto', async () => {
    const { onModificar, onEliminar } = renderCard()

    await userEvent.click(screen.getByRole('button', { name: 'Modificar' }))

    expect(onModificar).toHaveBeenCalledWith(producto)
    expect(onEliminar).not.toHaveBeenCalled()
  })

  test('el boton Eliminar envia el producto', async () => {
    const { onModificar, onEliminar } = renderCard()

    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }))

    expect(onEliminar).toHaveBeenCalledWith(producto)
    expect(onModificar).not.toHaveBeenCalled()
  })
})
