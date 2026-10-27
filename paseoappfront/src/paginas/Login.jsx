import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../contexto/ContextoAuth.jsx'
import { mensajeDeError } from '../services/clienteApi.js'

import { PanelFormulario } from '../componentes/PanelFormulario'
import { AlertaError } from '../componentes/Estados.jsx'

const IMAGEN = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&q=80'

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
    <PanelFormulario
      imagen={IMAGEN}
      titulo="Las zonas comunes de tu conjunto, a un clic"
      subtitulo="Reserva el salón social, el gimnasio o la piscina sin llamadas ni filas en portería."
    >
      <h2 className="fw-bold mb-1">Bienvenido de nuevo</h2>
      <p className="text-muted mb-4">Ingresa con tu correo para continuar.</p>

      <AlertaError mensaje={error} />

      <form onSubmit={manejarEnvio}>
        <div className="mb-3">
          <label htmlFor="correo" className="form-label">Correo</label>
          <input
            id="correo"
            type="email"
            name="correo"
            placeholder="correo@ejemplo.com"
            className="form-control form-control-lg"
            value={datos.correo}
            onChange={manejarCambio}
            autoComplete="email"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="contraseña" className="form-label">Contraseña</label>
          <input
            id="contraseña"
            type="password"
            name="contraseña"
            className="form-control form-control-lg"
            value={datos.contraseña}
            onChange={manejarCambio}
            autoComplete="current-password"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-lg w-100" disabled={enviando}>
          {enviando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <p className="text-center text-muted mt-4 mb-0">
        ¿No tienes cuenta? <Link to="/registro" className="fw-semibold">Regístrate</Link>
      </p>
    </PanelFormulario>
  )
}
