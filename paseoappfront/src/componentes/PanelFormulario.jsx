import { Link, useLocation } from 'react-router-dom'

// Dibujo de lineas blancas: el conjunto residencial con sus zonas comunes
// (piscina con parasol, jardin) y un calendario con la reserva confirmada
function Ilustracion() {
  const ventanasTorre = [64, 84, 104, 124, 144].flatMap((y) => [82, 104, 126].map((x) => [x, y]))
  const ventanasBloque = [108, 128, 148, 168].flatMap((y) => [162, 182].map((x) => [x, y]))
  const destellos = [[30, 60], [52, 30], [146, 22], [244, 104]]

  return (
    <svg className="auth-dibujo" viewBox="0 0 260 210" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {destellos.map(([x, y]) => (
        <path key={`${x}-${y}`} d={`M${x} ${y - 4}v8M${x - 4} ${y}h8`} strokeOpacity=".6" />
      ))}

      {/* Torre de apartamentos */}
      <path d="M66 50H154" />
      <rect x="70" y="50" width="80" height="140" rx="2" />
      {ventanasTorre.map(([x, y]) => (
        <rect key={`t${x}-${y}`} x={x} y={y} width="12" height="10" rx="1.5" strokeOpacity=".8" />
      ))}
      <rect x="100" y="166" width="20" height="24" rx="2" />

      {/* Bloque bajo */}
      <rect x="150" y="95" width="50" height="95" rx="2" />
      {ventanasBloque.map(([x, y]) => (
        <rect key={`b${x}-${y}`} x={x} y={y} width="10" height="10" rx="1.5" strokeOpacity=".8" />
      ))}

      {/* Calendario con la reserva confirmada */}
      <rect x="168" y="28" width="62" height="56" rx="6" fill="#fff" fillOpacity=".12" />
      <path d="M168 42H230M182 22V32M216 22V32" />
      <path d="M186 63L194 71L211 54" strokeWidth="2.25" />

      {/* Piscina con parasol */}
      <path d="M40 190V142M18 142Q40 118 62 142Z" />
      <path d="M14 182q6-5 12 0t12 0t12 0t12 0" strokeOpacity=".8" />

      {/* Jardin */}
      <circle cx="228" cy="150" r="16" />
      <path d="M228 166V190M221 158l7 6l7-8" strokeOpacity=".8" />

      <path d="M10 190H250" strokeOpacity=".55" />
    </svg>
  )
}

// Layout de login y registro: tarjeta dividida en dos.
// "modo" marca cual pestaña esta activa: 'login' o 'registro'.
export function PanelFormulario({ modo, mensaje, children }) {
  // Conservamos state.desde al cambiar de pestaña, para volver a la pagina que se queria ver
  const { state } = useLocation()
  const esLogin = modo === 'login'

  function clase(activo) {
    return activo ? 'activo' : ''
  }

  return (
    <div className="pantalla-auth">
      <div className="tarjeta-auth">
        <aside className="auth-ilustracion d-none d-lg-flex">
          <span className="auth-logo"><i className="bi bi-buildings"></i></span>
          <p className="auth-mensaje">{mensaje}</p>
          <Ilustracion />
          <div className="auth-puntos" aria-hidden="true">
            <span></span><span className="activo"></span><span></span><span></span>
          </div>
        </aside>

        <section className="auth-formulario">
          <nav className="conmutador-auth" aria-label="Cambiar de formulario">
            <Link to="/login" state={state} className={clase(esLogin)}>Ingresar</Link>
            <Link to="/registro" state={state} className={clase(!esLogin)}>Registrarse</Link>
          </nav>

          <div className="auth-contenido">
            <h1 className="titulo-auth">{esLogin ? 'Iniciar sesión' : 'Crear cuenta'}</h1>

            {children}
          </div>
        </section>
      </div>
    </div>
  )
}
