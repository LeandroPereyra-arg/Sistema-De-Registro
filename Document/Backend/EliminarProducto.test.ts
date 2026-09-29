import { Request, Response } from 'express'
import { EliminarProducto } from '../../Server/src/Controller/Productos'

// --> Simulamos la conexion a SQL Server: cada .input() devuelve el mismo request
const mockInput = jest.fn()
const mockQuery = jest.fn()
const mockRequest = { input: mockInput, query: mockQuery }

jest.mock('../../Server/src/Config/supabase', () => ({
  poolPromise: Promise.resolve({ request: () => mockRequest }),
  sql: { Int: 'Int' },
}))

// --> Crea un Response falso que guarda el status y el json enviados
function crearRes() {
  const res = {} as Response
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

function crearReq(params: Record<string, string>) {
  return { params, body: {} } as unknown as Request
}

beforeEach(() => {
  jest.clearAllMocks()
  mockInput.mockReturnValue(mockRequest)
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

describe('EliminarProducto', () => {
  test('elimina el producto y responde 201 cuando existe', async () => {
    mockQuery.mockResolvedValue({ rowsAffected: [1] })
    const res = crearRes()

    await EliminarProducto(crearReq({ id: '5' }), res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ Mensaje: 'Productos Eliminados Correctamente ✅' })
  })

  test('ejecuta un DELETE filtrando por el id recibido', async () => {
    mockQuery.mockResolvedValue({ rowsAffected: [1] })

    await EliminarProducto(crearReq({ id: '5' }), crearRes())

    expect(mockInput).toHaveBeenCalledWith('id', 'Int', '5')
    expect(mockQuery).toHaveBeenCalledTimes(1)
    expect(mockQuery.mock.calls[0][0]).toMatch(/DELETE FROM Tarjetas/)
    expect(mockQuery.mock.calls[0][0]).toMatch(/WHERE id=@id/)
  })

  test('responde 404 cuando el producto no existe', async () => {
    mockQuery.mockResolvedValue({ rowsAffected: [0] })
    const res = crearRes()

    await EliminarProducto(crearReq({ id: '999' }), res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'No se Logro Encontrar el Producto' })
  })

  test('responde 400 y no consulta la base de datos si no se envia el id', async () => {
    const res = crearRes()

    await EliminarProducto(crearReq({}), res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Debe Ingresar un ID para continuar' })
    expect(mockQuery).not.toHaveBeenCalled()
  })

  test('responde 500 si falla la base de datos', async () => {
    mockQuery.mockRejectedValue(new Error('Conexion perdida'))
    const res = crearRes()

    await EliminarProducto(crearReq({ id: '5' }), res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Error al Cargar la Base de Datos' })
  })
})
