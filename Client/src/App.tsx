import { useState } from 'react'
import Login from './components/Login'
import Productos from './components/Productos'
import { getUsuario, logout, type Usuario } from './services/auth'

function App() {
  const [usuario, setUsuario] = useState<Usuario | null>(getUsuario)

  if (!usuario) {
    return <Login onLogin={setUsuario} />
  }

  return (
    <>
      <header className="barra">
        <h1>Productos</h1>
        <div>
          <span>Hola, {usuario.usuario}</span>
          <button
            className="secundario"
            onClick={() => {
              logout()
              setUsuario(null)
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </header>
      <Productos />
    </>
  )
}

export default App
