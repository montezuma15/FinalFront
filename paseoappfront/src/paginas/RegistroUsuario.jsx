import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../contexto/ContextoAuth.jsx'
import { mensajeDeError } from '../services/clienteApi.js'
import { ROLES } from '../auth/permisos.js'

import { PanelFormulario } from '../componentes/PanelFormulario'
import { AlertaError } from '../componentes/Estados.jsx'

export function RegistroUsuario() {
  const { registrarse } = useAuth()

  const [usuario, setUsuario] = useState({
    nombres: '',
    correo: '',
    contraseña: '',
    rol: ROLES.USUARIO,
  })
  // Solo se valida en el front: el backend no guarda la aceptacion de terminos
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
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
    if (!aceptaTerminos) {
      nuevosErrores.terminos = 'Debes aceptar los términos del servicio'
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
    return `campo-input ${errores[nombre] ? 'is-invalid' : ''}`
  }

  return (
    <PanelFormulario modo="registro" mensaje="Crea tu cuenta y aparta el salón, el gimnasio o la piscina sin filas">
      <AlertaError mensaje={errorApi} />

      <form onSubmit={manejarEnvio} noValidate>
        <div className="campo-linea">
          <label htmlFor="nombres">Nombres</label>
          <input id="nombres" type="text" name="nombres" placeholder="Escribe tu nombre completo"
            className={clasesCampo('nombres')} value={usuario.nombres} onChange={manejarCambio} />
          <div className="invalid-feedback">{errores.nombres}</div>
        </div>

        <div className="campo-linea">
          <label htmlFor="correo">Correo</label>
          <input id="correo" type="email" name="correo" placeholder="Escribe tu correo" autoComplete="email"
            className={clasesCampo('correo')} value={usuario.correo} onChange={manejarCambio} />
          <div className="invalid-feedback">{errores.correo}</div>
        </div>

        <div className="campo-linea">
          <label htmlFor="contraseña">Contraseña</label>
          <input id="contraseña" type="password" name="contraseña" placeholder="Mínimo 6 caracteres" autoComplete="new-password"
            className={clasesCampo('contraseña')} value={usuario.contraseña} onChange={manejarCambio} />
          <div className="invalid-feedback">{errores.contraseña}</div>
        </div>

        <fieldset className="campo-linea">
          <legend>Tipo de cuenta</legend>
          <div className="selector-rol">
            <label className={`opcion-rol ${usuario.rol === ROLES.USUARIO ? 'activa' : ''}`}>
              <input type="radio" name="rol" value={ROLES.USUARIO} checked={usuario.rol === ROLES.USUARIO} onChange={manejarCambio} />
              <i className="bi bi-person"></i>Residente
            </label>
            <label className={`opcion-rol ${usuario.rol === ROLES.ADMINISTRADOR ? 'activa' : ''}`}>
              <input type="radio" name="rol" value={ROLES.ADMINISTRADOR} checked={usuario.rol === ROLES.ADMINISTRADOR} onChange={manejarCambio} />
              <i className="bi bi-shield-lock"></i>Administrador
            </label>
          </div>
          {errores.rol && <div className="invalid-feedback d-block">{errores.rol}</div>}
        </fieldset>

        <div className="mb-4">
          <label className="check-auth">
            <input type="checkbox" checked={aceptaTerminos} onChange={(evento) => setAceptaTerminos(evento.target.checked)} />
            <span>Acepto todas las condiciones de los <span className="terminos">términos del servicio</span></span>
          </label>
          {errores.terminos && <div className="invalid-feedback d-block">{errores.terminos}</div>}
        </div>

        <div className="acciones-auth">
          <button type="submit" className="btn btn-auth" disabled={enviando}>
            {enviando ? 'Creando cuenta...' : 'Registrarse'}
          </button>
          <Link to="/login" className="enlace-auth">Ya tengo cuenta</Link>
        </div>
      </form>
    </PanelFormulario>
  )
}
