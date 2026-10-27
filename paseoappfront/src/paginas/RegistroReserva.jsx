import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { useDatosApi } from '../utilidades/useDatosApi.js'
import { obtenerEspacio } from '../services/servicioEspacios.js'
import { guardarReserva, listarFranjasOcupadas } from '../services/servicioReservas.js'
import { mensajeDeError } from '../services/clienteApi.js'
import { fechaHoyISO, textoFecha, textoFranja } from '../utilidades/fechas.js'

import { AlertaError, EstadoCarga } from '../componentes/Estados.jsx'
import { SelectorFranja } from '../componentes/SelectorFranja.jsx'
import { FotoEspacio } from '../componentes/TarjetaEspacio.jsx'

export function RegistroReserva() {
  const { id } = useParams()
  const navegar = useNavigate()

  const [fecha, setFecha] = useState(fechaHoyISO)
  const [franja, setFranja] = useState('')
  const [errorApi, setErrorApi] = useState('')
  const [enviando, setEnviando] = useState(false)

  const espacio = useDatosApi(() => obtenerEspacio(id), [id])
  // Cada vez que cambia la fecha preguntamos que franjas estan tomadas
  const ocupadas = useDatosApi(() => listarFranjasOcupadas(id, fecha), [id, fecha])

  function cambiarFecha(evento) {
    setFecha(evento.target.value)
    setFranja('')
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setErrorApi('')
    setEnviando(true)
    try {
      await guardarReserva({ espacioId: id, fecha, franja })
      navegar('/mis-reservas', { state: { mensaje: `¡Listo! Reservaste ${espacio.datos.nombre} el ${textoFecha(fecha)} de ${textoFranja(franja)}.` } })
    } catch (error) {
      setErrorApi(mensajeDeError(error, 'No fue posible registrar la reserva'))
      // Puede que alguien la haya tomado justo antes: refrescamos la grilla
      ocupadas.recargar()
      setFranja('')
      setEnviando(false)
    }
  }

  if (espacio.cargando) return <EstadoCarga texto="Cargando espacio..." />
  if (espacio.error) return <AlertaError mensaje={espacio.error} />

  return (
    <>
      <Link to="/espacios" className="enlace-volver">
        <i className="bi bi-arrow-left me-1"></i>Volver a espacios
      </Link>

      <div className="row g-4">
        <div className="col-lg-4">
          <article className="card tarjeta-espacio">
            <div className="tarjeta-espacio-foto">
              <FotoEspacio src={espacio.datos.foto} alt={espacio.datos.nombre} />
              <span className="tarjeta-espacio-aforo">
                <i className="bi bi-people-fill me-1"></i>{espacio.datos.aforo} personas
              </span>
            </div>
            <div className="card-body">
              <h1 className="h4 fw-bold">{espacio.datos.nombre}</h1>
              <p className="text-muted mb-0">{espacio.datos.descripcion}</p>
            </div>
          </article>
        </div>

        <div className="col-lg-8">
          <form className="card p-4" onSubmit={manejarEnvio}>
            <h2 className="h5 fw-bold mb-1">Elige cuándo</h2>
            <p className="text-muted">Cada franja dura una hora.</p>

            <AlertaError mensaje={errorApi} />

            <div className="mb-4" style={{ maxWidth: '260px' }}>
              <label htmlFor="fecha" className="form-label">Fecha</label>
              <input id="fecha" type="date" className="form-control" min={fechaHoyISO()} value={fecha} onChange={cambiarFecha} required />
            </div>

            <p className="form-label">Franja horaria</p>
            {ocupadas.cargando && !ocupadas.datos
              ? <EstadoCarga texto="Consultando disponibilidad..." />
              : <SelectorFranja fecha={fecha} ocupadas={ocupadas.datos ?? []} seleccionada={franja} alSeleccionar={setFranja} />}
            <AlertaError mensaje={ocupadas.error} />

            <div className="resumen-reserva mt-4">
              <div>
                <small className="text-muted d-block">Tu reserva</small>
                <span className="fw-semibold mayuscula-inicial">
                  {franja ? `${textoFecha(fecha)} · ${textoFranja(franja)}` : 'Selecciona una franja libre'}
                </span>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" disabled={!franja || enviando}>
                {enviando ? 'Reservando...' : 'Confirmar reserva'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
