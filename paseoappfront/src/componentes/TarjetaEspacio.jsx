import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Autorizado } from './Autorizado.jsx'

// Si la URL de la foto no carga, mostramos un icono en lugar de la imagen rota
export function FotoEspacio({ src, alt = '' }) {
    const [fallo, setFallo] = useState(false)
    if (!src || fallo) {
        return <div className="foto-vacia"><i className="bi bi-image"></i></div>
    }
    return <img src={src} alt={alt} loading="lazy" onError={() => setFallo(true)} />
}

// Tarjeta de un espacio. Los botones cambian segun el rol:
// todos pueden reservar; solo el administrador ve editar y eliminar.
export function TarjetaEspacio({ espacio, alEliminar }) {
    return (
        <article className="card tarjeta-espacio h-100">
            <div className="tarjeta-espacio-foto">
                <FotoEspacio src={espacio.foto} alt={espacio.nombre} />
                <span className="tarjeta-espacio-aforo">
                    <i className="bi bi-people-fill me-1"></i>{espacio.aforo} personas
                </span>
            </div>
            <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold mb-1">{espacio.nombre}</h5>
                <p className="text-muted small flex-grow-1">{espacio.descripcion}</p>

                <div className="d-flex gap-2 align-items-center">
                    <Autorizado permiso="reservas:crear">
                        <Link to={`/espacios/${espacio.id}/reservar`} className="btn btn-primary flex-grow-1">
                            <i className="bi bi-calendar-plus me-2"></i>Reservar
                        </Link>
                    </Autorizado>
                    <Autorizado permiso="espacios:gestionar">
                        <Link to={`/admin/espacios/${espacio.id}/editar`} className="btn btn-icono" title="Editar" aria-label={`Editar ${espacio.nombre}`}>
                            <i className="bi bi-pencil"></i>
                        </Link>
                        {alEliminar && (
                            <button type="button" className="btn btn-icono btn-icono-peligro" title="Eliminar" aria-label={`Eliminar ${espacio.nombre}`} onClick={() => alEliminar(espacio)}>
                                <i className="bi bi-trash3"></i>
                            </button>
                        )}
                    </Autorizado>
                </div>
            </div>
        </article>
    )
}
