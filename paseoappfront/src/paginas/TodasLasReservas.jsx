import { useState } from 'react'

import { useDatosApi } from '../utilidades/useDatosApi.js'
import { cancelarReserva, listarTodasLasReservas } from '../services/servicioReservas.js'
import { listarEspacios } from '../services/servicioEspacios.js'
import { mensajeDeError } from '../services/clienteApi.js'
import { textoFecha, textoFranja, yaPaso } from '../utilidades/fechas.js'

import { Avatar } from '../componentes/Avatar.jsx'
import { EncabezadoPagina } from '../componentes/EncabezadoPagina.jsx'
import { AlertaError, EstadoCarga, EstadoVacio } from '../componentes/Estados.jsx'
import { ModalConfirmacion } from '../componentes/ModalConfirmacion.jsx'

// Solo ADMINISTRADOR: ve las reservas de todos los usuarios
export function TodasLasReservas() {
  const [filtros, setFiltros] = useState({ espacioId: '', fecha: '' })

  const espacios = useDatosApi(listarEspacios)
  const reservas = useDatosApi(() => listarTodasLasReservas(filtros), [filtros.espacioId, filtros.fecha])

  const [porCancelar, setPorCancelar] = useState(null)
  const [cancelando, setCancelando] = useState(false)
  const [errorCancelar, setErrorCancelar] = useState('')

  function cambiarFiltro(evento) {
    const { name, value } = evento.target
    setFiltros({ ...filtros, [name]: value })
  }

  async function confirmarCancelacion() {
    setCancelando(true)
    setErrorCancelar('')
    try {
      await cancelarReserva(porCancelar.id)
      reservas.setDatos((lista) => lista.filter((reserva) => reserva.id !== porCancelar.id))
    } catch (error) {
      setErrorCancelar(mensajeDeError(error, 'No fue posible cancelar la reserva'))
    } finally {
      setCancelando(false)
      setPorCancelar(null)
    }
  }

  function pintarFila(reserva) {
    const pasada = yaPaso(reserva.fecha, reserva.franja)
    return (
      <tr key={reserva.id} className={pasada ? 'text-muted' : ''}>
        <td><span className="mayuscula-inicial">{textoFecha(reserva.fecha, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span></td>
        <td>{textoFranja(reserva.franja)}</td>
        <td className="fw-semibold">{reserva.espacioNombre}</td>
        <td>
          <span className="d-inline-flex align-items-center gap-2">
            <Avatar nombres={reserva.usuarioNombres} tamaño="sm" />{reserva.usuarioNombres}
          </span>
        </td>
        <td>
          {pasada
            ? <span className="badge text-bg-light">Finalizada</span>
            : <span className="badge text-bg-success">Activa</span>}
        </td>
        <td className="text-end">
          {!pasada && (
            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setPorCancelar(reserva)}>
              Cancelar
            </button>
          )}
        </td>
      </tr>
    )
  }

  function contenido() {
    if (reservas.cargando) return <EstadoCarga texto="Cargando reservas..." />
    if (reservas.error) return <AlertaError mensaje={reservas.error} />
    if (reservas.datos.length === 0) {
      return <EstadoVacio icono="bi-calendar-x" titulo="No hay reservas con esos filtros" />
    }
    return (
      <div className="card tabla-tarjeta">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Franja</th>
                <th>Espacio</th>
                <th>Residente</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{reservas.datos.map(pintarFila)}</tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <>
      <EncabezadoPagina titulo="Todas las reservas" subtitulo="Reservas de todos los residentes del conjunto." />

      <div className="filtros mb-4">
        <select name="espacioId" className="form-select" value={filtros.espacioId} onChange={cambiarFiltro} aria-label="Filtrar por espacio">
          <option value="">Todos los espacios</option>
          {(espacios.datos ?? []).map((espacio) => (
            <option key={espacio.id} value={espacio.id}>{espacio.nombre}</option>
          ))}
        </select>
        <input type="date" name="fecha" className="form-control" value={filtros.fecha} onChange={cambiarFiltro} aria-label="Filtrar por fecha" />
        {(filtros.espacioId || filtros.fecha) && (
          <button type="button" className="btn btn-light" onClick={() => setFiltros({ espacioId: '', fecha: '' })}>
            Limpiar filtros
          </button>
        )}
      </div>

      <AlertaError mensaje={errorCancelar} />
      {contenido()}

      <ModalConfirmacion
        abierto={porCancelar !== null}
        titulo="¿Cancelar esta reserva?"
        textoConfirmar="Sí, cancelar"
        procesando={cancelando}
        alConfirmar={confirmarCancelacion}
        alCerrar={() => setPorCancelar(null)}
      >
        {porCancelar && <>Reserva de <strong>{porCancelar.usuarioNombres}</strong> en {porCancelar.espacioNombre}. Se le liberará la franja.</>}
      </ModalConfirmacion>
    </>
  )
}
