import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../contexto/ContextoAuth.jsx'
import { mensajeDeError } from '../services/clienteApi.js'
import { ROLES } from '../auth/permisos.js'

import { PanelFormulario } from '../componentes/PanelFormulario'
import { AlertaError } from '../componentes/Estados.jsx'

const IMAGEN = 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1400&q=80'

export function RegistroUsuario() {
  const { registrarse } = useAuth()

  const [usuario, setUsuario] = useState({
    nombres: '',
    correo: '',
    contraseña: '',
    rol: ROLES.USUARIO,
  })
  const [errores, setErrores] = useState({})
  const [errorApi, setErrorApi] = useState('')
  const [enviando, setEnviando] = useState(false)

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setUsuario({ ...usuario, [name]: value })
  }

  function validar() {
    const nuevosErrores = {}
    if (usuario.nombres.trim() === '') {
      nuevosErrores.nombres = 'Los nombres son obligatorios'
    }
    if (!/^\S+@\S+\.\S+$/.test(usuario.correo)) {
      nuevosErrores.correo = 'Ingrese un correo válido'
    }
    if (usuario.contraseña.length < 6) {
      nuevosErrores.contraseña = 'La contraseña debe tener mínimo 6 caracteres'
    }
    if (usuario.rol === '') {
      nuevosErrores.rol = 'Seleccione un rol'
    }
    return nuevosErrores
  }


  //OJO funcion para activar el API y enviarle datos
  async function manejarEnvio(evento){

    //evito que se recargue el formulario
    evento.preventDefault()

    //valido formulario
    const nuevosErrores=validar()
    setErrores(nuevosErrores)
    if(Object.keys(nuevosErrores).length>0){
      return null
    }

    //Todo ok voy a a intentar enviar los datos al API
    setErrorApi('')
    setEnviando(true)
    try{
      //Registra y deja la sesion iniciada; RutaPublica nos lleva a /inicio
      await registrarse(usuario)
    }catch(error){
      setErrorApi(mensajeDeError(error, 'No fue posible registrar el usuario'))
      setEnviando(false)
    }
  }

  function clasesCampo(nombre) {
    return `form-control ${errores[nombre] ? 'is-invalid' : ''}`
  }

  return (
    <PanelFormulario
      imagen={IMAGEN}
      titulo="Tu unidad residencial, en un solo lugar"
      subtitulo="Crea tu cuenta y empieza a reservar las zonas comunes de tu conjunto."
    >
      <h2 className="fw-bold mb-1">Crear cuenta</h2>
      <p className="text-muted mb-4">Solo toma un minuto.</p>

      <AlertaError mensaje={errorApi} />

      <form onSubmit={manejarEnvio} noValidate>
        <div className="mb-3">
          <label htmlFor="nombres" className="form-label">Nombres</label>
          <input id="nombres" type="text" name="nombres" placeholder="Juan Pérez"
            className={clasesCampo('nombres')} value={usuario.nombres} onChange={manejarCambio} />
          <div className="invalid-feedback">{errores.nombres}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="correo" className="form-label">Correo</label>
          <input id="correo" type="email" name="correo" placeholder="correo@ejemplo.com" autoComplete="email"
            className={clasesCampo('correo')} value={usuario.correo} onChange={manejarCambio} />
          <div className="invalid-feedback">{errores.correo}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="contraseña" className="form-label">Contraseña</label>
          <input id="contraseña" type="password" name="contraseña" placeholder="Mínimo 6 caracteres" autoComplete="new-password"
            className={clasesCampo('contraseña')} value={usuario.contraseña} onChange={manejarCambio} />
          <div className="invalid-feedback">{errores.contraseña}</div>
        </div>

        <fieldset className="mb-4">
          <legend className="form-label">Tipo de cuenta</legend>
          <div className="selector-rol">
            <label className={`opcion-rol ${usuario.rol === ROLES.USUARIO ? 'activa' : ''}`}>
              <input type="radio" name="rol" value={ROLES.USUARIO} checked={usuario.rol === ROLES.USUARIO} onChange={manejarCambio} />
              <i className="bi bi-person"></i>
              <span className="fw-semibold">Residente</span>
              <small className="text-muted">Reserva espacios</small>
            </label>
            <label className={`opcion-rol ${usuario.rol === ROLES.ADMINISTRADOR ? 'activa' : ''}`}>
              <input type="radio" name="rol" value={ROLES.ADMINISTRADOR} checked={usuario.rol === ROLES.ADMINISTRADOR} onChange={manejarCambio} />
              <i className="bi bi-shield-lock"></i>
              <span className="fw-semibold">Administrador</span>
              <small className="text-muted">Gestiona el conjunto</small>
            </label>
          </div>
          {errores.rol && <div className="text-danger small mt-1">{errores.rol}</div>}
        </fieldset>

        <button type="submit" className="btn btn-primary btn-lg w-100" disabled={enviando}>
          {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      <p className="text-center text-muted mt-4 mb-0">
        ¿Ya tienes cuenta? <Link to="/login" className="fw-semibold">Inicia sesión</Link>
      </p>
    </PanelFormulario>
  )
}
