import { Request, Response } from 'express'
import { ModificarProducto } from '../../Server/src/Controller/Productos'

// --> Simulamos la conexion a SQL Server: cada .input() devuelve el mismo request
const mockInput = jest.fn()
const mockQuery = jest.fn()
const mockRequest = { input: mockInput, query: mockQuery }

jest.mock('../../Server/src/Config/supabase', () => ({
  poolPromise: Promise.resolve({ request: () => mockRequest }),
  sql: {
    Int: 'Int',
    VarChar: Object.assign(() => 'VarChar(MAX)', { toString: () => 'VarChar' }),
    Decimal: () => 'Decimal(10,2)',
    MAX: 'MAX',
  },
}))

// --> Crea un Response falso que guarda el status y el json enviados
function crearRes() {
  const res = {} as Response
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

function crearReq(params: Record<string, string>, body: Record<string, unknown>) {
  return { params, body } as unknown as Request
}

const productoValido = {
  codigo: 'REM-001',
  nombre: 'Remera Oversize',
  descripcion: 'Remera de algodon',
  talle: 'M',
  precio: 15000,
  stock: 10,
  imagen: 'https://ejemplo.com/remera.png',
}

beforeEach(() => {
  jest.clearAllMocks()
  mockInput.mockReturnValue(mockRequest)
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

describe('ModificarProducto', () => {
  test('modifica el producto y responde 201 cuando existe', async () => {
    mockQuery.mockResolvedValue({ rowsAffected: [1] })
    const res = crearRes()

    await ModificarProducto(crearReq({ id: '5' }, productoValido), res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ Mensaje: 'Productos Modificados Correctamente ✅' })
  })

  test('envia a la base de datos el id y todos los campos del producto', async () => {
    mockQuery.mockResolvedValue({ rowsAffected: [1] })

    await ModificarProducto(crearReq({ id: '5' }, productoValido), crearRes())

    const parametros = Object.fromEntries(mockInput.mock.calls.map(([nombre, , valor]) => [nombre, valor]))
    expect(parametros).toEqual({ id: '5', ...productoValido })
    expect(mockQuery).toHaveBeenCalledTimes(1)
    expect(mockQuery.mock.calls[0][0]).toMatch(/UPDATE Tarjetas/)
    expect(mockQuery.mock.calls[0][0]).toMatch(/WHERE id=@id/)
  })

  test('usa 0 como precio y stock, y null como imagen cuando no se envian', async () => {
    mockQuery.mockResolvedValue({ rowsAffected: [1] })

    await ModificarProducto(crearReq({ id: '5' }, { codigo: 'REM-001', nombre: 'Remera' }), crearRes())

    const parametros = Object.fromEntries(mockInput.mock.calls.map(([nombre, , valor]) => [nombre, valor]))
    expect(parametros.precio).toBe(0)
    expect(parametros.stock).toBe(0)
    expect(parametros.imagen).toBeNull()
  })

  test('responde 404 cuando el producto no existe', async () => {
    mockQuery.mockResolvedValue({ rowsAffected: [0] })
    const res = crearRes()

    await ModificarProducto(crearReq({ id: '999' }, productoValido), res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'No se Logro Encontrar el Producto' })
  })

  test.each([
    ['codigo', { ...productoValido, codigo: '' }],
    ['nombre', { ...productoValido, nombre: '' }],
  ])('responde 400 y no consulta la base de datos si falta el %s', async (_campo, body) => {
    const res = crearRes()

    await ModificarProducto(crearReq({ id: '5' }, body), res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ Mensaje: 'Debe Completar los campos de Codigo y Nombre para continuar' })
    expect(mockQuery).not.toHaveBeenCalled()
  })

  test('responde 400 si no se envia el id', async () => {
    const res = crearRes()

    await ModificarProducto(crearReq({}, productoValido), res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Debe Ingresar un ID para continuar' })
    expect(mockQuery).not.toHaveBeenCalled()
  })

  test('responde 500 si falla la base de datos', async () => {
    mockQuery.mockRejectedValue(new Error('Conexion perdida'))
    const res = crearRes()

    await ModificarProducto(crearReq({ id: '5' }, productoValido), res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Error al Cargar la Base de Datos' })
  })
})
