import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../contexto/ContextoAuth.jsx'
import { mensajeDeError } from '../services/clienteApi.js'

import { PanelFormulario } from '../componentes/PanelFormulario'
import { AlertaError } from '../componentes/Estados.jsx'

export function Login() {
  const { iniciarSesion } = useAuth()

  const [datos, setDatos] = useState({ correo: '', contraseña: '' })
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setDatos({ ...datos, [name]: value })
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setError('')
    setEnviando(true)

    try {
      // Si sale bien, RutaPublica nos lleva a /inicio (o a la pagina que se queria ver)
      await iniciarSesion(datos.correo, datos.contraseña)
    } catch (error) {
      setError(mensajeDeError(error, 'No fue posible iniciar sesión'))
      setEnviando(false)
    }
  }

  return (
    <PanelFormulario modo="login" mensaje="Reserva las zonas comunes de tu conjunto y organiza tus horarios en línea">
      <AlertaError mensaje={error} />

      <form onSubmit={manejarEnvio}>
        <div className="campo-linea">
          <label htmlFor="correo">Correo</label>
          <input
            id="correo"
            type="email"
            name="correo"
            placeholder="Escribe tu correo"
            className="campo-input"
            value={datos.correo}
            onChange={manejarCambio}
            autoComplete="email"
            required
          />
        </div>

        <div className="campo-linea">
          <label htmlFor="contraseña">Contraseña</label>
          <input
            id="contraseña"
            type="password"
            name="contraseña"
            placeholder="Escribe tu contraseña"
            className="campo-input"
            value={datos.contraseña}
            onChange={manejarCambio}
            autoComplete="current-password"
            required
          />
        </div>

        <div className="acciones-auth mt-4">
          <button type="submit" className="btn btn-auth" disabled={enviando}>
            {enviando ? 'Ingresando...' : 'Ingresar'}
          </button>
          <Link to="/registro" className="enlace-auth">No tengo cuenta</Link>
        </div>
      </form>
    </PanelFormulario>
  )
}
