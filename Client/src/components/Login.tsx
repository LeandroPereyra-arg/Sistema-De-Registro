import { useState, type FormEvent } from 'react'
import { login, type Usuario } from '../services/auth'

interface Props {
  onLogin: (usuario: Usuario) => void
}

function Login({ onLogin }: Props) {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!usuario || !password) {
      setError('Complete Usuario y Contraseña')
      return
    }

    setCargando(true)
    try {
      const user = await login(usuario, password)
      onLogin(user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="login">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Iniciar Sesión</h1>

        <label htmlFor="usuario">Usuario o Email</label>
        <input
          id="usuario"
          type="text"
          autoComplete="username"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="login-error">{error}</p>}

        <button type="submit" disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </main>
  )
}

export default Login
