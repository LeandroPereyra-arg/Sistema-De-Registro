import { useState } from 'react'
import Login from './components/Login'
import { getUsuario, logout, type Usuario } from './services/auth'

function App() {
  const [usuario, setUsuario] = useState<Usuario | null>(getUsuario)

  if (!usuario) {
    return <Login onLogin={setUsuario} />
  }

  return (
    <main className="login">
      <div className="login-card">
        <h1>Bienvenido, {usuario.usuario}</h1>
        <button
          onClick={() => {
            logout()
            setUsuario(null)
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    </main>
  )
}

export default App
