import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { useDatosApi } from '../utilidades/useDatosApi.js'
import { guardarEspacio, modificarEspacio, obtenerEspacio } from '../services/servicioEspacios.js'
import { mensajeDeError } from '../services/clienteApi.js'

import { EncabezadoPagina } from '../componentes/EncabezadoPagina.jsx'
import { AlertaError, EstadoCarga } from '../componentes/Estados.jsx'
import { FotoEspacio } from '../componentes/TarjetaEspacio.jsx'

const ESPACIO_VACIO = { nombre: '', descripcion: '', foto: '', aforo: '' }

function validar(espacio) {
  const nuevosErrores = {}
  if (espacio.nombre.trim() === '') {
    nuevosErrores.nombre = 'El nombre es obligatorio'
  }
  if (espacio.descripcion.trim().length < 10) {
    nuevosErrores.descripcion = 'La descripción debe tener mínimo 10 caracteres'
  }
  if (!/^https?:\/\/\S+$/.test(espacio.foto)) {
    nuevosErrores.foto = 'Ingrese una URL válida (http:// o https://)'
  }
  if (espacio.aforo === '' || Number(espacio.aforo) <= 0) {
    nuevosErrores.aforo = 'El aforo debe ser un número mayor a 0'
  }
  return nuevosErrores
}

// El formulario recibe los datos iniciales ya cargados (vacios si es nuevo)
function Formulario({ id, inicial }) {
  const navegar = useNavigate()
  const esEdicion = Boolean(id)

  const [espacio, setEspacio] = useState(inicial)
  const [errores, setErrores] = useState({})
  const [errorApi, setErrorApi] = useState('')
  const [enviando, setEnviando] = useState(false)

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setEspacio({ ...espacio, [name]: value })
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    const nuevosErrores = validar(espacio)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) {
      return
    }

    setErrorApi('')
    setEnviando(true)
    const datos = { ...espacio, aforo: Number(espacio.aforo) }
    try {
      if (esEdicion) {
        await modificarEspacio(id, datos)
      } else {
        await guardarEspacio(datos)
      }
      navegar('/espacios')
    } catch (error) {
      setErrorApi(mensajeDeError(error, 'No fue posible guardar el espacio'))
      setEnviando(false)
    }
  }

  function clasesCampo(nombre) {
    return `form-control ${errores[nombre] ? 'is-invalid' : ''}`
  }

  const fotoValida = /^https?:\/\/\S+$/.test(espacio.foto)

  return (
    <div className="row g-4">
      <div className="col-lg-7">
        <form className="card p-4" onSubmit={manejarEnvio} noValidate>
          <AlertaError mensaje={errorApi} />

          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre</label>
            <input id="nombre" type="text" name="nombre" placeholder="Salón social"
              className={clasesCampo('nombre')} value={espacio.nombre} onChange={manejarCambio} />
            <div className="invalid-feedback">{errores.nombre}</div>
          </div>

          <div className="mb-3">
            <label htmlFor="descripcion" className="form-label">Descripción</label>
            <textarea id="descripcion" name="descripcion" rows="3" placeholder="Describe el espacio y sus condiciones de uso"
              className={clasesCampo('descripcion')} value={espacio.descripcion} onChange={manejarCambio} />
            <div className="invalid-feedback">{errores.descripcion}</div>
          </div>

          <div className="row">
            <div className="col-md-8 mb-3">
              <label htmlFor="foto" className="form-label">Foto (URL)</label>
              <input id="foto" type="url" name="foto" placeholder="https://..."
                className={clasesCampo('foto')} value={espacio.foto} onChange={manejarCambio} />
              <div className="invalid-feedback">{errores.foto}</div>
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="aforo" className="form-label">Aforo</label>
              <input id="aforo" type="number" name="aforo" min="1" placeholder="Personas"
                className={clasesCampo('aforo')} value={espacio.aforo} onChange={manejarCambio} />
              <div className="invalid-feedback">{errores.aforo}</div>
            </div>
          </div>

          <div className="d-flex gap-2 justify-content-end mt-2">
            <Link to="/espacios" className="btn btn-light">Cancelar</Link>
            <button type="submit" className="btn btn-primary" disabled={enviando}>
              {enviando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear espacio'}
            </button>
          </div>
        </form>
      </div>

      {/* Vista previa de como lo veran los residentes */}
      <div className="col-lg-5">
        <p className="form-label">Vista previa</p>
        <article className="card tarjeta-espacio">
          <div className="tarjeta-espacio-foto">
            {/* key: si cambia la URL se vuelve a intentar cargar */}
            <FotoEspacio key={espacio.foto} src={fotoValida ? espacio.foto : ''} />
            <span className="tarjeta-espacio-aforo">
              <i className="bi bi-people-fill me-1"></i>{espacio.aforo || 0} personas
            </span>
          </div>
          <div className="card-body">
            <h5 className="fw-bold mb-1">{espacio.nombre || 'Nombre del espacio'}</h5>
            <p className="text-muted small mb-0">{espacio.descripcion || 'Descripción del espacio'}</p>
          </div>
        </article>
      </div>
    </div>
  )
}

export function FormularioEspacio() {
  const { id } = useParams()
  const esEdicion = Boolean(id)

  const { datos, cargando, error } = useDatosApi(
    () => (esEdicion ? obtenerEspacio(id) : Promise.resolve(ESPACIO_VACIO)),
    [id]
  )

  return (
    <>
      <Link to="/espacios" className="enlace-volver">
        <i className="bi bi-arrow-left me-1"></i>Volver a espacios
      </Link>
      <EncabezadoPagina
        titulo={esEdicion ? 'Editar espacio' : 'Nuevo espacio'}
        subtitulo={esEdicion ? 'Actualiza la información de la zona común.' : 'Registra una zona común con su foto y aforo.'}
      />

      {cargando && <EstadoCarga texto="Cargando espacio..." />}
      <AlertaError mensaje={error} />
      {/* key: si cambia el id se crea un formulario nuevo con sus datos */}
      {!cargando && datos && <Formulario key={id ?? 'nuevo'} id={id} inicial={{ ...datos, aforo: String(datos.aforo) }} />}
    </>
  )
}
