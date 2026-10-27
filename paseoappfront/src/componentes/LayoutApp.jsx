import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'

import { useAuth } from '../contexto/ContextoAuth.jsx'
import { GRUPOS_MENU } from '../auth/navegacion.js'
import { Avatar } from './Avatar.jsx'
import { InsigniaRol } from './InsigniaRol.jsx'

function Marca() {
    return (
        <Link to="/inicio" className="marca">
            <span className="marca-icono"><i className="bi bi-buildings"></i></span>
            <span>Paseo<span className="text-acento">.</span></span>
        </Link>
    )
}

// Estructura de todas las paginas privadas: menu lateral + contenido
export function LayoutApp() {
    const { usuario, puede, cerrarSesion } = useAuth()
    const [menuAbierto, setMenuAbierto] = useState(false)

    // Solo dejamos las opciones que el rol del usuario puede ver
    const grupos = GRUPOS_MENU
        .map((grupo) => ({
            ...grupo,
            opciones: grupo.opciones.filter((opcion) => !opcion.permiso || puede(opcion.permiso)),
        }))
        .filter((grupo) => grupo.opciones.length > 0)

    function cerrarMenu() {
        setMenuAbierto(false)
    }

    function pintarOpcion(opcion) {
        return (
            <NavLink
                key={opcion.ruta}
                to={opcion.ruta}
                onClick={cerrarMenu}
                className={({ isActive }) => `enlace-menu ${isActive ? 'activo' : ''}`}
            >
                <i className={`bi ${opcion.icono}`}></i>
                {opcion.texto}
            </NavLink>
        )
    }

    return (
        <div className="app">
            <aside className={`barra-lateral ${menuAbierto ? 'abierta' : ''}`}>
                <div className="d-flex align-items-center justify-content-between">
                    <Marca />
                    <button type="button" className="btn btn-link text-white d-lg-none" onClick={cerrarMenu} aria-label="Cerrar menú">
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <nav className="menu">
                    {grupos.map((grupo) => (
                        <div key={grupo.titulo} className="grupo-menu">
                            <p className="titulo-grupo-menu">{grupo.titulo}</p>
                            {grupo.opciones.map(pintarOpcion)}
                        </div>
                    ))}
                </nav>

                <div className="usuario-lateral">
                    <Avatar nombres={usuario.nombres} tamaño="sm" />
                    <div className="flex-grow-1 overflow-hidden">
                        <p className="mb-1 fw-semibold text-truncate">{usuario.nombres}</p>
                        <InsigniaRol rol={usuario.rol} />
                    </div>
                    <button type="button" className="btn btn-icono" onClick={cerrarSesion} title="Cerrar sesión" aria-label="Cerrar sesión">
                        <i className="bi bi-box-arrow-right"></i>
                    </button>
                </div>
            </aside>

            {menuAbierto && <div className="fondo-menu d-lg-none" onClick={cerrarMenu}></div>}

            <div className="app-contenido">
                <header className="barra-superior d-lg-none">
                    <button type="button" className="btn btn-icono" onClick={() => setMenuAbierto(true)} aria-label="Abrir menú">
                        <i className="bi bi-list"></i>
                    </button>
                    <Marca />
                    <Avatar nombres={usuario.nombres} tamaño="sm" />
                </header>

                <main className="app-principal">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
