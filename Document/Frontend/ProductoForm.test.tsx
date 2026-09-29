import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
import ProductoForm from '../../Client/src/components/ProductoForm'
import type { Producto } from '../../Client/src/services/productos'

const producto: Producto = {
  id: 7,
  codigo: 'REM-001',
  nombre: 'Remera Oversize',
  descripcion: 'Remera de algodon',
  talle: 'M',
  precio: 15000,
  stock: 10,
  imagen: null,
}

describe('ProductoForm - Registrar', () => {
  test('muestra el formulario vacio en modo Nuevo Producto', () => {
    render(<ProductoForm onGuardar={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Nuevo Producto' })).toBeInTheDocument()
    expect(screen.getByLabelText('Código *')).toHaveValue('')
    expect(screen.getByLabelText('Nombre *')).toHaveValue('')
    expect(screen.getByRole('button', { name: 'Registrar Producto' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cancelar' })).not.toBeInTheDocument()
  })

  test('envia los datos cargados y limpia el formulario', async () => {
    const onGuardar = vi.fn().mockResolvedValue(undefined)
    render(<ProductoForm onGuardar={onGuardar} />)

    await userEvent.type(screen.getByLabelText('Código *'), '  BUZ-002 ')
    await userEvent.type(screen.getByLabelText('Nombre *'), 'Buzo Canguro')
    await userEvent.type(screen.getByLabelText('Descripción'), 'Buzo con capucha')
    await userEvent.type(screen.getByLabelText('Talle'), 'L')
    await userEvent.type(screen.getByLabelText('Precio'), '25000.5')
    await userEvent.type(screen.getByLabelText('Stock'), '4')
    await userEvent.type(screen.getByLabelText('URL de la Imagen'), 'https://ejemplo.com/buzo.png')
    await userEvent.click(screen.getByRole('button', { name: 'Registrar Producto' }))

    expect(onGuardar).toHaveBeenCalledWith({
      codigo: 'BUZ-002',
      nombre: 'Buzo Canguro',
      descripcion: 'Buzo con capucha',
      talle: 'L',
      precio: 25000.5,
      stock: 4,
      imagen: 'https://ejemplo.com/buzo.png',
    })
    expect(screen.getByLabelText('Código *')).toHaveValue('')
  })

  test('los campos opcionales vacios se envian como null y precio/stock como 0', async () => {
    const onGuardar = vi.fn().mockResolvedValue(undefined)
    render(<ProductoForm onGuardar={onGuardar} />)

    await userEvent.type(screen.getByLabelText('Código *'), 'GOR-003')
    await userEvent.type(screen.getByLabelText('Nombre *'), 'Gorra')
    await userEvent.click(screen.getByRole('button', { name: 'Registrar Producto' }))

    expect(onGuardar).toHaveBeenCalledWith({
      codigo: 'GOR-003',
      nombre: 'Gorra',
      descripcion: null,
      talle: null,
      precio: 0,
      stock: 0,
      imagen: null,
    })
  })

  test('no envia el formulario si falta Codigo o Nombre', async () => {
    const onGuardar = vi.fn()
    render(<ProductoForm onGuardar={onGuardar} />)

    await userEvent.type(screen.getByLabelText('Nombre *'), 'Sin codigo')
    await userEvent.click(screen.getByRole('button', { name: 'Registrar Producto' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Debe Completar los campos de Codigo y Nombre')
    expect(onGuardar).not.toHaveBeenCalled()
  })

  test('no acepta un stock con decimales', async () => {
    const onGuardar = vi.fn()
    render(<ProductoForm onGuardar={onGuardar} />)

    await userEvent.type(screen.getByLabelText('Código *'), 'A1')
    await userEvent.type(screen.getByLabelText('Nombre *'), 'Producto')
    await userEvent.type(screen.getByLabelText('Stock'), '1.5')
    await userEvent.click(screen.getByRole('button', { name: 'Registrar Producto' }))

    expect(screen.getByRole('alert')).toHaveTextContent('El Stock debe ser un número entero')
    expect(onGuardar).not.toHaveBeenCalled()
  })

  test('muestra el error del Servidor y conserva los datos', async () => {
    const onGuardar = vi.fn().mockRejectedValue(new Error('Debe Iniciar Sesion para continuar'))
    render(<ProductoForm onGuardar={onGuardar} />)

    await userEvent.type(screen.getByLabelText('Código *'), 'A1')
    await userEvent.type(screen.getByLabelText('Nombre *'), 'Producto')
    await userEvent.click(screen.getByRole('button', { name: 'Registrar Producto' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Debe Iniciar Sesion para continuar')
    expect(screen.getByLabelText('Código *')).toHaveValue('A1')
  })
})

describe('ProductoForm - Modificar', () => {
  test('carga los datos del producto a modificar', () => {
    render(<ProductoForm producto={producto} onGuardar={vi.fn()} onCancelar={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Modificar Producto' })).toBeInTheDocument()
    expect(screen.getByLabelText('Código *')).toHaveValue('REM-001')
    expect(screen.getByLabelText('Nombre *')).toHaveValue('Remera Oversize')
    expect(screen.getByLabelText('Descripción')).toHaveValue('Remera de algodon')
    expect(screen.getByLabelText('Talle')).toHaveValue('M')
    expect(screen.getByLabelText('Precio')).toHaveValue(15000)
    expect(screen.getByLabelText('Stock')).toHaveValue(10)
    expect(screen.getByLabelText('URL de la Imagen')).toHaveValue('')
  })

  test('envia los datos modificados', async () => {
    const onGuardar = vi.fn().mockResolvedValue(undefined)
    render(<ProductoForm producto={producto} onGuardar={onGuardar} onCancelar={vi.fn()} />)

    const precio = screen.getByLabelText('Precio')
    await userEvent.clear(precio)
    await userEvent.type(precio, '18000')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar Cambios' }))

    expect(onGuardar).toHaveBeenCalledWith({
      codigo: 'REM-001',
      nombre: 'Remera Oversize',
      descripcion: 'Remera de algodon',
      talle: 'M',
      precio: 18000,
      stock: 10,
      imagen: null,
    })
  })

  test('el boton Cancelar llama a onCancelar sin guardar', async () => {
    const onGuardar = vi.fn()
    const onCancelar = vi.fn()
    render(<ProductoForm producto={producto} onGuardar={onGuardar} onCancelar={onCancelar} />)

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(onCancelar).toHaveBeenCalledTimes(1)
    expect(onGuardar).not.toHaveBeenCalled()
  })
})
