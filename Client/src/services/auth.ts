export interface Usuario {
  id: number
  usuario: string
  email: string
  rol: string
}

interface LoginResponse {
  Mensaje: string
  token: string
  usuario: Usuario
}

const TOKEN_KEY = 'token'
const USER_KEY = 'usuario'

export async function login(usuario: string, password: string): Promise<Usuario> {
  const res = await fetch('/api/Auth/Login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, password }),
  })
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.error || data.Mensaje || 'No se pudo iniciar sesión')
  }

  const { token, usuario: user } = data as LoginResponse
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  return user
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUsuario(): Usuario | null {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? (JSON.parse(raw) as Usuario) : null
}

// --> Usar en los fetch a rutas protegidas: headers: authHeader()
export function authHeader(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}
