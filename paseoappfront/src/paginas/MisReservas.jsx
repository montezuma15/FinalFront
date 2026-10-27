import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { useDatosApi } from '../utilidades/useDatosApi.js'
import { cancelarReserva, listarMisReservas } from '../services/servicioReservas.js'
import { mensajeDeError } from '../services/clienteApi.js'
import { textoFecha, textoFranja, yaPaso } from '../utilidades/fechas.js'

import { EncabezadoPagina } from '../componentes/EncabezadoPagina.jsx'
import { AlertaError, EstadoCarga, EstadoVacio } from '../componentes/Estados.jsx'
import { ModalConfirmacion } from '../componentes/ModalConfirmacion.jsx'

export function MisReservas() {
  // Mensaje de exito que manda RegistroReserva al navegar aqui
  const mensaje = useLocation().state?.mensaje

  const { datos: reservas, cargando, error, setDatos } = useDatosApi(listarMisReservas)
  const [porCancelar, setPorCancelar] = useState(null)
  const [cancelando, setCancelando] = useState(false)
  const [errorCancelar, setErrorCancelar] = useState('')

  async function confirmarCancelacion() {
    setCancelando(true)
    setErrorCancelar('')
    try {
      await cancelarReserva(porCancelar.id)
      setDatos((lista) => lista.filter((reserva) => reserva.id !== porCancelar.id))
    } catch (error) {
      setErrorCancelar(mensajeDeError(error, 'No fue posible cancelar la reserva'))
    } finally {
      setCancelando(false)
      setPorCancelar(null)
    }
  }

  function pintarReserva(reserva, esProxima) {
    return (
      <div className={`fila-reserva ${esProxima ? '' : 'fila-reserva-pasada'}`} key={reserva.id}>
        <img src={reserva.espacioFoto} alt="" className="fila-reserva-foto" />
        <div className="flex-grow-1">
          <p className="fw-semibold mb-0">{reserva.espacioNombre}</p>
          <small className="text-muted mayuscula-inicial">{textoFecha(reserva.fecha)} · {textoFranja(reserva.franja)}</small>
        </div>
        {esProxima && (
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setPorCancelar(reserva)}>
            Cancelar
          </button>
        )}
      </div>
    )
  }

  function contenido() {
    if (cargando) return <EstadoCarga texto="Cargando tus reservas..." />
    if (error) return <AlertaError mensaje={error} />

    if (reservas.length === 0) {
      return (
        <EstadoVacio icono="bi-calendar2-heart" titulo="Todavía no tienes reservas">
          <Link to="/espacios" className="btn btn-primary mt-3">Reservar un espacio</Link>
        </EstadoVacio>
      )
    }

    const proximas = reservas.filter((reserva) => !yaPaso(reserva.fecha, reserva.franja))
    // Las pasadas de la mas reciente a la mas antigua
    const pasadas = reservas.filter((reserva) => yaPaso(reserva.fecha, reserva.franja)).reverse()

    return (
      <>
        <h2 className="h6 text-uppercase text-muted fw-bold mb-3">Próximas ({proximas.length})</h2>
        {proximas.length === 0
          ? <p className="text-muted">No tienes reservas próximas.</p>
          : <div className="lista-reservas mb-5">{proximas.map((reserva) => pintarReserva(reserva, true))}</div>}

        {pasadas.length > 0 && (
          <>
            <h2 className="h6 text-uppercase text-muted fw-bold mb-3">Historial ({pasadas.length})</h2>
            <div className="lista-reservas">{pasadas.map((reserva) => pintarReserva(reserva, false))}</div>
          </>
        )}
      </>
    )
  }

  return (
    <>
      <EncabezadoPagina titulo="Mis reservas" subtitulo="Tus horarios apartados en las zonas comunes.">
        <Link to="/espacios" className="btn btn-primary">
          <i className="bi bi-calendar-plus me-2"></i>Nueva reserva
        </Link>
      </EncabezadoPagina>

      {mensaje && (
        <div className="alert alert-success d-flex align-items-center gap-2">
          <i className="bi bi-check-circle"></i><span>{mensaje}</span>
        </div>
      )}
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
        {porCancelar && <>{porCancelar.espacioNombre}, {textoFecha(porCancelar.fecha)} de {textoFranja(porCancelar.franja)}.</>}
      </ModalConfirmacion>
    </>
  )
}
