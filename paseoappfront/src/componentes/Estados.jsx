// Componentes pequeños para los 3 estados de cualquier consumo del API:
// cargando, sin datos y error.

export function EstadoCarga({ texto = 'Cargando...', pantallaCompleta = false }) {
    return (
        <div className={`estado ${pantallaCompleta ? 'estado-pantalla' : ''}`} role="status">
            <div className="spinner-border text-primary" aria-hidden="true"></div>
            <p className="text-muted mt-3 mb-0">{texto}</p>
        </div>
    )
}

export function EstadoVacio({ icono = 'bi-inbox', titulo, children }) {
    return (
        <div className="estado estado-vacio">
            <div className="icono-circulo mb-3"><i className={`bi ${icono}`}></i></div>
            <h5 className="fw-bold mb-1">{titulo}</h5>
            {children && <div className="text-muted">{children}</div>}
        </div>
    )
}

export function AlertaError({ mensaje }) {
    if (!mensaje) {
        return null
    }
    return (
        <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
            <i className="bi bi-exclamation-octagon"></i>
            <span>{mensaje}</span>
        </div>
    )
}
