import express from 'express'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import Rutas from '../../Server/src/Router/Productos.route'

// --> Prueba las rutas completas (middleware de Token + controlador) sin base de datos real
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

const SECRET = 'secreto-de-test'
const app = express()
app.use(express.json())
app.use('/api', Rutas)

function token() {
  return 'Bearer ' + jwt.sign({ id: 1, usuario: 'admin', rol: 'admin' }, SECRET)
}

beforeAll(() => {
  process.env.JWT_SECRET = SECRET
})

beforeEach(() => {
  jest.clearAllMocks()
  mockInput.mockReturnValue(mockRequest)
  mockQuery.mockResolvedValue({ rowsAffected: [1] })
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

describe('PUT /api/Modificar/:id', () => {
  const body = { codigo: 'REM-001', nombre: 'Remera' }

  test('responde 401 sin Token y no modifica nada', async () => {
    const res = await request(app).put('/api/Modificar/5').send(body)

    expect(res.status).toBe(401)
    expect(mockQuery).not.toHaveBeenCalled()
  })

  test('responde 401 con un Token invalido', async () => {
    const res = await request(app).put('/api/Modificar/5').set('Authorization', 'Bearer invalido').send(body)

    expect(res.status).toBe(401)
    expect(res.body).toEqual({ error: 'Token Invalido o Expirado' })
  })

  test('modifica el producto con un Token valido', async () => {
    const res = await request(app).put('/api/Modificar/5').set('Authorization', token()).send(body)

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ Mensaje: 'Productos Modificados Correctamente ✅' })
    expect(mockInput).toHaveBeenCalledWith('id', 'Int', '5')
  })
})

describe('DELETE /api/Eliminar/:id', () => {
  test('responde 401 sin Token y no elimina nada', async () => {
    const res = await request(app).delete('/api/Eliminar/5')

    expect(res.status).toBe(401)
    expect(mockQuery).not.toHaveBeenCalled()
  })

  test('elimina el producto con un Token valido', async () => {
    const res = await request(app).delete('/api/Eliminar/5').set('Authorization', token())

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ Mensaje: 'Productos Eliminados Correctamente ✅' })
  })

  test('responde 404 si el producto no existe', async () => {
    mockQuery.mockResolvedValue({ rowsAffected: [0] })

    const res = await request(app).delete('/api/Eliminar/999').set('Authorization', token())

    expect(res.status).toBe(404)
  })
})
