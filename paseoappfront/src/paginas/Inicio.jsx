import { Link } from 'react-router-dom'

import { useAuth } from '../contexto/ContextoAuth.jsx'
import { useDatosApi } from '../utilidades/useDatosApi.js'
import { listarEspacios } from '../services/servicioEspacios.js'
import { listarMisReservas, listarTodasLasReservas } from '../services/servicioReservas.js'
import { listarUsuarios } from '../services/servicioUsuarios.js'
import { fechaHoyISO, textoFecha, textoFranja, yaPaso } from '../utilidades/fechas.js'

import { Autorizado } from '../componentes/Autorizado.jsx'
import { AlertaError, EstadoCarga, EstadoVacio } from '../componentes/Estados.jsx'
import { TarjetaEspacio } from '../componentes/TarjetaEspacio.jsx'

// Solo se pinta para el administrador (ver <Autorizado> abajo),
// asi que solo el administrador llama a estos endpoints
function ResumenAdministrador() {
  const { datos, cargando, error } = useDatosApi(async function cargarResumen() {
    const [usuarios, espacios, reservas] = await Promise.all([
      listarUsuarios(),
      listarEspacios(),
      listarTodasLasReservas(),
    ])
    const hoy = fechaHoyISO()
    return {
      usuarios: usuarios.length,
      espacios: espacios.length,
      reservasHoy: reservas.filter((reserva) => reserva.fecha === hoy).length,
      proximas: reservas.filter((reserva) => !yaPaso(reserva.fecha, reserva.franja)).length,
    }
  })

  if (cargando) return <EstadoCarga texto="Calculando resumen..." />
  if (error) return <AlertaError mensaje={error} />

  const indicadores = [
    { titulo: 'Residentes', valor: datos.usuarios, icono: 'bi-people', ruta: '/admin/usuarios' },
    { titulo: 'Espacios', valor: datos.espacios, icono: 'bi-grid-1x2', ruta: '/espacios' },
    { titulo: 'Reservas hoy', valor: datos.reservasHoy, icono: 'bi-calendar-event', ruta: '/admin/reservas' },
    { titulo: 'Próximas reservas', valor: datos.proximas, icono: 'bi-calendar-week', ruta: '/admin/reservas' },
  ]

  return (
    <section className="mb-5">
      <h2 className="h5 fw-bold mb-3">Resumen del conjunto</h2>
      <div className="row g-3">
        {indicadores.map((indicador) => (
          <div className="col-6 col-xl-3" key={indicador.titulo}>
            <Link to={indicador.ruta} className="kpi">
              <span className="kpi-icono"><i className={`bi ${indicador.icono}`}></i></span>
              <span className="kpi-valor">{indicador.valor}</span>
              <span className="kpi-titulo">{indicador.titulo}</span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

function ProximasReservas() {
  const { datos, cargando, error } = useDatosApi(listarMisReservas)

  if (cargando) return <EstadoCarga texto="Buscando tus reservas..." />
  if (error) return <AlertaError mensaje={error} />

  const proximas = datos.filter((reserva) => !yaPaso(reserva.fecha, reserva.franja)).slice(0, 3)

  if (proximas.length === 0) {
    return (
      <EstadoVacio icono="bi-calendar2-heart" titulo="No tienes reservas próximas">
        Elige un espacio abajo y aparta tu horario.
      </EstadoVacio>
    )
  }

  return (
    <div className="lista-reservas">
      {proximas.map((reserva) => (
        <div className="fila-reserva" key={reserva.id}>
          <div className="fila-reserva-fecha">
            <span>{textoFecha(reserva.fecha, { day: 'numeric' })}</span>
            <small>{textoFecha(reserva.fecha, { month: 'short' })}</small>
          </div>
          <div className="flex-grow-1">
            <p className="fw-semibold mb-0">{reserva.espacioNombre}</p>
            <small className="text-muted mayuscula-inicial">{textoFecha(reserva.fecha)} · {textoFranja(reserva.franja)}</small>
          </div>
        </div>
      ))}
    </div>
  )
}

function EspaciosDestacados() {
  const { datos, cargando, error } = useDatosApi(listarEspacios)

  if (cargando) return <EstadoCarga texto="Cargando espacios..." />
  if (error) return <AlertaError mensaje={error} />
  if (datos.length === 0) {
    return <EstadoVacio icono="bi-grid-1x2" titulo="Aún no hay espacios registrados" />
  }

  return (
    <div className="row g-4">
      {datos.slice(0, 3).map((espacio) => (
        <div className="col-md-6 col-xl-4" key={espacio.id}>
          <TarjetaEspacio espacio={espacio} />
        </div>
      ))}
    </div>
  )
}

export function Inicio() {
  const { usuario } = useAuth()
  const primerNombre = usuario.nombres.split(' ')[0]

  return (
    <>
      <section className="bienvenida mb-5">
        <div>
          <p className="mayuscula-inicial mb-2 opacity-75">{textoFecha(fechaHoyISO(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <h1 className="fw-bold mb-2">Hola, {primerNombre} 👋</h1>
          <Autorizado
            permiso="usuarios:gestionar"
            alternativa={<p className="mb-0 opacity-75">¿Qué espacio quieres disfrutar hoy?</p>}
          >
            <p className="mb-0 opacity-75">Este es el estado de tu conjunto residencial.</p>
          </Autorizado>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <Link to="/espacios" className="btn btn-acento">
            <i className="bi bi-calendar-plus me-2"></i>Hacer una reserva
          </Link>
          <Autorizado permiso="espacios:gestionar">
            <Link to="/admin/espacios/nuevo" className="btn btn-outline-light">
              <i className="bi bi-plus-lg me-2"></i>Nuevo espacio
            </Link>
          </Autorizado>
        </div>
      </section>

      <Autorizado permiso="usuarios:gestionar">
        <ResumenAdministrador />
      </Autorizado>

      <div className="row g-4 mb-5">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 fw-bold mb-0">Tus próximas reservas</h2>
            <Link to="/mis-reservas" className="small fw-semibold">Ver todas <i className="bi bi-arrow-right"></i></Link>
          </div>
          <ProximasReservas />
        </div>
      </div>

      <section>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 fw-bold mb-0">Espacios del conjunto</h2>
          <Link to="/espacios" className="small fw-semibold">Ver todos <i className="bi bi-arrow-right"></i></Link>
        </div>
        <EspaciosDestacados />
      </section>
    </>
  )
}
